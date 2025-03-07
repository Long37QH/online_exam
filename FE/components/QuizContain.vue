<template>
  <div
    class="QuizContain bg-grayLight-QuizContain w-full h-quizContain rounded-3xl items-center flex justify-between mb-[25px]">
    <div class="ml-10 text-center w-52">
      <p class="text-title font-bold">{{ quizName }}</p>
      <p class="text-regular font-light">{{ quizDate }}</p>
    </div>
    <div class="text-center">
      <p class="text-regular font-bold">{{ time }} phút / {{ questCount }} câu hỏi</p>
      <p class="text-regular font-light">{{ author }}</p>
    </div>

    <div class="mr-10">
      <div class="w-btn-takeExam">
        <Button @click="goToQuiz" content="Vào thi" className="font-bold text-big cursor-pointer" />
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
  quizId?: string;
}

const props = defineProps<QuizContainProps>()
const router = useRouter()

const goToQuiz = () => {
  router.push(`/quizzes/${props.quizId}`);
  // console.log(props.quizId);
};
</script>