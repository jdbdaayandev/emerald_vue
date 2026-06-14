// src/core/events/EventBus.js

/**
 * A lightweight, global event bus using the native browser API.
 * This is the ONLY way Vue and Phaser should communicate.
 */
class GameEventBus extends EventTarget {
  /**
   * Broadcast an event to the rest of the application.
   * @param {string} eventName - The name of the event (use the EVENTS object below).
   * @param {any} detail - Optional data payload to send with the event.
   */
  emit(eventName, detail = null) {
    this.dispatchEvent(new CustomEvent(eventName, { detail }));
  }

  /**
   * Listen for an event.
   * @param {string} eventName - The name of the event.
   * @param {Function} callback - The function to run when the event happens.
   */
  on(eventName, callback) {
    this.addEventListener(eventName, callback);
  }

  /**
   * Stop listening for an event. (Crucial for preventing memory leaks when unmounting Vue components).
   * @param {string} eventName - The name of the event.
   * @param {Function} callback - The function to remove.
   */
  off(eventName, callback) {
    this.removeEventListener(eventName, callback);
  }
}

// Export a single, global instance of the Event Bus
export const EventBus = new GameEventBus();

// Standardize event names to avoid typos and keep track of your application's flow
export const EVENTS = {
  // Engine & System
  SCENE_READY: 'SCENE_READY',
  PAUSE_GAME: 'PAUSE_GAME',
  RESUME_GAME: 'RESUME_GAME',
  
  // Encounters & Battles
  BATTLE_STARTED: 'BATTLE_STARTED',
  BATTLE_ENDED: 'BATTLE_ENDED',
  
  // UI & Dialog
  DIALOG_TRIGGERED: 'DIALOG_TRIGGERED',
  DIALOG_ENDED: 'DIALOG_ENDED',
  OPEN_MENU: 'OPEN_MENU',
  CLOSE_MENU: 'CLOSE_MENU'
};