import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import hash from '@adonisjs/core/services/hash'
import { beforeSave } from '@adonisjs/lucid/orm'
import { Opaque } from '@adonisjs/core/types/helpers'

export type Password = Opaque<'password', string>

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public declare id: number

  @column()
  public declare name: string

  @column()
  public declare email: string

  @column({ serializeAs: null })
  public declare password: Password
  
  @column()
  public declare role: string

  @column.dateTime({ autoCreate: true })
  public declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public declare updatedAt: DateTime | null

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await hash.make(user.password)
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

}

