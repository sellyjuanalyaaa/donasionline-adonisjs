import vine from '@vinejs/vine'


export const kampanyeValidator = vine.compile(
  vine.object({
    judul: vine.string().trim().minLength(5),
    kategoriId: vine.number().exists(async (db, value) => {
      // Pastikan kategoriId yang dikirim benar-benar ada di tabel 'kategoris'
      const kategori = await db.from('kategoris').where('id', value).first()
      return !!kategori
    }),
    deskripsi: vine.string().trim().minLength(20),
    targetDonasi: vine.number().min(10000),
    tanggalMulai: vine.date(),
    tanggalSelesai: vine.date().after('self.tanggalMulai'),
    status: vine.enum(['aktif', 'selesai', 'ditutup']),
    

    gambar: vine.file({
      size: '2mb',
      extnames: ['jpg', 'png', 'jpeg', 'webp'],
    }).optional(),
  })
)
