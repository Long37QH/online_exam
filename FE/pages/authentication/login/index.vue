<template>
  <div class="bg-white min-h-screen flex items-center justify-center sx:w-full">
    <div class="bg-white p-8 rounded-lg  w-3/6  not-sm:w-full">
      <h2 class="text-2xl font-bold mb-6 text-center text-neutral-800 text-largest">Đăng nhập</h2>
      <form @submit.prevent="handleLogin">
        <InputField id="email" label="Email" type="email" v-model="email" placeholder="e.g. user@example.com" :errorMessage="emailError"
          :className="emailError ? 'focus:ring-2 focus:ring-red-500' : ''" />
        <InputField id="password" label="Mật khẩu" type="password" v-model="password" placeholder="Mật khẩu phải là sự kết hợp 8 chữ cái, số và ký hiệu."
          :errorMessage="passwordError" :className="passwordError ? 'focus:ring-2 focus:ring-red-500' : ''" />
        <div class="flex justify-between">
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
import { useAuthStore } from '../../../stores/auth'

const email = ref('')
const password = ref('')
const emailError = ref('')
const passwordError = ref('')
const rememberMe = ref(false)
const loading = ref(false)
const router = useRouter()
const authStore = useAuthStore()

definePageMeta({
  layout: "auth" // Sử dụng layout auth mà không có header
})


// Hàm kiểm tra định dạng email
const validateEmail = (email) => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
};
// Hàm kiểm tra định dạng password
const validatePassword = (password) => {
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

// Theo dõi thay đổi của email
watch(email, (newEmail) => {
  if (!newEmail) {
    emailError.value = 'Email không được để trống';
  } else if (!validateEmail(newEmail)) {
    emailError.value = 'Email không hợp lệ';
  } else {
    emailError.value = '';
  }
});

// Theo dõi thay đổi của password
watch(password, (newPassword) => {
  if (!newPassword) {
    passwordError.value = 'Mật khẩu không được để trống';
  } else if (!validatePassword(newPassword)) {
    passwordError.value = 'Mật khẩu phải là sự kết hợp 8 chữ cái, số và ký hiệu.';
  } else {
    passwordError.value = '';
  }
});

// Kiểm tra nếu email & password có giá trị thì nút đăng nhập mới bật
const isDisabled = computed(() => !email.value.trim() || !password.value.trim())


const handleLogin = async () => {
  emailError.value = '';
  passwordError.value = '';


  loading.value = true;

  try {
    const response = await GqlLogin({
      input: {
        identifier: email.value,
        password: password.value
      }
    });

    if (response?.login?.jwt && response?.login?.user) {
      authStore.setAuthData(response.login.jwt, response.login.user);
      if (rememberMe.value) {
        localStorage.setItem('rememberMe', 'true');
      }
      router.push('/');
    } else {
      passwordError.value = 'Sai tài khoản hoặc mật khẩu!';
    }
  } catch (error) {
    passwordError.value = error.message || 'Lỗi đăng nhập. Vui lòng thử lại!';
  } finally {
    loading.value = false;
  }
};

</script>
