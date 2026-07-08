<template>
  <router-link 
    v-if="props.to" 
    :to="props.to" 
    :class="[
      buttonColor,
      props.fullWidth && 'w-full',
      disabledClasses
    ]"
    class="appointment-btn cursor-pointer px-1 py-1 md:px-4 md:py-2 rounded text-center text-white text-lg md:text-2xl border-1 border-white transition-all duration-700 hover:bg-white"
  >
    {{ props.loading ? '...Loading' : props.text }}
  </router-link>

  <button 
  v-else
  :disabled="props.disabled || props.loading"
  class="appointment-btn cursor-pointer px-1 py-1 md:px-4 md:py-2 rounded text-center text-white text-lg md:text-2xl border-1 border-white transition-all duration-700 hover:bg-white"
  :class="[
      buttonColor,
      props.fullWidth && 'w-full',
      disabledClasses
    ]"
  >
    {{ props.loading ? '...Loading' : props.text }}
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';


interface ButtonProps {
  text: string;
  color: 'blue' | 'green' | 'red' | 'gray' | 'pink';
  disabled?: boolean;
  loading?: boolean;
  to?: string;
  fullWidth?: boolean;
}

const props = defineProps<ButtonProps>()

const buttonColor = computed(() => {
  switch (props.color) {
    case 'blue':
      return 'bg-blue-500 hover:text-blue-500 hover:border-blue-400'

    case 'green':
      return 'bg-green-500 hover:text-green-500 hover:border-green-400'

    case 'red':
      return 'bg-red-500 hover:text-red-500 hover:border-red-400'
    
    case 'pink':
      return 'bg-pink-500 hover:text-pink-500 hover:border-pink-400'
    
    default:
      return 'bg-gray-500 hover:text-gray-500 hover:border-gray-400'
  }
})

const disabledClasses = computed(() => {
  if (props.disabled || props.loading) {
    return 'opacity-50 cursor-not-allowed pointer-events-none'
  }

  return ''
})

</script>

<style scoped>
</style>
