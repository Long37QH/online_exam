<template>
  <div>
    <h1 class="text-blue-600 text-5xl">Hello</h1>
  </div>
</template>

<script lang="ts" setup>
const data = await GqlGetQuizzes();
const quizzes = data.quizzes;

console.log(quizzes);
</script>

<style></style>