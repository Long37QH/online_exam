import { defineNuxtRouteMiddleware, navigateTo } from 'nuxt/app'
import { useAuthStore } from '../stores/auth'

export default defineNuxtRouteMiddleware(() => {
  const authStore = useAuthStore()
<<<<<<< HEAD
=======

  // Nếu không có token, chuyển hướng về trang đăng nhập
>>>>>>> e43d149f81e6b26604a2804bfe55d739b629db76
  if (!authStore.token) {
    return navigateTo('/authentication/login')
  }
})
