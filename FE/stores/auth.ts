import { defineStore } from 'pinia'
import { useCookie } from 'nuxt/app'

export const useAuthStore = defineStore('auth', {
  state: () => ({
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

      localStorage.removeItem('rememberMe');
    }
  }
})
