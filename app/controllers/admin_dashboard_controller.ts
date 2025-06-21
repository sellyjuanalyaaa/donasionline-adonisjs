import type { HttpContext } from '@adonisjs/core/http'
import Kampanye from '#models/kampanye'
import Donatur from '#models/donatur'
import TransaksiDonasi from '#models/transaksi_donasis'
import Kategori from '#models/kategori'

export default class AdminDashboardController {
  public async index({ view }: HttpContext) {
    const totalKampanye = await Kampanye.query().count('* as total')
    const totalDonatur = await Donatur.query().count('* as total')
    const totalKategori = await Kategori.query().count('* as total')
    const totalDonasi = await TransaksiDonasi.query().where('status', 'berhasil').sum('jumlah as total')

    return view.render('pages/admin/dashboard', {
      totalKampanye: totalKampanye[0].$extras.total,
      totalDonatur: totalDonatur[0].$extras.total,
      totalKategori: totalKategori[0].$extras.total,
      totalDonasi: totalDonasi[0].$extras.total || 0
    })
  }
}
