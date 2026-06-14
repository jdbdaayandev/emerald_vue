// src/core/GameState.js
import Player from '../models/Player.js';

// Gagawa tayo ng isang active player instance na babasahin ng Phaser
const activePlayer = new Player("Ash");

// Dito naka-save ang default location ni Ash kapag nag-New Game
activePlayer.location = {
  map: 'sproutwood_town',
  x: 320,  // 👈 Tile 20 * 16
  y: 144   // 👈 Tile 9 * 16
};

export const GameState = {
  player: activePlayer,
  
  // 👇 IDAGDAG ANG STORY FLAGS DITO 👇
  storyFlags: {
    momIntroFinished: false
  }
};