<template>
  <div class="bg-white min-h-screen flex items-center justify-center sx:w-full">
    <div class="bg-white p-8 rounded-lg  w-3/6  not-sm:w-full">
      <h2 class="text-2xl font-bold mb-6 text-center text-neutral-800 not-sm:text-title md:text-title lg:text-largest">
        Đăng ký tài khoản cho giáo viên.</h2>
      <form @submit.prevent="handleRegister">
        <div class="flex justify-stretch not-sm:flex-col">
          <InputField id="username" label="Họ tên" type="username" v-model="form.username" placeholder="Nguyễn Văn A"
            :errorMessage="errors.username" :className="errors.username ? 'focus:ring-2 focus:ring-red-500' : ''"
            class="w-full" />
          <InputField id="password" label="Mật khẩu" type="password" v-model="form.password"
            placeholder="Mật khẩu phải là sự kết hợp 8 chữ cái, số và ký hiệu." :errorMessage="errors.password"
            :className="errors.password ? 'focus:ring-2 focus:ring-red-500' : ''" class="w-full ml-10 not-sm:ml-0" />
        </div>
        <InputField id="email" label="Email" type="email" v-model="form.email" placeholder="e.g. user@example.com"
          :errorMessage="errors.email" :className="errors.email ? 'focus:ring-2 focus:ring-red-500' : ''" />
        <InputField id="phonenumber" label="Số điện thoại" type="number" v-model="form.phonenumber"
          placeholder="+84 934023419" :errorMessage="errors.phonenumber"
          :className="errors.phonenumber ? 'focus:ring-2 focus:ring-red-500' : ''" />
        <div class="mb-4 flex justify-between">
          <div>
            <input v-model="form.accept" type="checkbox" id="accept" class="mr-2">
            <label for="accept" class="text-neutral-800">Tôi đồng ý với các điều khoản dịch vụ của Online
              Exam</label>
            <p class="mt-4 text-gray-600 text-center">
            </p>
          </div>
        </div>
        <Button @click="handleRegister" content="Đăng ký" :disabled="isDisabled || loading" />
      </form>
      <hr class="mt-6 border-t border-gray-300 my-4">
      <p class="mt-4 text-gray-600 text-center">
        <NuxtLink to="/authentication/login" class="text-green-800 hover:underline flex items-start">Bạn đã có tài khoản
          giáo viên?</NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import InputField from '../../../components/InputField.vue'
import Button from '../../../components/Button.vue'
import useAxios from '../../../plugins/axios'

const axios = useAxios()
const router = useRouter()
const loading = ref(false)

const form = ref({
  username: '',
  email: '',
  password: '',
  phonenumber: '',
  accept: false
})

const errors = ref({
  username: '',
  email: '',
  password: '',
  phonenumber: ''
})

definePageMeta({
  layout: "auth"
})

// Validate usernameusername
const validateUsername = (username) => {
  const usernamePattern = /^(?! )[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơỊịẸẹỈỉỌọỐồổỗộỚờởỡợỤụỨứừửữựỲỳỴỵỶỷỸỹ]+(?: [a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơỊịẸẹỈỉỌọỐồổỗộỚờởỡợỤụỨứừửữựỲỳỴỵỶỷỸỹ]+){1,}$/;
  return usernamePattern.test(username);
};

// Validate email
const validateEmail = (email) => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
};

// Validate mật khẩu
const validatePassword = (password) => {
  const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordPattern.test(password);
};

// Validate số điện thoại
const validatePhoneNumber = (phone) => {
  const phonePattern = /^(?:\+84|0)[1-9]\d{8}$/;
  return phonePattern.test(phone);
};

// Theo dõi form để kiểm tra lỗi
watch(form, (newForm) => {
  errors.value.username = !newForm.username ? 'Họ tên không được để trống' :
    !validateUsername(newForm.username) ? 'Họ tên có ít nhất 2 từ và không chứa số, ký tự đặc biệt' : '';
  errors.value.email = !newForm.email ? 'Email không được để trống' :
    !validateEmail(newForm.email) ? 'Email không hợp lệ' : '';
  errors.value.password = !newForm.password ? 'Mật khẩu không được để trống' :
    !validatePassword(newForm.password) ? 'Mật khẩu phải có ít nhất 8 ký tự, chữ cái, số và ký hiệu.' : '';
  errors.value.phonenumber = !newForm.phonenumber ? 'Số điện thoại không được để trống' :
    !validatePhoneNumber(newForm.phonenumber) ? 'Số điện thoại không hợp lệ' : '';
}, { deep: true });

const isDisabled = computed(() => {
  return Object.values(errors.value).some(error => error) || !form.value.accept;
});

// Xử lý đăng ký
const handleRegister = async () => {
  errors.value.email = '';
  errors.value.password = '';
  errors.value.phonenumber = '';
  loading.value = true;

  try {
    const response = await axios.post('auth/local/register', {
      username: form.value.username,
      password: form.value.password,
      email: form.value.email,
      phone: form.value.phonenumber
    });

    if (response?.data?.jwt) {
      router.push('/authentication/login');
    } else {
      errors.value.phonenumber = 'Đăng ký thất bại! Vui lòng kiểm tra lại thông tin.';
    }
  } catch (error) {
    console.error("Lỗi đăng ký:", error);

    if (error.response && error.response.data) {
      const errorMessage = error.response.data?.error?.message;

      if (errorMessage.includes("Email is already taken")) {
        errors.value.email = "Email này đã tồn tại trong hệ thống!";
      } else {
        errors.value.phonenumber = errorMessage || 'Lỗi đăng ký. Vui lòng thử lại!';
      }
    } else {
      errors.value.phonenumber = 'Lỗi kết nối đến server. Vui lòng thử lại!';
    }
  } finally {
    loading.value = false;
  }
};
</script>
