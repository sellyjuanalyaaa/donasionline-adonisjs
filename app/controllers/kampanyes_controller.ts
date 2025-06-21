import type { HttpContext } from '@adonisjs/core/http'
import Kampanye from '#models/kampanye'
import Kategori from '#models/kategori'
import app from '@adonisjs/core/services/app'
import { cuid } from '@adonisjs/core/helpers'
import fs from 'node:fs'

export default class KampanyesController {
  async index({ view }: HttpContext) {
    const kampanyes = await Kampanye.query()
      .preload('kategori')
      .withAggregate('transaksiDonasis', (query) => {
        query.sum('jumlah').as('terkumpul')
      })
      .orderBy('created_at', 'desc')

    return view.render('pages/admin/kampanye_index', { kampanyes })
  }

  async create({ view }: HttpContext) {
    const kategoris = await Kategori.all()
    return view.render('pages/admin/kampanye_form', { kategoris })
  }

  async store({ request, response, session }: HttpContext) {
    // 1. Ambil semua data teks dari form
    const data = request.only([
      'judul', 'kategoriId', 'deskripsi', 'targetDonasi',
      'tanggalMulai', 'tanggalSelesai', 'status'
    ])
    const gambar = request.file('gambar', {
      size: '2mb',
      extnames: ['jpg', 'png', 'jpeg', 'webp'],
    })

    let gambarPath: string | undefined = undefined;
    // 3. Validasi dan pindahkan file jika ada
    if (gambar && gambar.isValid) {
      const namaFile = `${cuid()}.${gambar.extname}`
      await gambar.move(app.makePath('public/uploads/kampanye'), { name: namaFile })
      gambarPath = `uploads/kampanye/${namaFile}`
    }

    await Kampanye.create({ ...data, gambar: gambarPath })

    session.flash({ success: 'Kampanye baru berhasil ditambahkan!' })
    return response.redirect().toRoute('admin.kampanye.index')
  }

  async edit({ params, view }: HttpContext) {
    const kampanye = await Kampanye.findOrFail(params.id)
    const kategoris = await Kategori.all()
    return view.render('pages/admin/kampanye_form', { kampanye, kategoris })
  }

  async update({ params, request, response, session }: HttpContext) {
    const kampanye = await Kampanye.findOrFail(params.id)
    const data = request.only([
      'judul', 'kategoriId', 'deskripsi', 'targetDonasi',
      'tanggalMulai', 'tanggalSelesai', 'status'
    ])
    const gambar = request.file('gambar')
    
    let gambarPath: string | null = kampanye.gambar;
    if (gambar && gambar.isValid) {
      // Hapus gambar lama jika ada
      if (kampanye.gambar) {
        fs.unlink(app.makePath('public', kampanye.gambar), () => {})
      }
      const namaFile = `${cuid()}.${gambar.extname}`
      await gambar.move(app.makePath('public/uploads/kampanye'), { name: namaFile })
      gambarPath = `uploads/kampanye/${namaFile}`
    }

    kampanye.merge({ ...data, gambar: gambarPath })
    await kampanye.save()
    
    session.flash({ success: 'Kampanye berhasil diperbarui!' })
    return response.redirect().toRoute('admin.kampanye.index')
  }

  async destroy({ params, response, session }: HttpContext) {
    const kampanye = await Kampanye.findOrFail(params.id)
    if (kampanye.gambar) {
      fs.unlink(app.makePath('public', kampanye.gambar), () => {})
    }
    await kampanye.delete()
    
    session.flash({ success: 'Kampanye berhasil dihapus!' })
    return response.redirect().back()
  }
}
