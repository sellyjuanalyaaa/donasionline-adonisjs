import type { HttpContext } from '@adonisjs/core/http'
import Kategori from '#models/kategori'

export default class KategorisController {
  /**
   * Menampilkan daftar semua kategori.
   */
  async index({ view }: HttpContext) {
    const kategoris = await Kategori.query().orderBy('created_at', 'desc')
    return view.render('pages/admin/kategori_index', { kategoris })
  }

  /**
   * Menampilkan form untuk membuat kategori baru.
   */
  async create({ view }: HttpContext) {
    // Mengarah ke file view khusus untuk create
    return view.render('pages/admin/kategori_create')
  }

  /**
   * Menyimpan kategori baru.
   */
  async store({ request, response, session }: HttpContext) {
    const data = request.only(['namaKategori'])
    await Kategori.create(data)
    
    session.flash({ success: 'Kategori baru berhasil ditambahkan!' })
    return response.redirect().toRoute('admin.kategori.index')
  }

  /**
   * Menampilkan form edit dengan data kategori yang sudah ada.
   */
  async edit({ params, view }: HttpContext) {
    const kategori = await Kategori.findOrFail(params.id)
    // Mengarah ke file view khusus untuk edit, sambil mengirim data kategori
    return view.render('pages/admin/kategori_edit', { kategori })
  }

  /**
   * Memperbarui data kategori.
   */
  async update({ params, request, response, session }: HttpContext) {
    const kategori = await Kategori.findOrFail(params.id)
    const data = request.only(['namaKategori'])
    
    kategori.merge(data)
    await kategori.save()

    session.flash({ success: 'Kategori berhasil diperbarui!' })
    return response.redirect().toRoute('admin.kategori.index')
  }

  /**
   * Menghapus data kategori.
   */
  async destroy({ params, response, session }: HttpContext) {
    const kategori = await Kategori.findOrFail(params.id)
    await kategori.delete()

    session.flash({ success: 'Kategori berhasil dihapus!' })
    return response.redirect().toRoute('admin.kategori.index')
  }
}
