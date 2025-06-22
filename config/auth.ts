import { defineConfig } from '@adonisjs/auth'
import { sessionGuard, sessionUserProvider } from '@adonisjs/auth/session'

const authConfig = defineConfig({
  default: 'web', 

  guards: {
    web: sessionGuard({
      displayer: '/login',
      provider: sessionUserProvider({
        model: () => import('#models/user'),
      }),
    }),


    donatur: sessionGuard({
      displayer: '/donatur/login',
      provider: sessionUserProvider({
        model: () => import('#models/donatur'),
      }),
    }),
  },
})

export default authConfig
