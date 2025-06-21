import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'donaturs'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.string('nama').notNullable()
      table.string('email').notNullable().unique()
      table.string('password').notNullable()
      table.string('telepon').nullable()
      table.text('alamat').nullable()

          table.timestamps(true, true)

    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
