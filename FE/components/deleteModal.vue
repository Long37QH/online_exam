<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div class="bg-white p-6 rounded-lg shadow-lg w-115">
        <!-- Tiêu đề -->
        <div class="flex justify-between items-center">
          <img src="../assets/icon/Icon_wan.png" alt="" />
          <button @click="closeModal" class="text-gray-600 hover:text-black">
            ✕
          </button>
        </div>

        <!-- Nội dung -->
        <div class="mt-4">
          <h3 class="text-lg font-semibold text-red-600">Cảnh báo !!?!?</h3>
          <p class="text-2xl font-bold text-gray-800">
            Có người muốn xóa dữ liệu của bạn !!!
          </p>
          <p class="text-gray-600 mt-2">
            Nếu đó là bạn, bạn có chấp nhận xóa dữ liệu này?
          </p>
        </div>

        <!-- Nút hành động -->
        <div class="flex justify-between space-x-2 mt-6">
          <button
            @click="closeModal"
            class="w-6/12 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            Hủy bỏ
          </button>
          <button
            @click="confirmDelete"
            class="w-6/12 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Xóa bỏ
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref } from "vue";
const props = defineProps({
  isOpen: Boolean, // Trạng thái mở modal
});
const emit = defineEmits(["close", "confirm"]);

// Đóng modal
const closeModal = () => {
  emit("close");
};

// Xác nhận xóa
const confirmDelete = () => {
  emit("confirm");
  closeModal(); // Đóng modal sau khi xác nhận
};
</script>
