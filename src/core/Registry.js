// src/core/Registry.js
import BootScene from '../scenes/BootScene.js';
import SplashScene from '../scenes/SplashScene.js';
import IntroScene from '../scenes/IntroScene.js';
import OverworldScene from '../scenes/OverworldScene.js';

/**
 * Registers all global Vue components.
 * Call this in main.js before mounting the app.
 */
export function registerVueDependencies(app) {
  // Vue UI components will be registered here later
}

/**
 * An array of all Phaser scenes.
 */
export const gameScenes = [
  BootScene,
  SplashScene,
  IntroScene,
  OverworldScene
];