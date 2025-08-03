<template>
  <div class="container p-5">
    <div class="px-15 flex flex-wrap justify-between rounded-lg items-center">
      <div class="w-6/12">
        <h2 class="text-xl font-bold">Đề thi : Lập trình c++</h2>
        <div class="flex text-gray-700">
          <p class="mr-2">25/12/2025</p>
          <p class="mr-2">15 câu hỏi</p>
          <p class="mr-2">30 phút</p>
        </div>
      </div>
      <div class="w-4/12 flex justify-end">
        <Button
          content="+ Thêm câu hỏi"
          class-name="mr-4 max-w-50 px-4 py-2 border bg-white! text-green-500!  border-green-500!  rounded-md hover:bg-green-500! hover:text-white!"
        />
        <Button content="Lưu" class-name="max-w-25" />
      </div>
    </div>
  </div>
</template>

<script setup>
import Button from "../../../components/Button.vue";
</script>

<style></style>
