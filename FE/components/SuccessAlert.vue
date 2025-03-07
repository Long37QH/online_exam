<template>
    <div :class="className" class="flex items-center w-full h-btn rounded-xl bg-greenLight border-l-4 border-greenPrimary duration-300">
        <div class="text-greenPrimary mx-4">
            <Tick />
        </div>
        <p class="text-small font-bold">{{ props.title }} <span class="font-normal">{{ props.content }}</span></p>
    </div>
</template>

<script lang="ts" setup>
import Tick from '../assets/icon/tick.svg';

interface TickProps {
    title: string;
    content: string;
    className? : string;
}

const props = defineProps<TickProps>();
</script>