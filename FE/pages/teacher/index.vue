<template>
  <div class="container p-5">
    <SuccessAlert
      v-if="showAlert"
      :title="'Thông báo'"
      :content="alertMessage"
      class="fixed top-5 right-5 left-0"
    />
    <div class="p-6 px-35 rounded-lg flex items-center justify-between">
      <div class="w-8/12">
        <p class="text-xl text-green-600 font-semibold">CHÀO NGÀY MỚI</p>
        <h1 class="text-4xl font-bold text-gray-800 mt-1">
          Online Exam đã sẵn sàng hỗ trợ bạn
        </h1>
        <p class="text-gray-500 text-mg mt-1">Bắt đầu tạo đề thi &rarr;</p>
      </div>
      <div class="w-2/12">
        <Button
          @click="isModalOpen = true"
          content=" + Tạo đề thi mới"
          className="px-4 py-2 border bg-white! text-green-500!  border-green-500!  rounded-md hover:bg-green-500! hover:text-white!"
        />
        <QuizModal
          :isOpen="isModalOpen"
          :title="ModalTitle"
          :editData="selectedQuiz"
          @close="
            () => {
              isModalOpen = false;
              resetModal();
            }
          "
          @save="handleSave"
        />
      </div>
    </div>
    <div class="py-4 px-35 flex flex-wrap justify-between items-center">
      <div>
        <h2 class="text-xl font-bold">Đề thi của bạn</h2>
      </div>
      <div class="w-4/12">
        <Search v-model="searchQuery" />
      </div>
    </div>
    <div class="p-6 px-35">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <QuizCard
          v-for="quiz in paginatedQuizzes"
          :key="quiz.documentId"
          :title="quiz.name"
          :duration="quiz.time_limit"
          :questions="quiz.number_ques"
          :classt="quiz.class"
          :date="quiz.exam_date"
          @edit="() => handleEdit(quiz)"
          @delete="() => handleDelete(quiz.documentId)"
        />
      </div>
    </div>
    <div class="p-6 px-35">
      <PaginationNavigation
        v-model="currentPage"
        :totalPages="totalPages"
        containerClass="justify-center!"
      />
    </div>
  </div>
  <DeleteModal
    :isOpen="showDeleteModal"
    @close="showDeleteModal = false"
    @confirm="confirmDelete"
  />
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import Button from "../../../components/Button.vue";
import Search from "../../components/Search.vue";
import QuizCard from "../../components/QuizCard.vue";
import PaginationNavigation from "../../../components/PaginationNavigation.vue";
import { useAuthStore } from "../stores/auth";
import QuizModal from "../../components/QuizModal.vue";
import SuccessAlert from "../../../components/SuccessAlert.vue";
import DeleteModal from "../../../components/deleteModal.vue";

const authStore = useAuthStore();
useGqlToken("Bearer " + authStore.token);

const teacherIdData = await GqlGetTeacherId();
const teacherIds = teacherIdData.me;
// console.log(teacherIds.documentId);

const router = useRouter();
const quizzes = ref([]);

const searchQuery = ref("");
const currentPage = ref(1);
const itemsPerPage = ref(9);

const fetchQuizzes = async () => {
  const data = await GqlGetListQuizzByTeacher({
    documentId: teacherIds.documentId,
  });
  quizzes.value = data.usersPermissionsUser.quizzes_created;
  currentPage.value = 1;
};

const filteredQuizzes = computed(() => {
  return quizzes.value.filter((q) => {
    const searchTerm = searchQuery.value.toLowerCase();
    return (
      q.name.toLowerCase().includes(searchTerm) ||
      q.class.toLowerCase().includes(searchTerm) ||
      q.number_ques.toString().includes(searchTerm) ||
      q.time_limit.toString().includes(searchTerm)
    );
  });
});

const paginatedQuizzes = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  return filteredQuizzes.value.slice(start, start + itemsPerPage.value);
});

const totalPages = computed(() => {
  return Math.ceil(quizzes.value.length / itemsPerPage.value);
});

const isModalOpen = ref(false);
const alertMessage = ref("");
const showAlert = ref(false);
const ModalTitle = ref("Tạo đề thi mới");
const selectedQuiz = ref(null);

const handleSave = async (formData) => {
  // console.log("Dữ liệu lưu:", formData);
  try {
    if (formData.id) {
      console.log("cap nhật", formData);
      await GqlUpdateQuizz({
        documentId: formData.id,
        data: {
          name: formData.name,
          number_ques: Number(formData.questions),
          time_limit: Number(formData.duration),
          start_time: formData.startTime,
          end_time: formData.endTime,
          exam_date: formData.examtime,
          class: formData.class,
        },
      });
      console.log("Cập nhật thành công:");
      alertMessage.value = "Cập nhật thành công!";
      showAlert.value = true;
      setTimeout(() => (showAlert.value = false), 3000);
      fetchQuizzes();
    } else {
      const createQuizz = await GqlCreateQuizz({
        data: {
          name: formData.name,
          number_ques: Number(formData.questions),
          time_limit: Number(formData.duration),
          start_time: formData.startTime + ":00",
          end_time: formData.endTime + ":00",
          exam_date: formData.examtime,
          class: formData.class,
          startus: "Draft",
          create_by: teacherIds.documentId,
        },
      });
      console.log("Thêm mới thành công:", createQuizz);
      alertMessage.value = "Thêm mới thành công!";
      showAlert.value = true;
      setTimeout(() => (showAlert.value = false), 3000);
      fetchQuizzes();
    }
  } catch (error) {
    console.error("Lỗi khi không thành công:", error);
  }
};

const handleEdit = (quizz) => {
  selectedQuiz.value = quizzes.value.find(
    (q) => q.documentId === quizz.documentId
  );
  isModalOpen.value = true;
  ModalTitle.value = "Cập nhật đề thi";
  console.log("Chỉnh sửa đề thi với id:", quizz);
};

const resetModal = () => {
  ModalTitle.value = "Tạo đề thi mới";
  selectedQuiz.value = null;
};

const showDeleteModal = ref(false);
const quizzToDelete = ref(null);

const handleDelete = (id) => {
  quizzToDelete.value = id;
  showDeleteModal.value = true;
};

const confirmDelete = async () => {
  try {
    await GqlDeleteQuizz({ documentId: quizzToDelete.value });
    alertMessage.value = "Đã xóa thành công!";
    showAlert.value = true;
    setTimeout(() => (showAlert.value = false), 3000);
    fetchQuizzes();
  } catch (error) {
    console.error("Lỗi khi xóa:", error);
  }
};

onMounted(fetchQuizzes);
</script>

<style></style>
