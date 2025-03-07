<template>
  <div class="w-profileContain h-profileContain mx-auto mt-20">
    <!-- #################################################################################################### -->
    <!-- For Avatar -->

    <ErrorAlert v-if="showErrorAvatarAlert" title="Error!" content="Ảnh không được có kích thước lớn hơn 2Mb"
      className="fixed top-24 !w-profileContain" /> <!-- Display Alert for Avatar -->

    <div class="border border-grayBorder-Profile rounded-xl mb-4">
      <div class="mx-4 mb-4 pt-4">
        <p class="text-large font-bold mb-6">Tài khoản</p>
        <div class="grid grid-cols-2">
          <div class="flex items-center border-r-2 border-[#DFDFDF]">
            <img :src="studentAvatar" alt="" class="rounded-full w-avatar h-avatar mr-6" />

            <!-- Upload avatar Button -->
            <div class="text-center">
              <div class="w-btn-uploadPhoto">
                <Button content="Tải hình ảnh lên"
                  className="w-btn-uploadPhoto h-btn border-2 bg-white border-greenPrimary !text-greenPrimary hover:bg-greenPrimary hover:!text-white font-bold cursor-pointer"
                  @click="triggerFileInput" />

                <input type="file" ref="fileInput" @change="handleFileUpload" accept="image/*" style="display: none" />
              </div>

              <!-- Delete avatar Button -->
              <button class="text-redPrimary hover:underline underline-offset-2 cursor-pointer mt-1.5"
                @click="deleteAvatar">
                Xóa ảnh
              </button>
            </div>
          </div>
          <div class="flex justify-end">
            <div class="mx-auto">
              <p class="mb-2">Yêu cầu hình ảnh</p>
              <p class="text-small">1. Min. 400 x 400px</p>
              <p class="text-small">2. Max. 2MB</p>
              <p class="text-small">3. Khuôn mặt của bạn hoặc logo</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- #################################################################################################### -->
    <!-- Edit Profile -->
    <div class="border border-grayBorder-Profile rounded-xl mb-4">
      <div class="mx-4 mb-4 pt-4">
        <p class="text-large font-bold mb-6">Thông tin cá nhân</p>
        <div class="grid grid-cols-2 gap-4 mb-4">
          <!-- Input -->
          <InputField label="Họ tên" v-model="studentObject.name" placeholder="" :errorMessage="nameError" />
          <InputField label="Mật khẩu" v-model="studentObject.newPass" type="password" placeholder=""
            :errorMessage="passwordError" />
          <InputField label="Email" v-model="studentObject.email" type="email" placeholder=""
            :errorMessage="emailError" />
          <InputField label="Số điện thoại" v-model="studentObject.phone" type="number" prefix="+84" placeholder=""
            :errorMessage="phoneError" />


          <!-- Show Class -->
          <div class="mb-4 col-span-2">
            <label class="block mb-2">Khóa học</label>
            <div
              class="w-full p-3 border-b-neutral-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 bg-grayInput text-neutral-800 shadow-lg">
              <p>{{ student.class }}</p>
            </div>
          </div>
        </div>

        <!-- Submit button -->
        <div class="flex justify-end">
          <div class="w-32">
            <Button content="Cập nhật"
              className="bg-greenPrimary hover:bg-greenPrimary-hover text-white font-bold cursor-pointer"
              @click="submitUpdate" />
          </div>
        </div>
      </div>
    </div>

    <!-- Display Alert -->
    <SuccessAlert v-if="showSuccessAlert" title="Đã lưu thành công." content="Cài đặt hồ sơ của bạn đã được lưu." />

    <ErrorAlert v-if="showErrorProfileAlert" title="Error!" content="Thông tin nhập vào có lỗi sai !!!" />
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

// Initialize refs
const studentAvatar = ref('');
const fileInput = ref(null);
const showSuccessAlert = ref(false);
const showErrorAvatarAlert = ref(false);
const showErrorProfileAlert = ref(false);

const studentObject = ref({
  name: '',
  email: '',
  phone: '',
  newPass: null
})

// Get student data
const studentData = await GqlGetStudent({ "documentId": studentIds.documentId });
const student = studentData.usersPermissionsUser;

studentAvatar.value = student.avatar ? config.public.apiUrl + student.avatar.url : '/avatar.png';
studentObject.value.name = student.fullname;
studentObject.value.email = student.email;
studentObject.value.phone = student.phone ? student.phone.toString() : '';

