<template>
  <div class="container mx-auto py-4 px-4 md:px-10">
    <h2 class="text-2xl font-bold my-4 pb-4">Bảng điểm / Danh sách đề thi</h2>

    <!-- Bộ lọc và tìm kiếm -->
    <div class="flex flex-wrap gap-4 mb-4 justify-between">
      <div class="flex flex-wrap gap-4 w-full md:w-8/12">
        <select
          v-model="itemsPerPage"
          @change="updateQuizzes"
          class="border py-1.5 px-2 rounded-lg"
        >
          <option v-for="option in pageOptions" :key="option" :value="option">
            {{ option }}
          </option>
        </select>

        <select
          v-model="filters.selectClass"
          @change="updateQuizzes"
          class="border py-1.5 px-2 w-1/4 rounded-lg"
        >
          <option value="">Tất cả lớp</option>
          <option
            v-for="classItem in uniqueClasses"
            :key="classItem"
            :value="classItem"
          >
            {{ classItem }}
          </option>
        </select>

        <select
          v-model="filters.selectNumquestion"
          @change="updateQuizzes"
          class="border py-1.5 px-2 w-1/4 rounded-lg"
        >
          <option value="">Tất cả số câu</option>
          <option v-for="num in uniqueNumQuestions" :key="num" :value="num">
            {{ num }}
          </option>
        </select>

        <select
          v-model="filters.selectStatus"
          @change="updateQuizzes"
          class="border py-1.5 px-2 w-1/4 rounded-lg"
        >
          <option value="">Tất cả trạng thái</option>
          <option
            v-for="status in uniqueStatuses"
            :key="status"
            :value="status"
          >
            {{ status }}
          </option>
        </select>
      </div>

      <div class="w-full md:w-3/12 flex gap-2">
        <input
          v-model="filters.searchText"
          @input="updateQuizzes"
          type="text"
          placeholder="Tìm kiếm..."
          class="border bg-[#F3F8F2] py-1.5 px-2 w-full rounded-lg"
        />
      </div>
    </div>

    <!-- Bảng danh sách sinh viên -->
    <div class="w-full overflow-x-auto border rounded-lg">
      <Table
        :columns="columns"
        :data="paginatedQuizzes"
        :showActions="true"
        :show-index="true"
        :current-page="currentPage"
        :page-size="itemsPerPage"
      >
        <template #actions="{ item }">
          <Button
            content="Xem kết quả"
            @click="goToDetail(item.documentId)"
            className="bg-transparent font-bold text-green-700!  text- py-1 px-3 rounded-m hover: hover:!bg-gray-100 "
          />
        </template>
      </Table>
      <PaginationNavigation v-model="currentPage" :totalPages="totalPages" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import Button from "../../../components/Button.vue";
import Table from "../../../components/Table.vue";
import { useAuthStore } from "../stores/auth";
import PaginationNavigation from "../../../components/PaginationNavigation.vue";

// definePageMeta({
//   layout: "teacher",
// });

const authStore = useAuthStore();
useGqlToken("Bearer " + authStore.token);

const teacherIdData = await GqlGetTeacherId();
const teacherIds = teacherIdData.me;

console.log("role tk", teacherIds.role);

const router = useRouter();
const quizzes = ref([]);

const filters = ref({
  selectClass: "",
  selectNumquestion: "",
  selectStatus: "",
  searchText: "",
});

const columns = [
  { label: "Đề thi", key: "name" },
  { label: "Lớp", key: "class" },
  { label: "Số câu hỏi", key: "number_ques" },
  { label: "Trạng thái", key: "startus" },
];

const fetchQuizzes = async () => {
  const data = await GqlGetListQuizzByTeacher({
    documentId: teacherIds.documentId,
    class: filters.value.selectClass || undefined,
    number_ques: filters.value.selectNumquestion || undefined,
    startus: filters.value.selectStatus || undefined,
  });
  quizzes.value = data.usersPermissionsUser.quizzes_created;
  currentPage.value = 1; // Reset về trang 1 mỗi khi load lại
};

const currentPage = ref(1);
const itemsPerPage = ref(5);
const pageOptions = [1, 5, 10, 15];

// Gọi lại API khi bộ lọc thay đổi
const updateQuizzes = () => {
  fetchQuizzes();
  console.log("so trang", totalPages);
};

const uniqueClasses = computed(() => {
  return Array.from(new Set(quizzes.value.map((q) => q.class).filter(Boolean)));
});
const uniqueNumQuestions = computed(() => {
  return Array.from(
    new Set(quizzes.value.map((q) => q.number_ques).filter(Boolean))
  );
});
const uniqueStatuses = computed(() => {
  return Array.from(
    new Set(quizzes.value.map((q) => q.startus).filter(Boolean))
  );
});

const filteredQuizzes = computed(() => {
  return quizzes.value.filter((q) => {
    const searchTerm = filters.value.searchText.toLowerCase();
    return (
      q.name.toLowerCase().includes(searchTerm) ||
      q.class.toLowerCase().includes(searchTerm) ||
      q.number_ques.toString().includes(searchTerm) ||
      q.time_limit.toString().includes(searchTerm) ||
      q.startus.toLowerCase().includes(searchTerm)
    );
  });
});

const totalPages = computed(() => {
  return Math.ceil(filteredQuizzes.value.length / itemsPerPage.value);
});

const paginatedQuizzes = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  return filteredQuizzes.value.slice(start, start + itemsPerPage.value);
});

const goToDetail = (id) => {
  router.push(`/teacher/results_list/${id}`);
};

onMounted(fetchQuizzes);
</script>
