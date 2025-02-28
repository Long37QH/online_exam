import { defineStore } from 'pinia'
import { useCookie } from 'nuxt/app'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: useCookie<string | null | any>('token', { default: () => null }),
    user: useCookie<any | null>('user', { default: () => null })
  }),

  actions: {
    setAuthData(token: string, user: any) {
    console.log("api trả về :");

      this.token = token
      this.user = user
    },

    logout() {
      this.token = null
      this.user = null
      localStorage.removeItem('rememberMe');
    }
  }
})
