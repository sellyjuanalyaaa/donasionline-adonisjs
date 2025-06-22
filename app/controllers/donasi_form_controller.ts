import type { HttpContext } from '@adonisjs/core/http'
import Kampanye from '#models/kampanye'
import Donasi from '#models/donasi'
import TransaksiDonasis from '#models/transaksi_donasis' 
import { cuid } from '@adonisjs/core/helpers'
import { DateTime } from 'luxon' 

export default class DonasiFormController {

  async show({ params, view, response, session }: HttpContext) {
    const kampanye = await Kampanye.query()
      .where('id', params.kampanye_id)
      .withAggregate('transaksiDonasis', (query) => {
        query.where('status', 'berhasil').sum('jumlah').as('terkumpul')
      })
      .firstOrFail()

    const terkumpul = Number(kampanye.$extras.terkumpul || 0)
    const sisaTarget = Number(kampanye.targetDonasi) - terkumpul
    const persentaseTerkumpul = (terkumpul / Number(kampanye.targetDonasi)) * 100;

    // Menentukan apakah target sudah tercapai atau terlampaui
    const isTargetFull = sisaTarget <= 0;

    if (isTargetFull) {
        session.flash({ info: 'Target donasi untuk kampanye ini sudah tercapai 100%. Terima kasih atas dukungan Anda!' });
    }

    return view.render('pages/donatur/donasi_form', {
        kampanye,
        sisaTarget,
        isTargetFull, 
        persentaseTerkumpul 
    });
  }


  async store({ request, auth, response, session }: HttpContext) {
    const donatur = auth.use('donatur').user!
    const { jumlah, kampanye_id } = request.only(['jumlah', 'kampanye_id'])

    // Ambil data kampanye lagi untuk validasi di sisi server 
    const kampanye = await Kampanye.query()
      .where('id', kampanye_id)
      .withAggregate('transaksiDonasis', (query) => {
        query.where('status', 'berhasil').sum('jumlah').as('terkumpul')
      })
      .firstOrFail()

    const terkumpul = Number(kampanye.$extras.terkumpul || 0)
    const sisaTarget = Number(kampanye.targetDonasi) - terkumpul

    // Validasi server-side tambahan: Mencegah donasi jika target sudah tercapai/terlampaui
    if (sisaTarget <= 0) {
      session.flash({ error: 'Kampanye ini sudah mencapai target atau telah berakhir. Donasi tidak dapat dilanjutkan.' });
      return response.redirect().back();
    }

    // Validasi jumlah donasi agar tidak melebihi sisa target
    if (jumlah > sisaTarget) {
      session.flash({ errors: [{ field: 'jumlah', message: 'Jumlah donasi tidak boleh melebihi sisa target yang dibutuhkan.' }] });
      session.flashExcept(['_csrf']); // Pertahankan input sebelumnya
      return response.redirect().back();
    }
    // Minimal donasi (misal 1000)
    if (jumlah < 1000) {
        session.flash({ errors: [{ field: 'jumlah', message: 'Jumlah donasi minimal Rp1.000.' }] });
        session.flashExcept(['_csrf']);
        return response.redirect().back();
    }


    // Buat data di tabel donasis
    const donasi = await Donasi.create({
      donaturId: donatur.id,
      kampanyeId: kampanye_id,
      jumlah: jumlah,
      tanggal: DateTime.local(), // Gunakan Luxon DateTime
    })

    // Buat data di tabel transaksi_donasi
    await TransaksiDonasis.create({
      donasiId: donasi.id,
      kampanyeId: kampanye_id,
      jumlah: jumlah,
      kodeTransaksi: `INV-${cuid()}`,
      status: 'berhasil',
    })

    session.flash({ success: 'Terima kasih! Donasi Anda telah berhasil diterima.' })
    return response.redirect().toRoute('donatur.riwayat')
  }
}