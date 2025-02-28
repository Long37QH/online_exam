import { resolve } from 'path'
import tailwindcss from "@tailwindcss/vite";
import svgLoader from 'vite-svg-loader'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  alias: {
    '@': resolve(__dirname, '/')
  },
  css: ['~/assets/css/main.css'],
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  vite: {
    plugins: [
      tailwindcss(),
      svgLoader(),
    ],
  },
  modules: ['nuxt-graphql-client', '@pinia/nuxt'],
  runtimeConfig: {
    public: {
      GQL_HOST: 'http://localhost:1337/graphql'
    }
  },
})
