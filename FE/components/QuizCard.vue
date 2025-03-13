<template>
  <div
    class="p-4 bg-white rounded-2xl shadow-sm border border-green-100 hover:shadow-md transition flex justify-between items-start"
  >
    <div>
      <h2 class="text-lg font-bold mb-2">{{ title }}</h2>
      <p class="text-sm text-gray-600 mb-2">{{ duration }} phút</p>
      <p class="text-sm text-gray-600 mb-2">{{ questions }} câu hỏi</p>
    </div>
    <div class="flex flex-col items-end gap-1">
      <div class="flex gap-2 mb-2">
        <button
          @click="$emit('edit')"
          class="text-gray-500 hover:text-blue-500"
        >
          <img :src="editIcon" alt="Chỉnh sửa" class="w-5 h-5" />
        </button>
        <button
          @click="$emit('delete')"
          class="text-gray-500 hover:text-red-500"
        >
          <img :src="deleteIcon" alt="Xoá" class="w-5 h-5" />
        </button>
      </div>
      <p class="text-sm text-gray-600 mb-2">Lớp {{ classt }}</p>
      <p class="text-sm text-gray-400 mb-2">{{ date }}</p>
    </div>
  </div>
</template>

<script setup>
import editIcon from "../assets/icon/ic_edit.png";
import deleteIcon from "../assets/icon/ic_delete.png";

const props = defineProps({
  title: String,
  duration: Number,
  questions: Number,
  date: String,
  classt: String,
});
</script>

<style scoped>
/* Tùy chỉnh thêm nếu cần */
</style>
