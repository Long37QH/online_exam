  <template>
    <div class="max-w-md mb-10">
      <p><span class="text-big font-semibold mr-1">Câu {{ questNumber }}: </span>{{ questContent }}</p>

      <div class="space-y-2 mt-2">
        <label v-for="(option, index) in options" :key="index" class="flex items-center space-x-2 p-1 cursor-pointer"
          @click="selectOption(index)">

          <input type="radio" :checked="selectedOption === index" class="hidden" />
          <div class="w-4 h-4 rounded-full flex items-center justify-center bg-[#Dfdfdf]">
            <div v-if="selectedOption === index" class="w-2.5 h-2.5 bg-greenPrimary rounded-full"></div>
          </div>
          <span class="text-answerTxt">{{ option }}</span>
        </label>
      </div>
    </div>
  </template>

<script lang="ts" setup>
import { ref } from 'vue';

interface QuestContainProps {
  questNumber: number;
  questContent: string;
  options: string[];
}

const props = defineProps<QuestContainProps>()

const options = props.options;
const selectedOption = ref<number | null>(null);
const emit = defineEmits(["answer-selected"]);

const selectOption = (index: number) => {
  selectedOption.value = index;
  emit("answer-selected", props.questNumber);
};
</script>

<style></style>
