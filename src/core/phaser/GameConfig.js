// src/core/phaser/GameConfig.js
import Phaser from 'phaser';
import { gameScenes } from '../Registry.js';

export const config = {
  type: Phaser.WEBGL,
  parent: 'phaser-container', // Matches the div ID in App.vue
  width: 800,
  height: 600,
  pixelArt: true, // Prevents blurry scaling
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  physics: {
    default: 'arcade',
    arcade: { debug: true }
  },
  scene: gameScenes 
};