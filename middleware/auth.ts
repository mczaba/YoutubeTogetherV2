import { Middleware } from '@nuxt/types'

const authMiddleware: Middleware = (context) => {
  console.log(context.store.getters)
  if (!context.store.getters['auth/name']) {
    context.redirect('/join')
  }
}

export default authMiddleware
