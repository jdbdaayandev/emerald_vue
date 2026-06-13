// src/core/GameState.js
import Player from '../models/Player.js';

// Gagawa tayo ng isang active player instance na babasahin ng Phaser
const activePlayer = new Player("Ash");

// Dito naka-save ang default location ni Ash kapag nag-New Game
activePlayer.location = {
  map: 'sproutwood_town',
  x: 160,
  y: 160
};

export const GameState = {
  player: activePlayer,
};