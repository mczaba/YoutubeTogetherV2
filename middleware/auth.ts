import { Middleware } from '@nuxt/types'

const authMiddleware: Middleware = (context) => {
  if (!context.store.getters['auth/name']) {
    context.redirect('/join')
  }
}

export default authMiddleware
