<template>
  <div class="ShowQuiz bg-grayLight-QuizShow w-full h-quizShow flex justify-between items-center rounded-xl">
    <div class="ml-7">
      <p class="text-title font-bold">{{ quizName }}<span class="text-regular font-normal ml-2">{{ author }}</span></p>
      <p class="text-regular font-light">{{ quizDate }}</p>
    </div>

    <div class="mr-7 flex flex-col items-center">
      <p class="font-bold">00:{{ time }}:00</p>
      <p>{{ questCount }} câu hỏi</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
interface ShowQuizProps {
  quizName: string;
  quizDate: string;
  author: string;
  time: number;
  questCount: number;
}

const props = defineProps<ShowQuizProps>()
</script>

<style></style>