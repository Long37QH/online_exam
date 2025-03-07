<template>
    <table class="min-w-full border border-grayBorder-Profile rounded-lg">
        <thead class="bg-[#F3F8F2] text-left">
            <tr>
                <th class="p-4">Mã đề thi</th>
                <th class="p-3">Đề thi</th>
                <th class="p-3">Thời gian bắt đầu</th>
                <th class="p-3">Thời gian kết thúc</th>
                <th class="p-3">Số câu hỏi</th>
                <th class="p-3">Số điểm</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(exam, index) in exams" :key="index" class="border border-grayBorder-Profile">
                <td class="p-3">{{ exam.quizz_id.documentId }}</td>
                <td class="p-3 font-semibold">{{ exam.quizz_id.name }}</td>
                <td class="p-3">{{ formatDateTime(exam.start_at) }}</td>
                <td class="p-3">{{ formatDateTime(exam.completed_at) }}</td>
                <td class="p-3">{{ exam.quizz_id.questions.length }}</td>
                <td class="p-3 text-green-600 font-semibold">{{ exam.score }}</td>
            </tr>
        </tbody>
    </table>
</template>

<script setup>
const props = defineProps({
    exams: {
        type: Array,
        required: true
    }
});

function formatDateTime(dateTime) {
    const date = new Date(dateTime);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${hours}:${minutes}:${seconds} ${day}/${month}/${year}`;
}
</script>