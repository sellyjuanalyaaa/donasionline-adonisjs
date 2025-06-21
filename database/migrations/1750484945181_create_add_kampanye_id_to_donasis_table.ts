import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  // Nama tabel di database
  protected tableName = 'transaksi_donasi'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id') // Membuat kolom 'id' auto-increment sebagai primary key

      // Foreign Key yang menghubungkan ke tabel 'donasis'
      table
        .integer('donasi_id')
        .unsigned()
        .references('id')
        .inTable('donasis')
        .onDelete('CASCADE') // Jika data donasi induk dihapus, transaksi ini ikut terhapus

      // Foreign Key yang menghubungkan ke tabel 'kampanyes'
      table
        .integer('kampanye_id')
        .unsigned()
        .references('id')
        .inTable('kampanyes')
        .onDelete('CASCADE') // Jika data kampanye dihapus, transaksi ini ikut terhapus

      // Kolom-kolom lain untuk detail transaksi
      table.string('kode_transaksi').unique().notNullable()
      table.decimal('jumlah', 15, 2).notNullable()
      table.enum('status', ['pending', 'berhasil', 'gagal']).defaultTo('pending')
      table.string('metode_pembayaran').nullable()
      
      table.timestamps(true, true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
