// src/scenes/BootScene.js
import { Scene } from 'phaser';

export default class BootScene extends Scene {
  constructor() {
    super('BootScene');
  }

  preload() {
    // 1. Setup the Loading Bar Graphics
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    
    const progressBar = this.add.graphics();
    const progressBox = this.add.graphics();
    
    // Draw a grey box for the outline
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(width / 2 - 160, height / 2 - 25, 320, 50);

    // Add some classic retro text
    const loadingText = this.make.text({
      x: width / 2,
      y: height / 2 - 50,
      text: 'Loading...',
      style: { font: '20px monospace', fill: '#ffffff' }
    }).setOrigin(0.5, 0.5);

    // 2. Listen to Phaser's internal loading events
    this.load.on('progress', (value) => {
      // Phaser gives us a value between 0 and 1
      progressBar.clear();
      progressBar.fillStyle(0xffffff, 1); // White filling
      progressBar.fillRect(width / 2 - 150, height / 2 - 15, 300 * value, 30);
    });

    this.load.on('complete', () => {
      // Clean up the loading bar graphics
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
    });

    // 3. LOAD YOUR ASSETS HERE
    // this.load.image('player_sprite', '/assets/images/player.png');
    this.load.spritesheet('player', '/assets/sprites/player/player_male.png', {
      frameWidth: 32,
      frameHeight: 32
    });

    this.load.spritesheet('npc_1', '/assets/sprites/npc/npc_1.png', {
      frameWidth: 16,
      frameHeight: 32
    });

    this.load.spritesheet('mom', '/assets/sprites/npc/npc_2.png', {
      frameWidth: 16,
      frameHeight: 32
    });
    // this.load.audio('bgm', '/assets/audio/pallet_town.mp3');
    // (Imagine 100 more files loading here)
  }

  create() {
    // The moment the 'complete' event fires, jump to the Overworld!
    this.scene.start('SplashScene');
  }
}