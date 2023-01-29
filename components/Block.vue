<script setup lang="ts">
const props = defineProps({
  num: Number
})
</script>

<template>
  <div
    class="aspect-square flex-1"
    :class="{
      '0': 'bg-gray-800',
      '1': 'bg-yellow-300',
      '2': 'bg-blue-300',
      '3': 'bg-red-500',
      '4': 'bg-yellow-600',
      '5': 'bg-blue-400',
      '6': 'bg-blue-400',
      '7': 'bg-pink-400',
      '8': 'bg-yellow-300',
    }[String(props.num)]"
  ></div>
</template>
