import axios from 'axios'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()

  const instance = axios.create({
    baseURL: config.public?.apiBase ?? 'http://localhost:1337/api',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  // Đưa axios vào Nuxt app để có thể sử dụng với `$axios`
  nuxtApp.provide('axios', instance)
})
