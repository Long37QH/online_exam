<template>
  <div :class="className" class="w-examComplete h-examComplete rounded-xl border-2 border-grayBorder-Profile bg-white">
    <div class="flex mt-4 mx-4 justify-between items-start">
      <div class="p-3 bg-greenAwartIcon rounded-xl">
        <AwardIcon />
      </div>
      <button class="cursor-pointer" @click="$emit('close')">
        <XIcon />
      </button>
    </div>
    <div class="text-center">
      <p class="text-regular font-bold mb-3">{{ text }}</p>
      <p class="text-title text-greenPrimary font-semibold">{{ props.score }} / 100</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import AwardIcon from '~/assets/icon/award.svg';
import XIcon from '~/assets/icon/X.svg';

interface ExamCompleteProp {
  text: string
  score: number
  className?: string;
}

const props = defineProps<ExamCompleteProp>()
const emit = defineEmits(["close"])
</script>

<style></style>