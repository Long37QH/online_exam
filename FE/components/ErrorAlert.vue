<template>
  <div :class="className"
    class="flex items-center w-full h-btn rounded-xl bg-redLight border-l-4 border-redPrimary duration-300">
    <div class="mx-4">
      <Block />
    </div>
    <p class="text-small font-bold">{{ props.title }} <span class="font-normal">{{ props.content }}</span></p>
  </div>
</template>

<script lang="ts" setup>
import Block from '~/assets/icon/block.svg';

interface TickProps {
  title: string;
  content: string;
  className?: string;
}

const props = defineProps<TickProps>();
</script>

<style></style>