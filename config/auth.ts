import { defineConfig } from '@adonisjs/auth'
import { sessionGuard, sessionUserProvider } from '@adonisjs/auth/session'

const authConfig = defineConfig({
  // Guard default, akan kita gunakan untuk Admin
  default: 'web', 

  guards: {
    // Guard untuk Admin, menggunakan provider 'users'
    web: sessionGuard({
      displayer: '/login', // Jika admin belum login, arahkan ke sini
      provider: sessionUserProvider({
        model: () => import('#models/user'),
      }),
    }),

    // Guard BARU untuk Donatur, menggunakan provider 'donaturs'
    donatur: sessionGuard({
      displayer: '/donatur/login', // Jika donatur belum login, arahkan ke sini
      provider: sessionUserProvider({
        model: () => import('#models/donatur'),
      }),
    }),
  },
})

export default authConfig
