<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import Phaser from 'phaser';
import { config } from './core/phaser/GameConfig.js';
import { EventBus, EVENTS } from './core/events/EventBus.js';
import StartMenu from './components/ui/StartMenu.vue';

let gameInstance = null;
const activeMenu = ref(null);

onMounted(() => {
  gameInstance = new Phaser.Game(config);
  
  // Attach instance to canvas for easy external scene switching
  setTimeout(() => {
    document.querySelector('canvas').__phaser = gameInstance;
  }, 100);

  // Listen for menu events from Phaser
  EventBus.on(EVENTS.OPEN_MENU, (e) => {
    activeMenu.value = e.detail.menuId;
  });

  EventBus.on('CLOSE_MENU', () => {
    activeMenu.value = null;
  });
});

onUnmounted(() => {
  if (gameInstance) gameInstance.destroy(true);
});
</script>

<template>
  <div class="relative w-[800px] h-[600px] bg-black shadow-2xl ring-4 ring-black rounded-sm overflow-hidden">
    <div id="phaser-container" class="absolute inset-0 w-full h-full"></div>

    <div id="ui-layer" class="absolute inset-0 w-full h-full pointer-events-none [&>*]:pointer-events-auto">
      
      <StartMenu v-if="activeMenu === 'startMenu'" />

    </div>
  </div>
</template>