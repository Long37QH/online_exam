<template>
  <div class="bg-white min-h-screen flex mt-10 justify-center">
    <div class="bg-white p-8 rounded-lg w-3/6 not-sm:w-full">
      <h2 class="text-2xl font-bold mb-6 text-center text-neutral-800">
        Đặt lại mật khẩu
      </h2>
      <form @submit.prevent="handleResetPassword">
        <div class="mb-4">
          <InputField 
            id="password" 
            label="Mật khẩu mới" 
            type="password" 
            v-model="form.password"
            placeholder="Nhập mật khẩu mới của bạn."
            :errorMessage="errors.password"
            :className="errors.password ? 'focus:ring-2 focus:ring-red-500' : ''"
            class="w-full"
            @input="validatePassword(); validateRepassword()" 
          />
          <InputField 
            id="repassword" 
            label="Nhập lại mật khẩu" 
            type="password" 
            v-model="form.repassword"
            placeholder="Nhập lại mật khẩu mới của bạn."
            :errorMessage="errors.repassword"
            :className="errors.repassword ? 'focus:ring-2 focus:ring-red-500' : ''"
            class="w-full"
            @input="validateRepassword()" 
          />
          <p class="text-neutral-800 text-sm mt-2">
            Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ, số và ký hiệu.
          </p>
        </div>
        <Button :disabled="isDisabled || loading" content="Đổi mật khẩu" class="w-full" />
      </form>
      <div class="w-1/2">
        <SuccessAlert 
        v-if="successMessage" 
        :title="'Thành công!'" 
        :content="successMessage"
        className="absolute bottom-10 px-4 py-3 rounded-lg shadow-lg animate-fade-in !w-1/2"
      />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import InputField from "../../../components/InputField.vue";
import Button from "../../../components/Button.vue";
import SuccessAlert from "../../../components/SuccessAlert.vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const code = ref(route.query.code || "");

const form = ref({
  password: "",
  repassword: "",
});

const errors = ref({
  password: "",
  repassword: "",
});

const successMessage = ref("");
const loading = ref(false);

definePageMeta({
  layout: "auth",
});

const validatePassword = () => {
  errors.value.password = "";
  const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  if (!passwordPattern.test(form.value.password)) {
    errors.value.password = "Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ, số và ký hiệu.";
  }
};

const validateRepassword = () => {
  errors.value.repassword = "";

  if (form.value.repassword && form.value.password !== form.value.repassword) {
    errors.value.repassword = "Mật khẩu nhập lại không khớp.";
  }
};

// Chỉ bật nút khi cả hai trường được nhập và không có lỗi
const isDisabled = computed(() => {
  return (
    !form.value.password ||
    !form.value.repassword ||
    !!errors.value.password ||
    !!errors.value.repassword
  );
});

const handleResetPassword = async () => {
  validatePassword();
  validateRepassword();
  if (errors.value.password || errors.value.repassword) return;

  loading.value = true;

  try {
    const response = await GqlResetPassword({
      password: form.value.password,
      passwordConfirmation: form.value.repassword,
      code: code.value,
    });

    if (response?.resetPassword?.jwt) {
      successMessage.value = "Mật khẩu đã được đặt lại thành công!";
      setTimeout(() => {
        router.push("/authentication/login");
      }, 2000);
    } else {
      errors.value.repassword = response?.errors?.[0]?.message || "Lỗi! Vui lòng thử lại.";
    }
  } catch (error) {
    errors.value.repassword = error?.response?.data?.message || "Có lỗi xảy ra! Vui lòng thử lại.";
  } finally {
    loading.value = false;
  }
};
</script>
