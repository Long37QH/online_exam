import { defineStore } from 'pinia'
import { useCookie } from 'nuxt/app'

export const useAuthStore = defineStore('auth', {
  state: () => ({
<<<<<<< HEAD
    token: useCookie<string | null>('token', { default: () => null }),
    user: useCookie<any | null>('user', { default: () => null })
  }),
  actions: {
    setAuthData(token: string, user: any) {
      const tokenCookie = useCookie<string | null>('token');
      const userCookie = useCookie<any | null>('user');

      tokenCookie.value = token;
      userCookie.value = user;

      this.token = tokenCookie;
      this.user = userCookie;
    },
    logout() {
      const tokenCookie = useCookie<string | null>('token');
      const userCookie = useCookie<any | null>('user');

      tokenCookie.value = null;
      userCookie.value = null;

      this.token = null;
      this.user = null;

=======
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
>>>>>>> e43d149f81e6b26604a2804bfe55d739b629db76
      localStorage.removeItem('rememberMe');
    }
  }
})
