<template>
  <div class="QuizIDPage">
    <div class="flex w-full h-full">
      <!-- #################################################################################################### -->
      <!-- Quests block -->
      <div class="w-3/4 border-r-2 border-[#DFDFDF]">
        <div class="sticky top-5 mt-[74px] mb-6 mx-[60px]">
          <ShowQuiz :quizName="quizInfo.name" :quizDate="formatDate(quizInfo.exam_date)"
            :author="quizInfo.create_by.fullname" :time="quizInfo.time_limit" :questCount="totalQuest"
            @autoSubmit="handleSubmit" />
        </div>

        <!-- Show Quest -->
        <div class="ml-28">
          <QuestContain v-for="(question, index) in questions" :key="index" :questNumber="index + 1"
            :question="question" @answer-selected="handleAnswer" />
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

        <Button content="Nộp bài" @click="handleSubmit"
          className="mx-auto mt-5 bg-greenPrimary hover:bg-greenPrimary-hover text-white font-bold text-big cursor-pointer" />
      </div>
    </div>

    <div v-if="showExamComplete" class="modal-overlay" @click.self="closeModal">
      <ExamComplete :text="'Bài thi của bạn đã hoàn thành'" :score="Number(score.toFixed(2))" @close="closeModal" />
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const route = useRoute();
const router = useRouter();

// AUTH
const authStore = useAuthStore();
useGqlToken("Bearer " + authStore.token);

// Get the student's id
const stutentIdData = await GqlGetStudentId();
const studentIds = stutentIdData.me;

// Initialize refs
const userQuizzId = ref('');
const answeredQuestions = ref([]);
const result = ref([]);
const score = ref(0);
const showExamComplete = ref(false);

// Get current time func
const getDateTime = () => new Date().toISOString();

// Create user quizz when page mounted
onMounted(async () => {
  try {
    const startTime = getDateTime();
    const response = await GqlCreateUserQuizz({
      "data": {
        "score": score.value,
        "start_at": startTime,
        "status_user_quiz": "Processing",
        "quizz_id": route.params.id,
        "result": result.value,
        "user": studentIds.documentId
      }
    });
    userQuizzId.value = response.createUserQuizz.documentId;
  } catch (error) {
    console.error("Error:", error);
  }
});

// Get Quests & Quiz info
const questionsData = await GqlGetQuizz({ documentId: route.params.id });
const quizInfo = questionsData.quizz;
const questions = quizInfo.questions;

const totalQuest = questions.length;
const scoreOfQuest = 100 / totalQuest;

const totalQuestFomatted = computed(() => String(totalQuest).padStart(2, '0'));
const totalSelectFomatted = computed(() => String(answeredQuestions.value.length).padStart(2, '0'));

// Handle answer event
// https://vuejs.org/guide/components/events.html  --- Docs
const handleAnswer = (questNumber, questId, answerId) => {
  if (!answeredQuestions.value.includes(questNumber)) {
    answeredQuestions.value.push(questNumber);
  }

  const index = result.value.findIndex(item => item.question_id === questId);
  if (index === -1) {
    result.value.push({ question_id: questId, answer_id: answerId });
  } else {
    result.value[index].answer_id = answerId;
  };
}

// Handle submit
const handleSubmit = async () => {
  for (const answer of result.value) {
    try {
      const response = await GqlCheckTrueAnswer({
        documentId: answer.answer_id
      });

      if (response.answer.is_true) {
        score.value += scoreOfQuest;
      }
    } catch (error) {
      console.error("Lỗi khi kiểm tra đáp án:", error);
    }
  }

  const response = await GqlSubmitUserQuizz({
    "documentId": userQuizzId.value,
    "data": {
      "score": Number(score.value.toFixed(2)), // typeof(score.value.toFixed(2)) = string
      "completed_at": getDateTime(),
      "status_user_quiz": "Done",
      "result": result.value
    }
  })

  showExamComplete.value = true;
}

const closeModal = () => {
  showExamComplete.value = false;
  router.push("/profile/history")
};

// Format date func
const formatDate = (date) => {
  const [year, month, day] = date.split('-')
  return `${day}/${month}/${year}`
}
</script>