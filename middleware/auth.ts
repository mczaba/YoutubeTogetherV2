import { Middleware } from '@nuxt/types'

const authMiddleware: Middleware = (context) => {
  const room = context.route.params.name
  if (!context.store.getters['auth/name']) {
    context.redirect(`/join/${room}`)
  }
}

export default authMiddleware
