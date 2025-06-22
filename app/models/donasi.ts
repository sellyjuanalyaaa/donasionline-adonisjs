import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import Donatur from '#models/donatur'
import Kampanye from '#models/kampanye' 
import TransaksiDonasi from '#models/transaksi_donasis'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'

export default class Donasi extends BaseModel {
  @column({ isPrimary: true })
  public declare id: number

  @column({ columnName: 'donatur_id' })
  public declare donaturId: number

  @column({ columnName: 'kampanye_id' })
  public declare kampanyeId: number

  @column()
  public declare jumlah: number

  @column.date()
  public declare tanggal: DateTime

  @column.dateTime({ autoCreate: true, columnName: 'created_at' })
  public declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, columnName: 'updated_at' })
  public declare updatedAt: DateTime

  @belongsTo(() => Donatur)
  public declare donatur: BelongsTo<typeof Donatur>
  
  @belongsTo(() => Kampanye)
  public declare kampanye: BelongsTo<typeof Kampanye>

  @hasMany(() => TransaksiDonasi)
  public declare transaksiDonasis: HasMany<typeof TransaksiDonasi>
}
