// src/core/Keybindings.js

// I-map natin ang GBA buttons sa keyboard keys
export const CONTROL_MAP = {
  UP: ['ArrowUp', 'w', 'W'],
  DOWN: ['ArrowDown', 's', 'S'],
  LEFT: ['ArrowLeft', 'a', 'A'],
  RIGHT: ['ArrowRight', 'd', 'D'],
  A: ['Enter', ' ', 'z', 'Z'],          // Confirm / Interact
  B: ['Escape', 'Backspace', 'x', 'X'], // Cancel / Back / Run
  START: ['Enter']
};

/**
 * Helper function para madaling i-check kung tugma ang pinindot na key
 * @param {string} buttonName - 'UP', 'DOWN', 'A', 'B'
 * @param {string} pressedKey - e.key mula sa event listener
 * @returns {boolean}
 */
export function isInput(buttonName, pressedKey) {
  const validKeys = CONTROL_MAP[buttonName];
  return validKeys ? validKeys.includes(pressedKey) : false;
}