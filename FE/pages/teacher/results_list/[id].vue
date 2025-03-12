<template>
  <div class="container mx-auto py-4 px-4 md:px-10">
    <h2 class="text-2xl font-bold my-4 pb-5">Danh sách kết quả bài thi</h2>
    <!-- bộ lọc -->
    <div class="flex flex-wrap gap-4 mb-4 justify-between">
      <div class="flex flex-wrap gap-4 w-full md:w-8/12">
        <select v-model="itemsPerPage" class="border py-1.5 px-2 rounded-lg">
          <option v-for="option in pageOptions" :key="option" :value="option">
            {{ option }}
          </option>
        </select>
        <select
          v-model="filters.selectScore"
          class="border py-1.5 px-2 w-1/4 rounded-lg"
        >
          <option value="">Điểm số</option>
          <option
            v-for="socoreItem in uniqueScore"
            :key="socoreItem"
            :value="socoreItem"
          >
            {{ socoreItem }}
          </option>
        </select>
      </div>
      <div class="w-full md:w-3/12 flex gap-2">
        <input
          v-model="filters.searchText"
          type="text"
          placeholder="Tìm kiếm..."
          class="border py-1.5 px-2 w-full rounded-lg"
        />
      </div>
    </div>
    <!-- table -->
    <div class="w-full overflow-x-auto border rounded-lg">
      <Table
        :columns="columns"
        :data="paginatedQuizzes"
        :show-index="true"
        :current-page="currentPage"
        :page-size="itemsPerPage"
      />

      <PaginationNavigation v-model="currentPage" :total-pages="totalPages" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import Table from "../../../components/Table.vue";
import PaginationNavigation from "../../../components/PaginationNavigation.vue";

// definePageMeta({
//     layout: 'teacher',
//   });

const route = useRoute();
const user_quizzes = ref([]);

const filters = ref({
  selectScore: "",
  searchText: "",
});

const quizzDocumentId = route.params.id;
console.log(quizzDocumentId);

const currentPage = ref(1);
const itemsPerPage = ref(5);
const pageOptions = [1, 5, 10, 15];

const columns = [
  { label: "Tên Thí Sinh", key: "user.fullname" },
  { label: "Điểm thi", key: "score" },
  { label: "Thời gian", key: "createdAt" },
  { label: "Trang thái", key: "status_user_quiz" },
];

const fetchUserQuizzes = async () => {
  const data = await GqlGetListUserQuizz({
    documentId: quizzDocumentId,
  });

  user_quizzes.value = data.quizz.user_quizzes;
  console.log(user_quizzes.value);
};

watch(
  () => ({ ...filters.value, itemsPerPage: itemsPerPage.value }),
  () => {
    fetchUserQuizzes();
    currentPage.value = 1;
  },
  { deep: true }
);

const uniqueScore = computed(() => {
  return Array.from(
    new Set(user_quizzes.value.map((q) => q.score).filter(Boolean))
  );
});

// xu ly loc
const filteredUserQuizzes = computed(() => {
  return user_quizzes.value.filter((q) => {
    const searchTerm = filters.value.searchText.toLowerCase();
    const matchScore =
      !filters.value.selectScore || q.score === filters.value.selectScore;
    const matchSearch =
      q.user.username.toLowerCase().includes(searchTerm) ||
      q.score.toString().includes(searchTerm) ||
      q.createdAt.toLowerCase().includes(searchTerm) ||
      q.status_user_quizze.toLowerCase().includes(searchTerm);

    return matchScore && matchSearch;
  });
});

console.log(filteredUserQuizzes.value);

const totalPages = computed(() => {
  return Math.ceil(filteredUserQuizzes.value.length / itemsPerPage.value);
});

const paginatedQuizzes = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  return filteredUserQuizzes.value.slice(start, start + itemsPerPage.value);
});

onMounted(fetchUserQuizzes);
</script>

<style></style>
