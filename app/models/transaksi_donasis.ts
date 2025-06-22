import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import Donatur from '#models/donatur'
import Kampanye from '#models/kampanye'
import Donasi from '#models/donasi'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class TransaksiDonasis extends BaseModel {
  public static table = 'transaksi_donasi'

  @column({ isPrimary: true })
  public declare id: number
  
  @column({ columnName: 'donasi_id' }) 
  public declare donasiId: number

  @column({ columnName: 'kode_transaksi' })
  public declare kodeTransaksi: string

  @column({ columnName: 'kampanye_id' })
  public declare kampanyeId: number

  @column()
  public declare jumlah: number

  @column()
  public declare status: 'pending' | 'berhasil' | 'gagal'

  @column({ columnName: 'metode_pembayaran' })
  public declare metodePembayaran: string | null

  @column.dateTime({ autoCreate: true, columnName: 'created_at' })
  public declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, columnName: 'updated_at' })
  public declare updatedAt: DateTime


  @belongsTo(() => Kampanye)
  public declare kampanye: BelongsTo<typeof Kampanye>
  
  @belongsTo(() => Donasi)
  public declare donasi: BelongsTo<typeof Donasi>

}
