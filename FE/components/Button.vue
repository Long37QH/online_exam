<template>
  <button :class="[
    disabled ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-greenPrimary text-white hover:bg-greenPrimary-hover',
    'w-full p-3 rounded-lg transition duration-300 flex items-center justify-center gap-2',
    className
  ]" :disabled="disabled">
    <img v-if="imgLeft" :src="imgLeft" alt="icon" class="w-5 h-5" />
    {{ content }}
  </button>
</template>

<script lang="ts" setup>
interface ButtonGreenProps {
  content: string;
  className?: string;
  disabled?: boolean;
  imgLeft?: string;
}

const props = withDefaults(defineProps<ButtonGreenProps>(), {
  disabled: false,
  imgLeft: "" // Mặc định không có ảnh
});
</script>
