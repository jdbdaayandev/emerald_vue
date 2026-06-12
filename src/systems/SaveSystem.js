// src/systems/SaveSystem.js
import Pokemon from '../models/Pokemon.js';
import { useGameStore } from '../store/useGameStore.js';

export default class SaveSystem {
  static saveGame() {
    const gameStore = useGameStore();
    
    // Convert the entire player state (party, money, flags) into a string
    const saveData = JSON.stringify({
      party: gameStore.player.party,
      money: gameStore.player.money,
      flags: gameStore.npcFlags
    });

    localStorage.setItem('emerald_save', saveData);
    console.log('Game saved!');
  }

  static loadGame() {
    const gameStore = useGameStore();
    const saveString = localStorage.getItem('emerald_save');

    if (!saveString) return false; // No save file found

    const savedData = JSON.parse(saveString);

    // 1. DYNAMICALLY REBUILD THE PARTY
    // We map over the saved array and pass the dynamic data right back into the model
    const loadedParty = savedData.party.map(savedPoke => {
      return new Pokemon(
        savedPoke.id,     // Dynamically passes 'charmander', 'pidgey', etc.
        savedPoke.level,  // Dynamically passes the saved level
        savedPoke         // Passes the ENTIRE saved object (ivs, evs, nature, currentHp) as the options!
      );
    });

    // 2. Restore state to Pinia
    gameStore.player.party = loadedParty;
    gameStore.player.money = savedData.money;
    gameStore.npcFlags = savedData.flags;

    console.log('Game loaded successfully!');
    return true;
  }
}