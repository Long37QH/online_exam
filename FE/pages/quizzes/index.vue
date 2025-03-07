<template>
  <div class="flex w-full h-full">
    <!-- #################################################################################################### -->
    <!-- Quizzes block -->
    <div class="w-3/4 border-r-2 border-[#DFDFDF] flex flex-col h-full">
      <div class="flex justify-between mt-8 mb-6 mx-[60px]">
        <p class="text-2xl font-bold">Danh sách đề thi</p>

        <!-- Search block -->
        <div class="w-searchInput-Quizzes">
          <Search v-model="searchValue" />
        </div>
      </div>


      <!-- Show quizzes -->
      <div class="QuizzesContain mx-28">
        <QuizContain v-for="(quiz, i) in paginatedQuizzes" :key="i" :quizName="quiz.name" :quizId="quiz.documentId"
          :quizDate="formatDate(quiz.exam_date)" :time="quiz.time_limit" :questCount="quiz.questions.length"
          :author="quiz.create_by.fullname" />
      </div>

      <!-- Pagination Navigation -->
      <div class="fixed bottom-0 left-1/3 flex justify-center mb-24">
        <PaginationNavigation v-model="currentPage" :totalPages="totalPages" />
      </div>
    </div>



    <!-- #################################################################################################### -->
    <!-- User block -->
    <div class="mx-auto mt-[74px]">
      <img :src="student.avatar ? config.public.apiUrl + student.avatar.url : '/avatar.png'" alt=""
        class="rounded-full w-[96px] h-[96px] mb-6 mx-auto" />
      <p class="text-xl font-bold text-center mb-6">{{ student.fullname }}</p>

      <div class="w-[184px] mx-auto">
        <p class="text-[#21272A] text-regular mb-3 font-light">
          {{ student.email }}
        </p>
        <p class="text-[#21272A] text-regular mb-3 font-light">
          +84 {{ student.phone }}
        </p>
        <p class="text-[#21272A] text-regular mb-6 font-light">Khóa: {{ student.class }}</p>
      </div>

      <div class="w-btn-info">
        <Button @click="$router.push('/profile')" content="Chỉnh sửa thông tin cá nhân"
          className="h-btn-info bg-white border-2 border-gray-InfoBtn !text-gray-InfoBtn hover:!bg-gray-InfoBtn hover:!text-white hover:font-bold cursor-pointer" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth';

const config = useRuntimeConfig();

// AUTH
const authStore = useAuthStore();
useGqlToken("Bearer " + authStore.token);

// Get the student's id
const stutentIdData = await GqlGetStudentId();
const studentIds = stutentIdData.me;

// Get quizzes & students
const quizzesData = await GqlGetQuizzes();
const studentData = await GqlGetStudent({ "documentId": studentIds.documentId });

const student = studentData.usersPermissionsUser;
const quizzes = quizzesData.quizzes;

// For search
const searchValue = ref('');

const filteredQuizzes = computed(() => {
  return quizzes.filter(q => {
    const searchTerm = searchValue.value.toLowerCase();
    return (
      q.name.toLowerCase().includes(searchTerm) ||
      q.create_by.fullname.toLowerCase().includes(searchTerm)
    );
  });
});

// For pagination
const currentPage = ref(1)
const itemsPerPage = 5

const totalPages = computed(() => Math.ceil(filteredQuizzes.value.length / itemsPerPage));

const paginatedQuizzes = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredQuizzes.value.slice(start, end);
});

watch(searchValue, () => {
  currentPage.value = 1;
});

// Format Date
const formatDate = (date) => {
  const [year, month, day] = date.split('-')
  return `${day}/${month}/${year}`
}
</script>
