import vine from '@vinejs/vine'

/**
 * Validator untuk login user (Admin).
 */
export const loginValidator = vine.compile(
  vine.object({
    email: vine.string().trim().email(),
    password: vine.string(),
  })
)
