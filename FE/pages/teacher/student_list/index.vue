<template>
  <div class="container mx-auto py-4 px-4 md:px-10">
    <SuccessAlert
      v-if="showAlert"
      :title="'Thông báo'"
      :content="alertMessage"
      class="fixed top-5 right-5 left-0"
    />
    <div class="flex flex-wrap justify-between items-center w-full mx-auto">
      <h2 class="text-2xl font-bold my-4 w-6/12">Danh sách học viên</h2>
      <div class="md:w-2/14">
        <Button
          @click="showModal = true"
          content="+ Thêm sinh viên"
          className="py-2 text-white bg-active"
        />
      </div>
    </div>

    <inputModal
      :isOpen="showModal"
      :defaultValues="modalData"
      :titleform="modalTitle"
      :isUpdating="isUpdating"
      @close="showModal = false"
      @update:isUpdating="isUpdating = $event"
      @submit="handleSubmit"
    />
    <!-- bộ lọc -->
    <div class="flex flex-wrap justify-between items-center gap-4 mb-4">
      <div class="flex flex-wrap gap-4 w-full md:w-8/12 p-5">
        <select v-model="pageSize" class="border py-1.5 px-2 rounded-lg">
          <option
            v-for="option in pageSizeOptions"
            :key="option"
            :value="option"
          >
            {{ option }}
          </option>
        </select>

        <select
          v-model="selectedClass"
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
      </div>

      <div class="w-full md:w-3/12 flex gap-2">
        <input
          v-model="searchQuery"
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
        :data="paginatedUsers"
        :show-index="true"
        :="currentPage"
        :page-size="pageSize"
        :show-actions="true"
      >
        <template #actions="{ item }">
          <button
            @click="btnupdate(item)"
            class="text-emerald-600 py-1 px-3 rounded-md"
          >
            <img src="../../../assets/icon/ic_edit.png" alt="" />
          </button>
          <button
            @click="btndelete(item)"
            class="text-emerald-600 py-1 px-3 rounded-md"
          >
            <img src="../../../assets/icon/ic_delete.png" alt="" />
          </button>
        </template>
      </Table>

      <!-- Phân trang -->
      <PaginationNavigation v-model="currentPage" :total-pages="totalPages" />
    </div>
  </div>
  <DeleteModal
    :isOpen="showDeleteModal"
    @close="showDeleteModal = false"
    @confirm="confirmDelete"
  />
</template>

<script setup>
import { ref, computed } from "vue";
import Button from "../../../components/Button.vue";
import inputModal from "../../../components/inputModal.vue";
import DeleteModal from "../../../components/deleteModal.vue";
import SuccessAlert from "../../../components/SuccessAlert.vue";
import Table from "../../../components/Table.vue";
import PaginationNavigation from "../../../components/PaginationNavigation.vue";

// definePageMeta({
//   layout: "teacher",
// });

const pageSizeOptions = [5, 10, 20, 50];
const pageSize = ref(5);
const currentPage = ref(1);
const searchQuery = ref("");
const selectedClass = ref("");

const columns = [
  { label: "Họ tên học viên", key: "fullname" },
  { label: "Email", key: "email" },
  { label: "Số điện thoại", key: "phone" },
  { label: "Khóa học", key: "class" },
];

// Gọi API
const {
  data: users,
  pending,
  error,
  refresh,
} = useFetch("http://localhost:1337/api/users", {
  query: {
    "filters[role][id][$eq]": 3,
  },
});

const uniqueClasses = computed(() => {
  return Array.from(new Set(users.value.map((q) => q.class).filter(Boolean)));
});

// Lọc dữ liệu
const filteredUsers = computed(() => {
  if (!users.value) return [];

  return users.value.filter((user) => {
    const matchesSearch =
      user.username.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.value.toLowerCase());

    const matchesClass = selectedClass.value
      ? user.class === selectedClass.value
      : true;

    return matchesSearch && matchesClass;
  });
});

// Tính tổng số trang
const totalPages = computed(() =>
  Math.ceil(filteredUsers.value.length / pageSize.value)
);

// Dữ liệu hiển thị theo trang (cập nhật currentPage nếu cần)
const paginatedUsers = computed(() => {
  if (currentPage.value > totalPages.value) {
    currentPage.value = 1;
  }
  const start = (currentPage.value - 1) * pageSize.value;
  return filteredUsers.value.slice(start, start + pageSize.value);
});

// Chuyển đến trang mới
const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};
const alertMessage = ref("");
const showAlert = ref(false);

// băt xư kiên nut thêm
const showModal = ref(false);
const modalData = ref({});
const isUpdating = ref(false);
const modalTitle = ref("Thêm mới học viên");

const handleSubmit = async (data) => {
  // console.log("Dữ liệu học viên:", data.username);
  if (data.id !== "") {
    console.log("dang cap nhat", data);
    try {
      const updateitem = await GqlUpdateUsersPermissionsUser({
        UserId: data.id,
        data: {
          fullname: data.fullname,
          username: data.email,
          email: data.email,
          phone: data.phone,
          class: data.class,
        },
      });
      console.log("cập nhật thành công:", updateitem);
      showModal.value = false;
      alertMessage.value = "cập nhật thành công!";
      showAlert.value = true;
      setTimeout(() => (showAlert.value = false), 3000);
      refresh();
    } catch (error) {
      console.error("Cập nhật không thành công:", error);
    }
  } else {
    console.log("them mơi dữ liêu", data);
    try {
      const creatitem = await GqlCreateUsersPermissionsUser({
        data: {
          fullname: data.fullname,
          username: data.email,
          email: data.email,
          password: data.password,
          class: data.class,
          phone: data.phone,
          role: 3,
        },
      });
      console.log("Thêm mới thành công:", creatitem);
      showModal.value = false;
      alertMessage.value = "Thêm mới thành công!";
      showAlert.value = true;
      setTimeout(() => (showAlert.value = false), 3000);
      refresh();
    } catch (error) {
      console.error("Lỗi khi thêm mới:", error);
    }
  }
};

const btnupdate = (student) => {
  // alert(`id hoc vien: ${student.id}`);
  showModal.value = true;
  modalTitle.value = "Cập nhật sinh viên";
  isUpdating.value = true;
  modalData.value = { ...student };
  console.log(modalData.value);
};

// xử lý xóa hoc vien
const showDeleteModal = ref(false);
const studentToDelete = ref(null);
const btndelete = (student) => {
  studentToDelete.value = student;
  showDeleteModal.value = true;
};

const confirmDelete = async () => {
  if (!studentToDelete.value) return;

  try {
    await GqlDeleteUsersStudent({ UserId: studentToDelete.value.id });
    console.log("Xóa thành công:", studentToDelete.value);
    alertMessage.value = "Xóa thành công!";
    showAlert.value = true;
    setTimeout(() => (showAlert.value = false), 3000);

    refresh();
  } catch (error) {
    console.error("Lỗi khi xóa:", error);
  } finally {
    showDeleteModal.value = false;
    studentToDelete.value = null;
  }
};
</script>

<style></style>
