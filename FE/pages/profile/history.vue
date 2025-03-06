<template>
  <div class="ProfilePage mt-10 mx-20">
    <div class="flex justify-between">
      <p class="text-title font-bold">Bảng điểm của bạn</p>

      <!-- Search block -->
      <div class="w-searchInput">
        <Search v-model="searchValue" />
      </div>
    </div>

    <!-- Show history Exams -->
    <div class="mt-12">
      <HistoryExam :exams="paginatedExams" />

      <!-- Pagination Navigation -->
      <div class="fixed bottom-0 left-1/2 flex justify-center mb-24 -translate-x-1/2">
        <PaginationNavigation v-model="currentPage" :totalPages="totalPages" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '../stores/auth';

// AUTH
const authStore = useAuthStore();
useGqlToken("Bearer " + authStore.token);

// Get the student's id
const stutentIdData = await GqlGetStudentId();
const studentIds = stutentIdData.me;


const historyData = await GqlGetUserQuizz({ "userId": studentIds.documentId });
const exams = ref(historyData.usersPermissionsUser.user_quizzes);

// For search 
const searchValue = ref('');

const filteredExams = computed(() => {
  return exams.value.filter(e => {
    const searchTerm = searchValue.value.toLowerCase();
    return (
      e.quizz_id.name.toLowerCase().includes(searchTerm)
    );
  });
});

// For pagination
const currentPage = ref(1);
const itemsPerPage = 10;

const totalPages = computed(() => Math.ceil(filteredExams.value.length / itemsPerPage));

const paginatedExams = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredExams.value.slice(start, end);
});

watch(searchValue, () => {
  currentPage.value = 1;
});
</script>