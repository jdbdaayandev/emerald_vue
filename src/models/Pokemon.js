// src/models/Pokemon.js
import pokemonData from '../data/pokemon.json';
import naturesData from '../data/natures.json';

export default class Pokemon {
  /**
   * @param {string} id - e.g., 'bulbasaur'
   * @param {number} level - Starting level
   * @param {object} options - Optional forced values (useful for trainer battles or loading saves)
   */
  constructor(id, level, options = {}) {
    const data = pokemonData[id];
    
    this.id = id;
    this.name = data.name;
    this.baseStats = data.baseStats;
    this.level = level;
    
    // Generate or load IVs (Individual Values: 0 to 31)
    this.ivs = options.ivs || this.generateRandomIVs();
    
    // Effort Values start at 0 for wild Pokémon
    this.evs = options.evs || { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 };
    
    // Assign Nature
    this.nature = options.nature || this.getRandomNature();
    
    // Assign Ability (Randomly pick one from the species' possible abilities)
    this.ability = options.ability || this.getRandomAbility(data.abilities);

    // Active battle stats
    this.stats = { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 };
    
    this.calculateStats();
    this.currentHp = options.currentHp !== undefined ? options.currentHp : this.stats.hp;
  }

  /**
   * The official Game Boy Advance stat calculation formula.
   */
  calculateStats() {
    // 1. Calculate HP
    const baseHp = this.baseStats.hp;
    const ivHp = this.ivs.hp;
    const evHp = Math.floor(this.evs.hp / 4);
    
    this.stats.hp = Math.floor(((2 * baseHp + ivHp + evHp) * this.level) / 100) + this.level + 10;

    // 2. Calculate Other Stats
    const otherStats = ['atk', 'def', 'spa', 'spd', 'spe'];
    const natureModifiers = this.getNatureModifiers();

    otherStats.forEach(stat => {
      const base = this.baseStats[stat];
      const iv = this.ivs[stat];
      const ev = Math.floor(this.evs[stat] / 4);
      
      // Core stat calculation
      let calculatedStat = Math.floor(((2 * base + iv + ev) * this.level) / 100) + 5;
      
      // Apply Nature modifier (increases by 10% or decreases by 10%)
      calculatedStat = Math.floor(calculatedStat * natureModifiers[stat]);
      
      this.stats[stat] = calculatedStat;
    });
  }

  /**
   * Returns an object mapping stat keys to their nature multiplier (0.9, 1.0, or 1.1)
   */
  getNatureModifiers() {
    const modifiers = { atk: 1, def: 1, spa: 1, spd: 1, spe: 1 };
    const natureData = naturesData[this.nature];

    if (natureData.increased) modifiers[natureData.increased] = 1.1;
    if (natureData.decreased) modifiers[natureData.decreased] = 0.9;

    return modifiers;
  }

  // --- RNG Helpers for Spawning ---

  generateRandomIVs() {
    return {
      hp: Math.floor(Math.random() * 32),
      atk: Math.floor(Math.random() * 32),
      def: Math.floor(Math.random() * 32),
      spa: Math.floor(Math.random() * 32),
      spd: Math.floor(Math.random() * 32),
      spe: Math.floor(Math.random() * 32)
    };
  }

  getRandomNature() {
    const natures = Object.keys(naturesData);
    const randomIndex = Math.floor(Math.random() * natures.length);
    return natures[randomIndex];
  }

  getRandomAbility(abilitiesArray) {
    if (!abilitiesArray || abilitiesArray.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * abilitiesArray.length);
    return abilitiesArray[randomIndex];
  }
}