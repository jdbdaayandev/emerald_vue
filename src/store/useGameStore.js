// src/store/useGameStore.js
import { defineStore } from 'pinia';

export const useGameStore = defineStore('game', {
  state: () => ({
    // Global flags track permanent changes in the world
    npcFlags: {
      mom_spoken_to: false,
      oak_gave_pokedex: false,
      route1_bugcatcher_defeated: false
    }
  }),
  actions: {
    setNpcFlag(flagId, value = true) {
      this.npcFlags[flagId] = value;
    },
    getNpcFlag(flagId) {
      return this.npcFlags[flagId] || false;
    }
  }
});