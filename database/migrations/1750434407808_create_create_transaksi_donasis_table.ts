import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  // PERBAIKAN: Mengubah nama tabel menjadi singular sesuai permintaan
  protected tableName = 'transaksi_donasis'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      
      // PERBAIKAN: Menghubungkan ke tabel 'donasis' bukan 'donaturs'
      table.integer('donasi_id').unsigned().references('id').inTable('donasis').onDelete('CASCADE')
      table.integer('kampanye_id').unsigned().references('id').inTable('kampanyes').onDelete('CASCADE')

      table.enum('status', ['pending', 'berhasil', 'gagal']).defaultTo('pending')
      
      // Menambahkan kolom lain yang berguna untuk transaksi
      table.string('kode_transaksi').unique().nullable()
      table.decimal('jumlah', 15, 2).nullable()
      table.string('metode_pembayaran').nullable()
      
                  table.timestamps(true, true)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
