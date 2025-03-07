import { defineStore } from 'pinia'
import { useCookie } from 'nuxt/app'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: useCookie<string | null>('token', { default: () => null }),
    user: null as any | null
  }),
  actions: {
    setAuthData(token: string, user: any, rememberMe: boolean) {
      if (rememberMe) {
        const tokenCookie = useCookie<string | null>('token', { maxAge: 60 * 60 * 24 * 7 })
        tokenCookie.value = token
      } else {
        // Cập nhật cookie session (sẽ bị mất khi tắt trình duyệt)
        const tokenCookie = useCookie<string | null>('token')
        tokenCookie.value = token
      }

      this.token = token
      this.user = user
    },
    logout() {
      const tokenCookie = useCookie<string | null>('token')
      tokenCookie.value = null

      this.token = null
      this.user = null
    }
  }
})
