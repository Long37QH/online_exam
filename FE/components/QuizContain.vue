<template>
  <div class="QuizContain bg-[#f9f8f9] w-full h-[102px] rounded-3xl items-center flex justify-between mb-[25px]">
    <div class="ml-10 text-center">
      <p class="font-sans text-2xl font-bold">{{ quizName }}</p>
      <p class="text-[16px] font-light">{{ quizDate }}</p>
    </div>
    <div class="text-center">
      <p class="font-sans text-[16px] font-bold">{{ time }} phút / {{ questCount }} câu hỏi</p>
      <p class="text-[16px] font-light">{{ author }}</p>
    </div>

    <div class="mr-10">
      <ButtonGreen @click="goToQuiz" content="Vào thi" class_="w-[136px] h-[48px]" />

      <!-- Show score if it have -->
      <div v-if="props.score" class="mt-[7px] text-center text-red-600">
        <p class="text-[16px] font-bold">{{ props.score }} điểm</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';

interface QuizContainProps {
  quizName: string;
  quizDate: string;
  time: number;
  questCount: number;
  author: string;
  score?: number;
  quizId?: string;
}

const props = defineProps<QuizContainProps>()
const router = useRouter()

const goToQuiz = () => {
  router.push(`/quizzes/${props.quizId}`);
  // console.log(props.quizId);
};
</script>

<style></style>