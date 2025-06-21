import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'donasis'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      // 1. Hapus foreign key dan kolom 'kategori_id' yang lama
      table.dropForeign('kategori_id')
      table.dropColumn('kategori_id')

      // 2. Tambahkan kolom 'kampanye_id' yang baru dan hubungkan ke tabel 'kampanyes'
      table
        .integer('kampanye_id')
        .unsigned()
        .references('id')
        .inTable('kampanyes')
        .onDelete('CASCADE')
        .after('donatur_id') // Posisikan setelah kolom donatur_id
    })
  }

  async down() {
    // Logika untuk membatalkan perubahan jika diperlukan
    this.schema.alterTable(this.tableName, (table) => {
      table.dropForeign('kampanye_id')
      table.dropColumn('kampanye_id')
      
      table.integer('kategori_id').unsigned().references('id').inTable('kategoris').onDelete('CASCADE')
    })
  }
}
