<template>
  <div class="w-full overflow-x-auto rounded-lg">
    <table class="w-full border-collapse border border-gray-300 text-center">
      <thead>
        <tr class="bg-[#F3F8F2] text-black">
          <!-- Cột thứ tự -->
          <th v-if="showIndex" class="border-y p-2">STT</th>
          <!-- Cột dữ liệu -->
          <th v-for="column in columns" :key="column.key" class="border-y p-2">
            {{ column.label }}
          </th>
          <!-- Cột tác vụ -->
          <th v-if="showActions" class="border-y p-2">Tác vụ</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="data.length === 0">
          <td
            :colspan="columns.length + (showActions ? 1 : 0)"
            class="border-y p-2 text-center text-gray-500"
          >
            Không có bản ghi nào
          </td>
        </tr>
        <tr
          v-for="(item, index) in data"
          :key="index"
          class="hover:bg-gray-100"
        >
          <!-- Cột thứ tự -->
          <td v-if="showIndex" class="border-y p-2">
            {{ index + 1 + (currentPage - 1) * pageSize }}
          </td>
          <!-- Dữ liệu từ các cột -->
          <td v-for="column in columns" :key="column.key" class="border-y p-2">
            {{ getValueByPath(item, column.key) }}
          </td>
          <!-- Cột tác vụ -->
          <td v-if="showActions" class="border-y p-2">
            <slot name="actions" :item="item" :index="index"></slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
// Hàm lấy giá trị từ object theo key dạng 'a.b.c'
const getValueByPath = (obj, path) => {
  return path.split(".").reduce((acc, part) => acc && acc[part], obj) || "";
};

const props = defineProps({
  data: Array,
  columns: Array,
  showActions: {
    type: Boolean,
    default: false,
  },
  showIndex: {
    type: Boolean,
    default: false,
  },
  currentPage: {
    type: Number,
    default: 1,
  },
  pageSize: {
    type: Number,
    default: 5,
  },
});
</script>
