<template>
  <header class="w-full h-header shadow flex justify-between items-center">
    <a href="/" class="ml-20 flex text-[#6a7078]">
      <IconBook />
      <p class="text-title font-bold ml-1">OnlineExam</p>
    </a>


    <div class="relative mr-20">
      <button class="flex cursor-pointer" @click="toggleDropdown">
        <p class="text-regular mr-2">{{ authStore.user ? authStore.user?.fullname : 'Khách' }}</p>
        <IconArrowDown />
      </button>

      <!-- Dropdown box -->
      <div v-if="dropdownOpen" class="absolute top-[40px] right-0 w-[150px] bg-white shadow rounded-lg">
        <ul>
          <li class="p-2 hover:bg-[#f9f8f9] cursor-pointer" @click="navigateTo('/')">Tài khoản</li>
          <li class="p-2 hover:bg-[#f9f8f9] cursor-pointer" @click="navigateTo('/')">Bảng điểm</li>
          <li class="p-2 hover:bg-[#f9f8f9] cursor-pointer" @click="handleLogout">Đăng xuất</li>
        </ul>
      </div>
    </div>
  </header>
</template>

<script setup>
import IconBook from '~/assets/icon/book.svg';
import IconArrowDown from '~/assets/icon/arrowDown.svg';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { onMounted } from 'vue'

const dropdownOpen = ref(false)
const router = useRouter()
const authStore = useAuthStore();

onMounted(() => {
  authStore.initializeAuth()
})

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value
}

const navigateTo = (path) => {
  router.push(path);
  dropdownOpen.value = false;
}
const handleLogout = async () => {
  try {
    authStore.logout();
    router.push('/authentication/login');
  } catch (error) {
    console.error("Lỗi khi đăng xuất:", error);
  }
};

</script>

<style></style>