<script setup lang="ts">
const props = defineProps({
  num: Number
})
</script>

<template>
  <div
    class="aspect-square flex-1 bg-gray-100"
    :class="{
      '0': 'bg-gray-500',
      '1': 'bg-red-500',
      '2': 'bg-blue-500',
      '3': 'bg-green-500',
      '4': 'bg-yellow-500',
      '5': 'bg-purple-500',
      '7': 'bg-indigo-200',
    }[String(props.num)]"
  ></div>
</template>
