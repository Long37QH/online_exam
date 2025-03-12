<template>
  <div class="flex justify-end my-1.5 space-x-2">
    <button
      @click="prevPage"
      :disabled="modelValue === 1"
      class="px-4 py-2 bg-white text-gray-IconWarn font-bold rounded disabled:opacity-50 cursor-pointer"
    >
      &lt; Previous
    </button>

    <button
      v-for="page in totalPages"
      :key="page"
      @click="goToPage(page)"
      :class="[
        'px-4 py-2 rounded cursor-pointer font-bold',
        modelValue === page
          ? 'bg-[#EDFDEB] text-greenPrimary-hover'
          : 'bg-white text-greenPrimary',
      ]"
    >
      {{ page }}
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
interface PaginationNavigationProps {
  modelValue: number;
  totalPages: number;
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
</script>
