import type { HttpContext } from '@adonisjs/core/http'
import Kampanye from '#models/kampanye'
import Kategori from '#models/kategori'
import TransaksiDonasis from '#models/transaksi_donasis'



export default class DonaturDashboardController {
  public async index({ view, auth, request }: HttpContext) {
    const donatur = auth.use('donatur').user!

    const statsQuery = TransaksiDonasis.query()
      .where('status', 'berhasil')
      .whereHas('donasi', (donasiQuery) => {
        donasiQuery.where('donatur_id', donatur.id)
      })
      const totalDonasiResult = await statsQuery.clone().sum('jumlah as total')
    console.log('Hasil kueri totalDonasiResult (raw):', totalDonasiResult); // Akan menunjukkan array dengan objek yang punya $extras.total

    const totalDonasi = totalDonasiResult[0]?.$extras?.total
                        ? parseFloat(totalDonasiResult[0].$extras.total.toString())
                        : 0;

    const jumlahTransaksiResult = await statsQuery.clone().count('* as total')
    console.log('Hasil kueri jumlahTransaksiResult (raw):', jumlahTransaksiResult); // Akan menunjukkan array dengan objek yang punya $extras.total

    const jumlahTransaksi = jumlahTransaksiResult[0]?.$extras?.total
                          ? Number(jumlahTransaksiResult[0].$extras.total)
                          : 0;

    console.log('Nilai final totalDonasi:', totalDonasi);
    console.log('Nilai final jumlahTransaksi:', jumlahTransaksi);

    // --- PERBAIKAN UTAMA ADA DI SINI ---
    const { kategori_id } = request.qs()
    const query = Kampanye.query()
      .where('status', 'aktif')
      .preload('kategori')
      // Hitung total donasi yang berhasil untuk setiap kampanye dan simpan sebagai 'terkumpul'
      .withAggregate('transaksiDonasis', (q) => {
        q.where('status', 'berhasil').sum('jumlah').as('terkumpul')
      })

    if (kategori_id) {
      query.where('kategoriId', kategori_id)
    }
    
    const kampanyes = await query.orderBy('created_at', 'desc').exec()
    const kategoris = await Kategori.all()

    return view.render('pages/donatur/dashboard', {
      donatur,
      totalDonasi,
      jumlahTransaksi,
      kampanyes,
      kategoris,
      filters: { kategori_id }
    })
  }
}
