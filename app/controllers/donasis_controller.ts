import type { HttpContext } from '@adonisjs/core/http'
import Donasi from '#models/donasi'
import Donatur from '#models/donatur'
import Kategori from '#models/kategori'
import Kampanye from '#models/kampanye'
import TransaksiDonasis from '#models/transaksi_donasis'

export default class DonasisController {
  /**
   * Menampilkan daftar semua donasi.
   */
 async index({ view }: HttpContext) {
    const totalSeluruhDonasi = await TransaksiDonasis.query()
      .where('status', 'berhasil')
      .sum('jumlah as total')
    
    const kampanyes = await Kampanye.query()
      .preload('kategori')
      .withCount('transaksiDonasis', (query) => {
        query.as('jumlah_transaksi')
      })
      .withAggregate('transaksiDonasis', (query) => {
        query.sum('jumlah').as('terkumpul')
      })
      .orderBy('created_at', 'desc')

    return view.render('pages/admin/donasi_index', { 
      kampanyes,
      totalSeluruhDonasi: totalSeluruhDonasi[0].total || 0
    })
  }

  /**
   * Menampilkan form untuk membuat donasi baru.
   */
  async create({ view }: HttpContext) {
    // Ambil data donatur dan kategori untuk ditampilkan di dropdown form
    const donaturs = await Donatur.all()
    const kategoris = await Kategori.all()
    return view.render('pages/admin/donasi_form', { donaturs, kategoris })
  }

  /**
   * Menyimpan donasi baru ke database.
   */
  async store({ request, response, session }: HttpContext) {
    const data = request.only(['donaturId', 'kategoriId', 'jumlah', 'tanggal'])
    await Donasi.create(data)

    session.flash('success', 'Data donasi baru berhasil ditambahkan!')
    return response.redirect().toRoute('admin.donasi.index')
  }

  /**
   * Menampilkan form untuk mengedit donasi.
   */
  async edit({ params, view }: HttpContext) {
    const donasi = await Donasi.findOrFail(params.id)
    const donaturs = await Donatur.all()
    const kategoris = await Kategori.all()
    return view.render('pages/admin/donasi_form', { donasi, donaturs, kategoris })
  }

  /**
   * Memperbarui data donasi di database.
   */
  async update({ params, request, response, session }: HttpContext) {
    const donasi = await Donasi.findOrFail(params.id)
    const data = request.only(['donaturId', 'kategoriId', 'jumlah', 'tanggal'])
    
    donasi.merge(data)
    await donasi.save()

    session.flash('success', 'Data donasi berhasil diperbarui!')
    return response.redirect().toRoute('admin.donasi.index')
  }

  /**
   * Menghapus data donasi.
   */
  async destroy({ params, response, session }: HttpContext) {
    const donasi = await Donasi.findOrFail(params.id)
    await donasi.delete()

    session.flash('success', 'Data donasi berhasil dihapus!')
    return response.redirect().back()
  }
}
