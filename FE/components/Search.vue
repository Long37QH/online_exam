<template>
    <div :class="props.class_" class="w-full h-10 bg-grayInput rounded-xl flex items-center text-grayLight group">
        <div class="w-6 h-6 ml-4 mr-2 group-focus-within:text-black duration-300">
            <IconSearch />
        </div>
        <input type="text" v-model="searchText" placeholder="Tìm kiếm"
            class="w-full text-regular font-light outline-none" />
    </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import IconSearch from '~/assets/icon/search.svg';

interface SearchProps {
    class_?: string;
    modelValue?: string;
}

const props = defineProps<SearchProps>()
const emit = defineEmits<{ (e: 'update:modelValue', value: string): void }>();

const searchText = ref(props.modelValue || '');

watch(() => props.modelValue, (newVal) => {
    if (newVal !== searchText.value) {
        searchText.value = newVal || '';
    }
});

watch(searchText, (newVal) => {
    emit('update:modelValue', newVal);
});
</script>

<style></style>