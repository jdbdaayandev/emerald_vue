<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { EventBus } from '../../core/events/EventBus.js';
import { isInput } from '../../core/Keybindings.js';

const selectedIndex = ref(0); 

function handleKeydown(e) {
  if (isInput('UP', e.key)) {
    selectedIndex.value = 0;
  } else if (isInput('DOWN', e.key)) {
    selectedIndex.value = 1;
  } else if (isInput('A', e.key)) {
    e.preventDefault(); 
    executeSelection();
  }
}

function executeSelection() {
  if (selectedIndex.value === 0) {
    startNewGame();
  } else {
    console.log("Walang save file! Continue disabled muna.");
  }
}

function startNewGame() {
  // Hide the UI menu
  EventBus.emit('CLOSE_MENU');
  
  // Grab the Phaser engine and start the game
  const game = document.querySelector('canvas').__phaser;
  
  if (game) {
    game.scene.stop('IntroScene');
    game.scene.start('OverworldScene');
  }
}

onMounted(() => { window.addEventListener('keydown', handleKeydown); });
onUnmounted(() => { window.removeEventListener('keydown', handleKeydown); });
</script>

<template>
  <div class="absolute inset-0 flex items-center justify-center">
    <div class="bg-gba-bg border-4 border-gba-border p-6 rounded-md w-64 shadow-lg text-gba-text font-pixel">
      
      <div class="text-xl py-2 px-2 mb-2 flex items-center">
        <span :class="selectedIndex === 0 ? 'text-health-green opacity-100' : 'opacity-0'" class="mr-2">▶</span> 
        <span>NEW GAME</span>
      </div>

      <div class="text-xl py-2 px-2 flex items-center opacity-50">
        <span :class="selectedIndex === 1 ? 'text-health-green opacity-100' : 'opacity-0'" class="mr-2">▶</span> 
        <span>CONTINUE</span>
      </div>
      
    </div>
  </div>
</template>