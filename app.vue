<script setup lang="ts">
import { useGame } from './composable/useGame';

const {
  gameStart,
  gameStatus,
  tick,
  moveBlock,
  field,
  score,
} = useGame({genRandomNum: Math.random})

const timerFn = () => {
  tick()
  setTimeout(timerFn, 1000)
}
timerFn()

const handleKeyDown = (e:KeyboardEvent) => {
  if (gameStatus.value === 'cover') {
    gameStart()
    return
  }
  switch(e.code) {
    case 'ArrowDown':
      moveBlock('down')
      break;
    case 'ArrowRight':
      moveBlock('right')
      break;
    case 'ArrowLeft':
      moveBlock('left')
      break;
    case 'Space':
      moveBlock('rotate')
      break;
  }
}
onMounted(() => {
  document.addEventListener('keydown', handleKeyDown)
})
onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleKeyDown)
})
</script>

<template>
  <div class="h-screen w-screen flex justify-center items-center">
    <div class="max-w-xs w-full">
      <div v-for="line in field" class="flex">
        <Block v-for="cell in line" :num="cell" />
      </div>
      <div class="mt-5 text-white font-bold">
        <p v-if="gameStatus === 'cover'">Press any key to start</p>
        <p v-if="gameStatus === 'playing'">SCORE: {{ score }}</p>
        <p v-if="gameStatus === 'end'">Game Over! (SCORE: {{ score }})</p>
      </div>
    </div>
  </div>
</template>
