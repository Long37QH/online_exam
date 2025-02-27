<template>
  <div class="QuizIDPage">
    <div class="flex w-full h-full">
      <!-- #################################################################################################### -->
      <!-- Quests block -->
      <div class="w-3/4 border-r-2 border-[#DFDFDF]">
        <div class="flex justify-between mt-[74px] mb-6 mx-[60px]">
          <ShowQuiz quizName="Đề Thi 1" quizDate="25/02/2025" author="Mr. admin" :time="35" :questCount="10" />
        </div>

        <!-- Show Quest -->
        <div class="ml-28">
          <QuestContain v-for="(question, index) in questions" :key="index" :questNumber="index + 1"
            :questContent="question.quest_text" :options="question.answers?.map(a => a.answer_text)"
            @answer-selected="handleAnswer" />
        </div>
      </div>



      <!-- #################################################################################################### -->
      <!-- Quest Count block -->
      <div class="sticky top-10 mx-auto mt-[74px] w-[257px] h-[181px]">
        <div class="flex justify-between">
          <p class="text-big font-bold">Số câu đã làm</p>
          <p class="text-regular font-light">{{ totalSelectFomatted }}/{{ totalQuestFomatted }}</p>
        </div>

        <div class="flex flex-wrap gap-0.5 justify-start mt-5">
          <div v-for="(num, index) in totalQuest" :key="index"
            class="w-[29px] h-[29px] mr-3 mb-3 flex items-center justify-center rounded-full border text-gray-500"
            :class="answeredQuestions.includes(num) ? 'bg-greenPrimary text-white border-greenPrimary' : 'border-gray-300'">
            {{ num }}
          </div>
        </div>

        <ButtonGreen content="Nộp bài" class_="mx-auto w-full h-btn mt-5" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const data = await GqlGetQuests({ documentId: route.params.id });
const questions = data.quizz.questions;
console.log(questions);

const totalQuest = questions.length;
const answeredQuestions = ref([]);

const totalQuestFomatted = computed(() => String(totalQuest).padStart(2, '0'));
const totalSelectFomatted = computed(() => String(answeredQuestions.value.length).padStart(2, '0'));

const handleAnswer = (questNumber) => {
  if (!answeredQuestions.value.includes(questNumber)) {
    answeredQuestions.value.push(questNumber);
  }
};

</script>

<style></style>