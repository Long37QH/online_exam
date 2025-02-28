import { defineNuxtRouteMiddleware, navigateTo } from 'nuxt/app'
import { useAuthStore } from '../stores/auth'

export default defineNuxtRouteMiddleware(() => {
  const authStore = useAuthStore()

  // Nếu không có token, chuyển hướng về trang đăng nhập
  if (!authStore.token) {
    return navigateTo('/authentication/login')
  }
})
