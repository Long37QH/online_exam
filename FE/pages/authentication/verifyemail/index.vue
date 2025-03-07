<template>
  <div class="bg-white min-h-screen flex mt-10 justify-center ">
    <div class="bg-white rounded-lg w-3/6 not-sm:w-full">
      <h2 class="text-2xl font-bold mb-6 text-center text-neutral-800">
        Quên mật khẩu
      </h2>
      <form @submit.prevent="handleVerifyEmail">
        <div class="mb-4">
          <InputField id="email" label="Email của bạn" type="email" v-model="email" placeholder="e.g. user@example.com"
            :errorMessage="emailError" :className="emailError ? 'focus:ring-2 focus:ring-red-500' : ''" />
          <p class="text-neutral-800 text-sm mt-2">
            Sau khi hệ thống có email của bạn, chúng tôi sẽ gửi link xác thực vào email của bạn.
          </p>
        </div>
        <Button :disabled="isDisabled || loading" content="Xác thực email" />
      </form>
      <div class="w-1/2">
        <SuccessAlert 
        v-if="successMessage" 
        :title="'Thành công!'" 
        :content="successMessage"
        className="absolute bottom-20 rounded-lg shadow-lg animate-fade-in  !w-1/2"
      />
      </div>
    </div>
    
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import InputField from '../../../components/InputField.vue'
import Button from '../../../components/Button.vue'
import SuccessAlert from "../../../components/SuccessAlert.vue";

const email = ref('')
const emailError = ref('')
const successMessage = ref("");

const loading = ref(false)

definePageMeta({
  layout: "auth"
})

// Kiểm tra định dạng email
const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

// Theo dõi thay đổi email và cập nhật lỗi
watch(email, (newEmail) => {
  emailError.value = !newEmail ? 'Email không được để trống' :
    !validateEmail(newEmail) ? 'Email không hợp lệ' : ''
})

// Vô hiệu hóa nút khi có lỗi
const isDisabled = computed(() => !!emailError.value || !email.value)

// Gửi yêu cầu xác thực email
const handleVerifyEmail = async () => {
  loading.value = true;
  emailError.value = "";

  try {
    const response = await GqlForgotPassword({
      email: email.value,
    });

    if (response.forgotPassword.ok) {
      successMessage.value = "Email xác thực đã được gửi. Hãy kiểm tra hộp thư.";
    } else {
      emailError.value = "Lỗi! Vui lòng thử lại.";
    }
  } catch (error) {
    emailError.value = "Có lỗi xảy ra!";
  } finally {
    loading.value = false;
  }
};

</script>
