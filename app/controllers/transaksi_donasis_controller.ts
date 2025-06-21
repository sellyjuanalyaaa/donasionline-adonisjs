import type { HttpContext } from '@adonisjs/core/http'
import TransaksiDonasi from '#models/transaksi_donasis'

export default class TransaksiDonasisController {
  /**
   * Menampilkan daftar semua transaksi.
   */
 async index({ request, view }: HttpContext) {
    const search = request.input('search', '')
    
    // Gunakan nested preloading untuk memuat donatur melalui donasi
    const query = TransaksiDonasi.query()
                                .preload('kampanye')
                                .preload('donasi', (donasiQuery) => {
                                    donasiQuery.preload('donatur')
                                })

    if (search) {
      query.whereHas('donasi', (donasiBuilder) => {
        donasiBuilder.whereHas('donatur', (donaturBuilder) => {
          donaturBuilder.where('nama', 'like', `%${search}%`)
        })
      }).orWhereHas('kampanye', (builder) => {
        builder.where('judul', 'like', `%${search}%`)
      })
    }
    
    const transaksis = await query.orderBy('created_at', 'desc')
    
    return view.render('pages/admin/transaksi_donasi_index', { transaksis, search })
  }

}
