<template>
  <div class="min-h-screen flex items-center justify-center bg-white">
    <div class="bg-white p-8 rounded-lg  w-3/6">
      <h2 class="text-2xl font-bold mb-6 text-center text-neutral-800 text-largest">Đăng nhập</h2>
      <form @submit.prevent="handleLogin">
        <InputField id="email" label="Email" type="email" v-model="email" placeholder=""
          :errorMessage="emailError" />
        <InputField id="password" label="Mật khẩu" type="password" v-model="password" placeholder=""
          :errorMessage="passwordError" class=""/>
        <div class="flex justify-between">
          <label for="rememberMe" class="text-gray-500 mb-4 text-small">Mật khẩu phải là sự kết hợp 8 chữ cái, số và ký
            hiệu.</label>
        </div>
        <div class="mb-4 flex justify-between">
          <div>
            <input v-model="rememberMe" type="checkbox" id="rememberMe" class="mr-2">
            <label for="rememberMe" class="text-neutral-800">Lưu tài khoản</label>
            <p class="mt-4 text-gray-600 text-center">
            </p>
          </div>
          <NuxtLink to="/" class="text-green-800 hover:underline ">Quên mật khẩu?</NuxtLink>
        </div>

        <Button @click="handleLogin" content="Đăng nhập" :disabled="isDisabled || loading" />
      </form>
      <hr class="mt-6 border-t border-gray-300 my-4">
      <p class="mt-4 text-gray-600 text-center">
        <NuxtLink to="/" class="text-green-800 hover:underline flex items-start">Đăng ký tài khoản cho giáo viên?
        </NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import InputField from '../../../components/InputField.vue'
import Button from '../../../components/Button.vue'

const email = ref('')
const password = ref('')
const emailError = ref('')
const passwordError = ref('')
const rememberMe = ref(false)
const loading = ref(false)
const router = useRouter()

definePageMeta({
  layout: "auth" // Sử dụng layout auth mà không có header
})

// Kiểm tra nếu email & password có giá trị thì nút đăng nhập mới bật
const isDisabled = computed(() => !email.value.trim() || !password.value.trim())

const handleLogin = async () => {
  if (isDisabled.value) return // Nếu input trống thì không cho chạy tiếp

  emailError.value = ''
  passwordError.value = ''
  loading.value = true

  try {
    const response = await GqlLogin({
      input: {
        identifier: email.value,
        password: password.value
      }
    })

    if (response?.login?.jwt) {
      const { jwt, user } = response.login
      if (rememberMe.value) {
        localStorage.setItem('token', jwt)
        localStorage.setItem('user', JSON.stringify(user))
        localStorage.setItem('rememberMe', 'true')
      } else {
        sessionStorage.setItem('token', jwt)
        sessionStorage.setItem('user', JSON.stringify(user))
      }
      router.push('/')
    } else {
      passwordError.value = 'Sai tài khoản hoặc mật khẩu!'
    }
  } catch (error) {
    passwordError.value = 'Sai tài khoản hoặc mật khẩu!'
  } finally {
    loading.value = false
  }
}
</script>
