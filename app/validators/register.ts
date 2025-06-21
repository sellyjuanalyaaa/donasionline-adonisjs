import vine from '@vinejs/vine'

/**
 * Validator untuk registrasi user baru (Admin).
 */
export const registerValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3),
    email: vine
      .string()
      .trim()
      .email()
      .unique(async (db, value) => {
        // Pastikan email belum terdaftar di tabel 'users'
        const user = await db.from('users').where('email', value).first()
        return !user
      }),
    password: vine.string().minLength(8).confirmed(),
  })
)
