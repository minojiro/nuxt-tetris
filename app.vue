<script setup lang="ts">
import { useGame } from './composable/useGame';

const {
  gameStart,
  gameStatus,
  tick,
  moveBlock,
  field,
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
  <div>
    <div v-for="line in field" :style="{display: 'flex'}">
      <div v-for="cell in line">
        {{ cell }}
      </div>
    </div>
    <div v-if="gameStatus === 'cover'">
      <p>press any key to start</p>
    </div>
    <div v-if="gameStatus === 'end'">
      <p>gameover</p>
    </div>
  </div>
</template>
