<template>
  <div>
    <button v-for="page in props.totalPages" :key="page" @click="navigatePage(page)"
      class="mx-1 px-4 py-2 border rounded-md cursor-pointer" :class="{
        'bg-greenPrimary text-white': page === props.modelValue,
        'bg-white text-black': page !== props.modelValue,
      }">
      {{ page }}
    </button>
  </div>
</template>

<script lang="ts" setup>
interface PaginationNavigationProp {
  modelValue: number
  totalPages: number
}

const props = defineProps<PaginationNavigationProp>()
const emit = defineEmits<{ (event: 'update:modelValue', newPage: number): void }>()

const navigatePage = (page: number) => {
  emit('update:modelValue', page)
}
</script>
