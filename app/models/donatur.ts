import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import hash from '@adonisjs/core/services/hash'
import { beforeSave } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import TransaksiDonasi from './transaksi_donasis.js'
import { Opaque } from '@adonisjs/core/types/helpers'

export type Password = Opaque<'password', string>

export default class Donatur extends BaseModel {
  @column({ isPrimary: true })
  public declare id: number

  @column()
  public declare nama: string

  @column()
  public declare email: string

  @column({ serializeAs: null })
  public declare password: Password

  @column()
  public declare telepon: string | null

  @column()
  public declare alamat: string | null

  @column.dateTime({ autoCreate: true })
  public declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public declare updatedAt: DateTime

  @beforeSave()
  public static async hashPassword(donatur: Donatur) {
    if (donatur.$dirty.password) {
      donatur.password = await hash.make(donatur.password)
    }
  }

  static async verifyCredentials(email: string, password: Password) {
    const user = await this.findBy('email', email)
    if (!user) {
      return null
    }

    if (await hash.verify(user.password, password)) {
      return user
    }

    return null
  }
  
  @hasMany(() => TransaksiDonasi)
  public declare transaksiDonasis: HasMany<typeof TransaksiDonasi>
}
