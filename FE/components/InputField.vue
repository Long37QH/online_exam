<template>
  <div class="mb-4">
    <label :for="id" class="block text-neutral-800 mb-2">{{ label }}</label>

    <!-- Input block -->
    <div class="relative">
      <span v-if="prefix" class="absolute left-3 transform translate-y-1/2">
        {{ prefix }}
      </span>
      <input :id="id" :type="isPasswordVisible ? 'text' : type" :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)" :class="[
          'w-full p-3 border-b-gray-300 rounded-lg focus:outline-none bg-teal-50 text-neutral-800 border-b-1',
          className, prefix ? 'pl-11' : ''
        ]" :placeholder="placeholder" required />

      <button v-if="type === 'password'" type="button" @click="togglePasswordVisibility"
        class="absolute right-3 transform top-1/2 -translate-y-1/2 text-gray-IconWarn">
        <component :is="isPasswordVisible ? EyeOpen : EyeClosed" class="w-5 h-5" />
      </button>
    </div>

    <p v-if="errorMessage" class="text-red-600 mt-1 text-sm">{{ errorMessage }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import EyeClosed from '~~/assets/icon/eyeClosed.svg'
import EyeOpen from '~~/assets/icon/eyeOpen.svg'


defineProps({
  className: String,
  id: String,
  label: String,
  type: {
    type: String,
    default: 'text'
  },
  modelValue: String,
  placeholder: String,
  errorMessage: String,
  prefix: String
})

defineEmits(['update:modelValue'])

const isPasswordVisible = ref(false)

const togglePasswordVisibility = () => {
  isPasswordVisible.value = !isPasswordVisible.value
}
</script>
