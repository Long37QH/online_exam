<template>
  <div>
    <button :class="props.class_"
      class="text-center bg-greenPrimary hover:bg-greenPrimary-hover duration-300 rounded-xl text-white font-bold text-big cursor-pointer">
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