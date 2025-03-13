<template>
  <div :class="['flex justify-end my-1.5 space-x-2', containerClass]">
    <button
      @click="prevPage"
      :disabled="modelValue === 1"
      class="px-4 py-2 bg-white text-gray-IconWarn font-bold rounded disabled:opacity-50 cursor-pointer"
    >
      &lt; Previous
    </button>

    <button
      v-for="page in paginationPages"
      :key="page.key"
      @click="!page.isEllipsis && goToPage(page.number)"
      :class="[
        'px-4 py-2 rounded cursor-pointer font-bold',
        modelValue === page.number
          ? 'bg-[#EDFDEB] text-greenPrimary-hover'
          : 'bg-white text-greenPrimary',
        page.isEllipsis && 'cursor-default',
      ]"
      :disabled="page.isEllipsis"
    >
      {{ page.isEllipsis ? "..." : page.number }}
    </button>

    <button
      @click="nextPage"
      :disabled="modelValue === totalPages"
      class="px-4 py-2 bg-white text-greenPrimary font-bold rounded disabled:opacity-50 cursor-pointer"
    >
      Next &gt;
    </button>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
interface PaginationNavigationProps {
  modelValue: number;
  totalPages: number;
  containerClass?: string;
}

const props = defineProps<PaginationNavigationProps>();
const emit = defineEmits<{
  (event: "update:modelValue", newPage: number): void;
}>();

const prevPage = () => {
  if (props.modelValue > 1) {
    emit("update:modelValue", props.modelValue - 1);
  }
};

const nextPage = () => {
  if (props.modelValue < props.totalPages) {
    emit("update:modelValue", props.modelValue + 1);
  }
};

const goToPage = (page: number) => {
  if (page !== props.modelValue) {
    emit("update:modelValue", page);
  }
};

// Tính toán các trang hiển thị, thêm "..." khi cần
const paginationPages = computed(() => {
  const pages = [];
  const { modelValue, totalPages } = props;

  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push({ number: i, isEllipsis: false, key: i });
    }
  } else {
    pages.push({ number: 1, isEllipsis: false, key: 1 });

    if (modelValue > 3) {
      pages.push({ number: -1, isEllipsis: true, key: "start-ellipsis" });
    }

    const start = Math.max(2, modelValue - 1);
    const end = Math.min(totalPages - 1, modelValue + 1);

    for (let i = start; i <= end; i++) {
      pages.push({ number: i, isEllipsis: false, key: i });
    }

    if (modelValue < totalPages - 2) {
      pages.push({ number: -1, isEllipsis: true, key: "end-ellipsis" });
    }

    pages.push({ number: totalPages, isEllipsis: false, key: totalPages });
  }

  return pages;
});
</script>
