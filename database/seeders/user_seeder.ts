import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'

export default class extends BaseSeeder {
  async run() {
    await User.create({
      name: 'Super Admin',
      email: 'admin@donasiku.com',
      password: 'password123', // Password akan otomatis di-hash oleh model
      role: 'admin',
    })
  }
}