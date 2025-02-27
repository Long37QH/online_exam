<template>
  <div>
    <button :class="props.class_"
      class="text-center bg-[#25a149] hover:bg-[#008526] duration-300 rounded-xl text-white font-bold text-[20px] cursor-pointer">
      {{ props.content }}
    </button>
  </div>
</template>

<script lang="ts" setup>
interface ButtonGreenProps {
  content: string;
  class_?: string;
}

const props = defineProps<ButtonGreenProps>()
</script>