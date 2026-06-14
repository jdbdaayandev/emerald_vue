<!-- src/components/ui/DialogueBox.vue -->
<template>
  <div v-if="isVisible" class="dialogue-container">
    <div class="dialogue-box">
      <!-- Pangalan ng Nagsasalita -->
      <div v-if="speaker" class="speaker-name">{{ speaker }}</div>
      
      <!-- Ang Mensahe -->
      <div class="dialogue-text">{{ displayedText }}</div>
      
      <!-- Tumatalbog na arrow kapag tapos na ang text -->
      <div v-if="isLineFinished" class="next-indicator">▼</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { EventBus, EVENTS } from '../../core/events/EventBus.js';
import dialoguesData from '../../data/dialogues.json';

const isVisible = ref(false);
const speaker = ref('');
const displayedText = ref('');
const isLineFinished = ref(false);

let currentLines = [];
let currentLineIndex = 0;
let fullText = '';
let typewriterInterval = null;

// 🪄 TYPEWRITER EFFECT
const typeText = () => {
  let charIndex = 0;
  displayedText.value = '';
  isLineFinished.value = false;

  typewriterInterval = setInterval(() => {
    displayedText.value += fullText[charIndex];
    charIndex++;

    if (charIndex >= fullText.length) {
      clearInterval(typewriterInterval);
      isLineFinished.value = true;
    }
  }, 30); // Bilis ng type (30ms per letter)
};

// ⏩ NEXT LINE LOGIC
const nextLine = () => {
  // 👇 ANG FIX: Kapag hindi pa tapos mag-type, huwag pansinin ang pindot! 👇
  if (!isLineFinished.value) {
    return; 
  }

  currentLineIndex++;

  // May susunod pa bang sasabihin?
  if (currentLineIndex < currentLines.length) {
    speaker.value = currentLines[currentLineIndex].speaker || '';
    fullText = currentLines[currentLineIndex].text;
    typeText();
  } else {
    // Tapos na ang usapan! Itago na ang Box.
    isVisible.value = false;
    
    // Isigaw sa EventBus na tapos na para makagalaw na ulit si Ash!
    EventBus.emit('DIALOG_ENDED'); 
  }
};

// 🎮 CONTROLS (Z, Enter, o Space)
const handleKeydown = (e) => {
  if (!isVisible.value) return;
  const validKeys = ['Enter', ' ', 'z', 'Z'];
  if (validKeys.includes(e.key)) {
    nextLine();
  }
};

onMounted(() => {
  // Makinig kapag may tumawag ng DIALOG_TRIGGERED
  EventBus.on(EVENTS.DIALOG_TRIGGERED, (e) => {
    // 👇 ANG FIX: Kunin ang data mula sa e.detail 👇
    const data = e.detail; 
    
    if (!data || !data.dialogId) return;

    const dialogData = dialoguesData[data.dialogId];
    
    if (dialogData && dialogData.length > 0) {
      currentLines = dialogData;
      currentLineIndex = 0;
      speaker.value = data.speaker || currentLines[0].speaker || '';
      fullText = currentLines[0].text;
      
      isVisible.value = true;
      typeText();
    }
  });

  window.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  // Linisin para hindi mag-lag
  EventBus.off(EVENTS.DIALOG_TRIGGERED);
  window.removeEventListener('keydown', handleKeydown);
  clearInterval(typewriterInterval);
});
</script>

<style scoped>
/* Retro Pokémon-style na kahon */
.dialogue-container {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: 80%;
  max-width: 600px;
  z-index: 1000; /* Para laging nasa ibabaw ng game canvas */
}

.dialogue-box {
  background-color: #f8f8f8;
  border: 4px solid #4a4a4a;
  border-radius: 8px;
  padding: 16px;
  font-family: 'Courier New', Courier, monospace; /* Pwede mong palitan ng sarili mong font */
  font-size: 20px;
  color: #000;
  min-height: 90px;
  position: relative;
  box-shadow: inset 0 0 0 2px #fff, 0 4px 6px rgba(0,0,0,0.5);
  user-select: none;
}

.speaker-name {
  font-weight: bold;
  color: #e74c3c;
  margin-bottom: 8px;
  text-transform: uppercase;
}

.dialogue-text {
  line-height: 1.5;
}

.next-indicator {
  position: absolute;
  bottom: 10px;
  right: 15px;
  color: #e74c3c;
  animation: bounce 1s infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(5px); }
}
</style>