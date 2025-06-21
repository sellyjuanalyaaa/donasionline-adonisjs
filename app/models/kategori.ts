import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import Kampanye from '#models/kampanye'
import type { HasMany } from '@adonisjs/lucid/types/relations'

export default class Kategori extends BaseModel {
  @column({ isPrimary: true })
  public declare id: number

  @column({ columnName: 'nama_kategori' })
  public declare namaKategori: string

  @hasMany(() => Kampanye)
  public declare kampanyes: HasMany<typeof Kampanye>

  @column.dateTime({ autoCreate: true, columnName: 'created_at' })
  public declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, columnName: 'updated_at' })
  public declare updatedAt: DateTime
}
