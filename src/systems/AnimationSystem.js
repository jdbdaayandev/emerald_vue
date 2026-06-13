// src/systems/AnimationSystem.js

export default class AnimationSystem {
  constructor(scene) {
    this.scene = scene;
  }

  /**
   * Gagawa ng mga walking animations para sa Player at mga kawangis nitong Human Sprites
   * @param {string} textureKey - Ang key ng spritesheet (e.g., 'player')
   */
  createCharacterAnimations(textureKey) {
    // I-check muna kung umiiral na para maiwasan ang Phaser warnings sa tuwing nagpapalit ng mapa
    if (!this.scene.anims.exists(`${textureKey}-walk-down`)) {
      
      this.scene.anims.create({
        key: `${textureKey}-walk-down`,
        frames: this.scene.anims.generateFrameNumbers(textureKey, { start: 0, end: 3 }),
        frameRate: 8,
        repeat: -1
      });

      this.scene.anims.create({
        key: `${textureKey}-walk-left`,
        frames: this.scene.anims.generateFrameNumbers(textureKey, { start: 4, end: 7 }),
        frameRate: 8,
        repeat: -1
      });

      this.scene.anims.create({
        key: `${textureKey}-walk-right`,
        frames: this.scene.anims.generateFrameNumbers(textureKey, { start: 8, end: 11 }),
        frameRate: 8,
        repeat: -1
      });

      this.scene.anims.create({
        key: `${textureKey}-walk-up`,
        frames: this.scene.anims.generateFrameNumbers(textureKey, { start: 12, end: 15 }),
        frameRate: 8,
        repeat: -1
      });
      
    }
  }
}