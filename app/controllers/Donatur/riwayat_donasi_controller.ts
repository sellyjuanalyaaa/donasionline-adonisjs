import type { HttpContext } from '@adonisjs/core/http'
import TransaksiDonasi from '#models/transaksi_donasis'

export default class RiwayatDonasisController {
  /**
   * Menampilkan riwayat donasi untuk donatur yang sedang login.
   */
  async index({ view, auth }: HttpContext) {
    const donatur = auth.use('donatur').user!

    // PERBAIKAN: Gunakan whereHas untuk memfilter berdasarkan relasi
    const transaksis = await TransaksiDonasi.query()
      // Cari transaksi yang memiliki relasi 'donasi'
      // di mana 'donasi' tersebut memiliki 'donatur_id' yang cocok.
      .whereHas('donasi', (donasiQuery) => {
        donasiQuery.where('donatur_id', donatur.id)
      })
      .preload('kampanye') // Ambil juga data kampanye terkait
      .orderBy('created_at', 'desc')

    return view.render('pages/donatur/riwayat_donasi', { transaksis })
  }
}
