import type { HttpContext } from '@adonisjs/core/http'
import Donatur from '#models/donatur'

export default class DonatursController {
  /**
   * Menampilkan daftar semua donatur untuk admin.
   * Logika statistik pribadi sudah dihapus dari sini.
   */
  async index({ view }: HttpContext) {
    const donaturs = await Donatur.query().orderBy('created_at', 'desc')
    return view.render('pages/admin/donatur_index', { donaturs })
  }

  /**
   * Menampilkan form untuk membuat donatur baru.
   */
  async create({ view }: HttpContext) {
    return view.render('pages/admin/donatur_form')
  }

  /**
   * Menyimpan donatur baru.
   */
  async store({ request, response, session }: HttpContext) {
    const data = request.only(['nama', 'email', 'password', 'telepon', 'alamat'])
    await Donatur.create(data)

    session.flash({ success: 'Donatur baru berhasil ditambahkan!' })
    return response.redirect().toRoute('admin.donatur.index')
  }

  /**
   * Menampilkan form untuk mengedit donatur.
   */
  async edit({ params, view }: HttpContext) {
    const donatur = await Donatur.findOrFail(params.id)
    return view.render('pages/admin/donatur_form', { donatur })
  }

  /**
   * Memperbarui data donatur.
   */
  async update({ params, request, response, session }: HttpContext) {
    const donatur = await Donatur.findOrFail(params.id)
    const data = request.only(['nama', 'email', 'telepon', 'alamat'])
    
    const newPassword = request.input('password')
    if (newPassword) {
      data.password = newPassword
    }

    donatur.merge(data)
    await donatur.save()

    session.flash({ success: 'Data donatur berhasil diperbarui!' })
    return response.redirect().toRoute('admin.donatur.index')
  }

  /**
   * Menghapus data donatur.
   */
  async destroy({ params, response, session }: HttpContext) {
    const donatur = await Donatur.findOrFail(params.id)
    await donatur.delete()

    session.flash({ success: 'Data donatur berhasil dihapus!' })
    return response.redirect().toRoute('admin.donatur.index')
  }
}
