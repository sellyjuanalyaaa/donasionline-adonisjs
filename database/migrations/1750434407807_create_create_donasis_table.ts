import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'donasis'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      // Foreign Keys
      table.integer('donatur_id').unsigned().references('id').inTable('donaturs').onDelete('CASCADE')
      table.integer('kategori_id').unsigned().references('id').inTable('kategoris').onDelete('SET NULL').nullable()

      table.decimal('jumlah', 12, 2).notNullable()
      table.date('tanggal').notNullable()
      
      table.timestamps(true, true)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
