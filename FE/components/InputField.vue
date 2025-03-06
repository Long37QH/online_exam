<template>
  <div class="mb-4">
    <label :for="id" class="block text-neutral-800 mb-2">{{ label }}</label>
    <input 
      :id="id"
      :type="type"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      :class="[
        'w-full p-3 border-b-gray-300 rounded-lg focus:outline-none bg-teal-50 text-neutral-800 focus:ring-2 focus:ring-green-500 border-b-1',
        className
      ]"
      :placeholder="placeholder"
      required
    />
    <p v-if="errorMessage" class="text-red-600 mt-1 text-sm">{{ errorMessage }}</p> 
  </div>
</template>

<script setup>
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
  errorMessage: String
})

defineEmits(['update:modelValue'])
</script>
