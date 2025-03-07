import { defineStore } from 'pinia'
import { useCookie, useNuxtApp } from 'nuxt/app'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as any | null
  }),
  getters: {
    token: () => useCookie<string | null>('token', { default: () => null }).value
  },
  actions: {
    setAuthData(token: string, user: any, rememberMe: boolean) {
      const tokenCookie = useCookie<string | null>('token', {
        maxAge: rememberMe ? 60 * 60 * 24 * 7 : undefined
      })
      tokenCookie.value = token

      this.user = user
    },
    logout() {
      const tokenCookie = useCookie<string | null>('token')
      tokenCookie.value = null
      this.user = null
    },
    async initializeAuth() {
      const tokenCookie = useCookie<string | null>('token')
      if (tokenCookie.value) {
        const { $axios } = useNuxtApp() 
        try {
          const response = await $axios.get('/users/me', {
            headers: { Authorization: `Bearer ${tokenCookie.value}` }
          })
          this.user = response.data
        } catch (error) {
          this.logout()
        }
      }
    }
  }
})
