import type { HttpContext } from '@adonisjs/core/http'
import Donatur from '#models/donatur'

export default class DonaturAuthController {

  async showLogin({ view }: HttpContext) {
    return view.render('pages/auth/donatur_login')
  }

  async login({ request, response, auth, session }: HttpContext) {
    const { email, password } = request.all()
    
    try {
      await Donatur.verifyCredentials(email, password)
      const donatur = await Donatur.findByOrFail('email', email)
      await auth.use('donatur').login(donatur)
      
      return response.redirect().toRoute('donatur.dashboard')
    } catch (error) {
      session.flash('error', 'Email atau password salah!')
      return response.redirect().back()
    }
  }

  async showRegister({ view }: HttpContext) {
    return view.render('pages/auth/donatur_register')
  }

  async register({ request, response, auth, session }: HttpContext) {
    const data = request.only(['nama', 'email', 'password', 'telepon'])
    const donatur = await Donatur.create(data)

    await auth.use('donatur').login(donatur)
    return response.redirect().toRoute('donatur.dashboard')
  }

  async logout({ auth, response }: HttpContext) {
    await auth.use('donatur').logout()
    return response.redirect().toRoute('home')
  }
}
