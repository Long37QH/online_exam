<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
  >
    <div class="bg-white rounded-2xl p-6 w-full max-w-xl shadow-lg">
      <h2 class="text-2xl font-bold mb-4">{{ title }}</h2>

      <form @submit.prevent="handleSubmit">
        <div class="space-y-4">
          <InputField label="Tiêu đề" v-model="form.name" type="text" />
          <InputField label="Lớp" v-model="form.class" type="text" />

          <div class="grid grid-cols-2 gap-4">
            <InputField
              label="Số câu hỏi"
              v-model="form.questions"
              type="number"
            />
            <InputField
              label="Thời gian thi (phút)"
              v-model="form.duration"
              type="number"
            />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <InputField
              label="Giờ bắt đầu"
              v-model="form.startTime"
              type="time"
            />
            <InputField
              label="Giờ kết thúc"
              v-model="form.endTime"
              type="time"
            />
          </div>

          <InputField label="Ngày thi" v-model="form.examtime" type="date" />
        </div>

        <div class="flex justify-end gap-3 mt-6">
          <button
            type="button"
            @click="handleCancel"
            class="px-5 py-2 border border-gray-400 rounded-lg text-gray-700 hover:bg-gray-100"
          >
            Hủy
          </button>
          <button
            type="submit"
            class="px-5 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            Lưu
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, defineEmits, defineProps, watch } from "vue";
import InputField from "./InputField.vue";

const props = defineProps({
  isOpen: Boolean,
  title: {
    type: String,
    default: "Thêm mới đề thi",
  },
  editData: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(["close", "save"]);

const initialForm = {
  name: "",
  questions: "",
  duration: "",
  startTime: "",
  endTime: "",
  examtime: "",
  class: "",
};

const form = ref({ ...initialForm });

const resetForm = () => {
  form.value = { ...initialForm };
};

const populateForm = (data) => {
  if (data) {
    form.value = {
      name: data.name,
      questions: data.number_ques,
      duration: data.time_limit,
      startTime: data.start_time,
      endTime: data.end_time,
      examtime: data.exam_date,
      class: data.class,
    };
  } else {
    resetForm();
  }
};

const handleCancel = () => {
  resetForm();
  emit("close");
};

const handleSubmit = () => {
  emit("save", { ...form.value, id: props.editData?.documentId });
  resetForm();
  emit("close");
};

watch(
  () => props.isOpen,
  (newVal) => {
    if (newVal) populateForm(props.editData);
    else resetForm();
  }
);
</script>
