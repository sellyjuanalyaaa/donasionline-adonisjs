import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { registerValidator } from '#validators/register'
import { loginValidator } from '#validators/login' // 1. Impor login validator

export default class AdminAuthController {
  public async showLogin({ view }: HttpContext) {
    return view.render('pages/auth/admin_login')
  }

  public async login({ request, auth, response, session }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)

    try {
      const user = await User.verifyCredentials(email, password)
      await auth.use('web').login(user)

      return response.redirect().toRoute('admin.dashboard')
    } catch (error) {
      session.flash({ error: 'Email atau password yang Anda masukkan salah.' })
      return response.redirect().back()
    }
  }

  public async showRegister({ view }: HttpContext) {
    return view.render('pages/auth/admin_register')
  }

  public async register({ request, response, auth, session }: HttpContext) {
    try {
      const payload = await request.validateUsing(registerValidator)
      const user = await User.create(payload)
      await auth.use('web').login(user)
      return response.redirect().toRoute('admin.dashboard')
    } catch (error) {
      session.flash({ errors: error.messages })
      return response.redirect().back()
    }
  }

  public async logout({ auth, response }: HttpContext) {
    await auth.use('web').logout()
    return response.redirect().toRoute('home')
  }
}
