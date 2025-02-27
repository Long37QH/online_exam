<template>
  <div class="QuizzesPage">
    <div class="flex w-full h-screen">
      <!-- #################################################################################################### -->
      <!-- Quizzes block -->
      <div class="w-3/4 border-r-2 border-[#DFDFDF]">
        <div class="flex justify-between mt-8 mb-6 mx-[60px]">
          <p class="text-2xl font-bold">Danh sách đề thi</p>

          <div class="w-searchInput h-10 bg-grayInput rounded-xl flex items-center text-grayLight group">
            <div class="w-6 h-6 ml-4 mr-2 group-focus-within:text-black duration-300">
              <IconSearch />
            </div>
            <input type="text" placeholder="Tìm kiếm" class="text-regular font-light outline-none" />
          </div>
        </div>


        <!-- Show quizzes -->
        <div class="QuizzesContain mx-28">
          <QuizContain v-for="(quiz, i) in quizzes" :key="i" :quizName="quiz.name" :quizId="quiz.documentId"
            quizDate="25/02/2025" :time="quiz.time_limit" :questCount="quiz.questions.length" author="Mr. Admin" />
        </div>
      </div>



      <!-- #################################################################################################### -->
      <!-- User block -->
      <div class="mx-auto mt-[74px]">
        <img src="/avatar.png" alt="" class="rounded-full w-[96px] h-[96px] mb-6 mx-auto" />
        <p class="text-xl font-bold text-center mb-6">Trần Duy Anh</p>

        <div class="w-[184px] mx-auto">
          <p class="text-[#21272A] text-regular mb-3 font-light">
            duyanh@gmail.com
          </p>
          <p class="text-[#21272A] text-regular mb-3 font-light">
            Ngày sinh: 08/12/2002
          </p>
          <p class="text-[#21272A] text-regular mb-6 font-light">Khóa: 20</p>
        </div>

        <button @click="$router.push('/quiz')"
          class="w-[325px] h-[54px] border-2 border-gray-InfoBtn rounded-2xl text-gray-InfoBtn hover:bg-gray-InfoBtn hover:text-white hover:font-bold cursor-pointer duration-300">
          Chỉnh sửa thông tin cá nhân
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import IconSearch from '~/assets/icon/search.svg';

const data = await GqlGetQuizzes();

const quizzes = data.quizzes;
// console.log(quizzes);
</script>
