import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import Kategori from '#models/kategori'
import TransaksiDonasi from '#models/transaksi_donasis' 
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'

export default class Kampanye extends BaseModel {
  @column({ isPrimary: true })
  public declare id: number

  @column()
  public declare judul: string

  @column()
  public declare deskripsi: string | null
  
  @column({ columnName: 'kategori_id' })
  public declare kategoriId: number | null

  @column({ columnName: 'target_donasi' })
  public declare targetDonasi: number

  @column.date({ columnName: 'tanggal_mulai' })
  public declare tanggalMulai: DateTime | null

  @column.date({ columnName: 'tanggal_selesai' })
  public declare tanggalSelesai: DateTime | null

  @column()
  public declare gambar: string

  @column()
  public declare status: 'aktif' | 'selesai' | 'ditutup'

  @belongsTo(() => Kategori)
  public declare kategori: BelongsTo<typeof Kategori>

  @hasMany(() => TransaksiDonasi)
  public declare transaksiDonasis: HasMany<typeof TransaksiDonasi>

  @column.dateTime({ autoCreate: true, columnName: 'created_at' })
  public declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, columnName: 'updated_at' })
  public declare updatedAt: DateTime
}
