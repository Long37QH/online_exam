<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="isOpen"
        class="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
      >
        <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-[700px]">
          <h2 class="text-2xl font-bold mb-4">{{ titleform }}</h2>

          <form @submit.prevent="submitForm">
            <div class="grid grid-cols-2 gap-4">
              <div class="hidden">
                <InputField
                  label="ID"
                  v-model="formData.id"
                  id="ID"
                  type="text"
                />
              </div>
              <div>
                <InputField
                  label="Họ tên"
                  v-model="formData.fullname"
                  id="fullname"
                  type="text"
                  :error-message="errors.fullname"
                  :class-name="
                    errors.fullname ? 'focus:ring-2 focus:ring-red-500' : ''
                  "
                />
              </div>

              <div>
                <InputField
                  label="Mật khẩu"
                  v-model="formData.password"
                  id="password"
                  type="password"
                  :error-message="errors.password"
                  :class-name="
                    errors.password ? 'focus:ring-2 focus:ring-red-500' : ''
                  "
                  :disabled="isUpdating"
                />
              </div>

              <div>
                <InputField
                  label="Email"
                  v-model="formData.email"
                  id="email"
                  type="email"
                  :error-message="errors.email"
                  :class-name="
                    errors.email ? 'focus:ring-2 focus:ring-red-500' : ''
                  "
                />
              </div>

              <div>
                <InputField
                  label="Điện thoại"
                  v-model="formData.phone"
                  id="phone"
                  type="text"
                  :error-message="errors.phone"
                  :class-name="
                    errors.phone ? 'focus:ring-2 focus:ring-red-500' : ''
                  "
                />
              </div>

              <div class="col-span-2">
                <InputField
                  label="Khóa học"
                  v-model="formData.class"
                  id="class"
                  type="text"
                  class-name="col-span-2"
                  :error-message="errors.class"
                  :class-name="
                    errors.class ? 'focus:ring-2 focus:ring-red-500' : ''
                  "
                />
              </div>
            </div>

            <div class="flex justify-end gap-2 mt-4">
              <button
                type="button"
                @click="closeModal"
                class="bg-gray-300 px-4 py-2 rounded"
              >
                Hủy
              </button>
              <button
                type="submit"
                class="bg-green-600 text-white px-4 py-2 rounded"
              >
                Lưu
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { defineProps, defineEmits, reactive, watch } from "vue";
import InputField from "./InputField.vue";

const props = defineProps({
  isOpen: Boolean,
  defaultValues: Object,
  titleform: String,
  isUpdating: Boolean,
});

const emit = defineEmits(["close", "submit"]);

const formData = reactive({
  id: "",
  fullname: "",
  password: "",
  email: "",
  phone: "",
  class: "",
});

const errors = reactive({});

// Cập nhật dữ liệu khi mở modal
watch(
  () => props.defaultValues,
  (newValues) => {
    Object.assign(formData, newValues || {});
  },
  { immediate: true }
);

const validate = () => {
  errors.fullname =
    !/^[A-Za-zÀ-ỹ\s]+$/.test(formData.fullname.trim()) ||
    formData.fullname.trim().split(" ").length < 2
      ? "Họ tên phải có ít nhất 2 từ, không chứa ký tự đặc biệt"
      : "";

  if (!props.isUpdating) {
    errors.password =
      formData.password.length < 8 ||
      !/[A-Za-z]/.test(formData.password) ||
      !/\d/.test(formData.password)
        ? "Mật khẩu phải có ít nhất 8 ký tự, gồm chữ & số"
        : "";
  }

  errors.email = !/^\S+@\S+\.\S+$/.test(formData.email.trim())
    ? "Email không hợp lệ"
    : "";

  errors.phone = !/^(\+84|0)[0-9]{9}$/.test(formData.phone.trim())
    ? "Số điện thoại phải có 10 số, bắt đầu bằng +84 hoặc 0"
    : "";

  errors.class =
    formData.class.trim() !== formData.class
      ? "Lớp không được có dấu cách đầu dòng"
      : "";

  return !Object.values(errors).some((error) => error);
};

const closeModal = () => {
  Object.assign(formData, {
    id: "",
    fullname: "",
    password: "",
    email: "",
    phone: "",
    class: "",
  });
  Object.assign(errors, {});

  emit("close");
  emit("update:isUpdating", false);
};

const submitForm = () => {
  if (!validate()) return;
  emit("submit", { ...formData });
  closeModal();
};
</script>
