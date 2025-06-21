import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'kampanyes'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('judul').notNullable()
      table.text('deskripsi', 'longtext').nullable()
      
      // Foreign Key ke Tabel Kategori
      table.integer('kategori_id').unsigned().references('id').inTable('kategoris').onDelete('SET NULL')

      table.decimal('target_donasi', 15, 2).notNullable()
      table.date('tanggal_mulai').nullable()
      table.date('tanggal_selesai').nullable()
      table.string('gambar').nullable()
      table.enum('status', ['aktif', 'selesai', 'ditutup']).defaultTo('aktif')
      
      table.timestamps(true, true)

    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
