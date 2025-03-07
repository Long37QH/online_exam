<template>
  <div class="ShowQuiz bg-grayLight-QuizShow w-full h-quizShow flex justify-between items-center rounded-xl">
    <div class="ml-7">
      <p class="text-title font-bold">{{ quizName }}<span class="text-regular font-normal ml-2">{{ author }}</span></p>
      <p class="text-regular font-light">{{ quizDate }}</p>
    </div>

    <div class="mr-7 flex flex-col items-center">
      <p class="font-bold">{{ formattedTime }}</p>
      <p>{{ questCount }} câu hỏi</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';

interface ShowQuizProps {
  quizName: string;
  quizDate: string;
  author: string;
  time: number;
  questCount: number;
}

const props = defineProps<ShowQuizProps>()
const emit = defineEmits(['autoSubmit'])

const remainingSeconds = ref(props.time * 60)

const formattedTime = computed(() => {
  const hours = Math.floor(remainingSeconds.value / 3600);
  const minutes = Math.floor((remainingSeconds.value % 3600) / 60);
  const seconds = remainingSeconds.value % 60;
  const pad = (num: number) => String(num).padStart(2, '0');
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
});

let intervalId: ReturnType<typeof setInterval> | undefined;

const startCountdown = () => {
  intervalId = setInterval(() => {
    if (remainingSeconds.value > 0) {
      remainingSeconds.value--
    }
    if (remainingSeconds.value === 0) {
      clearInterval(intervalId)
      emit('autoSubmit')
    }
  }, 1000)
}

onMounted(() => {
  startCountdown()
})

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId)
  }
})

</script>

<style></style>