// Handle show dialog box
const triggerFileInput = () => {
  fileInput.value.click(); // HTML DOM Element click()
};

// Handle upload file img
const handleFileUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  // Upload file to REST by FormData
  const formData = new FormData();
  formData.append('files', file);

  try {
    const fileData = await useUploadFile(formData)
    const uploadedFile = fileData[0];

    const maxSize = 2 * 1024; // 2Mb = 2 * 1024 Kb

    // Check image size
    if (uploadedFile.size > maxSize) {
      await useDeleteFile(uploadedFile.id);
      showErrorAvatarAlert.value = true;
      setTimeout(() => {
        showErrorAvatarAlert.value = false;
      }, 3000);
      return;
    }

    // Check if student has avatar
    if (student.avatar_id) {
      await deleteAvatar();
    }

    // Upload file to UserAvatar by GraphQL
    const uploadAvatarData = await GqlUploadAvatar({ "userId": studentIds.id, "avatarId": uploadedFile.id, "storeAvatarId": uploadedFile.id });
    const newAvatarDataUrl = uploadAvatarData.updateUsersPermissionsUser.data.avatar.url

    student.avatar_id = uploadedFile.id;
    studentAvatar.value = config.public.apiUrl + newAvatarDataUrl;
  } catch (error) {
    console.error('Error: ', error);
  }
};

// Delete avatar
const deleteAvatar = async () => {
  try {
    await GqlDeleteAvatar({ "userId": studentIds.id, "fileId": student.avatar_id });
    studentAvatar.value = '/avatar.png';
  } catch (error) {
    console.error('Error: ', error);
  }
};

// Validation name
const nameError = computed(() => {
  const name = studentObject.value.name || '';
  if (name.trim().length === 0) return 'Tên không được để trống';
  if (name[0] === ' ') return 'Tên không được bắt đầu bằng khoảng trắng';

  const words = name.trim().split(/\s+/);
  if (words.length < 2) return 'Tên phải có ít nhất 2 từ';

  const validNameRegex = /^[\p{L}\s]+$/u;
  if (!validNameRegex.test(name)) return 'Tên chỉ được chứa chữ cái và khoảng trắng';
  return '';
});

// Validation email
const emailError = computed(() => {
  const email = studentObject.value.email || '';
  if (!email) return 'Email không được để trống';
  if (/\s/.test(email)) return 'Email không được chứa khoảng trắng';

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return 'Email không đúng định dạng';
  return '';
});

// Validation password
const passwordError = computed(() => {
  const pass = studentObject.value.newPass || '';
  if (pass && pass.length < 8) return 'Mật khẩu phải có ít nhất 8 kí tự';
  if (pass && !/[A-Za-z]/.test(pass)) return 'Mật khẩu phải chứa chữ cái, số và ký tự đặc biệt';
  if (pass && !/\d/.test(pass)) return 'Mật khẩu phải chứa số và ký tự đặc biệt';
  if (pass && !/[!@#$%^&*(),.?":{}|<>]/.test(pass)) return 'Mật khẩu phải chứa ký tự đặc biệt';
  return '';
});

// Validation phone
const phoneError = computed(() => {
  const phone = studentObject.value.phone || '';
  if (phone && !/^\d+$/.test(phone)) return 'Số điện thoại chỉ được chứa số';
  if (phone && phone.length > 10) return 'Số điện thoại không được quá 10 số';
  return '';
});

// Handle Submit button
const submitUpdate = async () => {
  // Check validation
  if (nameError !== '' || emailError !== '' || passwordError !== '' || phoneError !== '') {
    showErrorProfileAlert.value = true;
    setTimeout(() => {
      showErrorProfileAlert.value = false;
    }, 3000)
    return
  }

  try {
    const updateData = {
      "userId": studentIds.id,
      "newName": studentObject.value.name,
      "newEmail": studentObject.value.email,
      "newPhone": Number(studentObject.value.phone),
    }

    // Check if it have new pass
    if (studentObject.value.newPass && studentObject.value.newPass.trim() !== '') {
      updateData.newPassword = studentObject.value.newPass;
    }

    const updateStudentData = await GqlUpdateStudent(updateData);

    showSuccessAlert.value = true;
    setTimeout(() => {
      showSuccessAlert.value = false;
    }, 3000);
  } catch (error) {
    console.error('Error: ', error);
  }
};
</script>