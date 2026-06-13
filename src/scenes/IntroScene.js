// src/scenes/IntroScene.js
import { Scene } from 'phaser';
import { EventBus, EVENTS } from '../core/events/EventBus.js';

export default class IntroScene extends Scene {
  constructor() {
    super('IntroScene');
  }

  create() {
    const cx = this.cameras.main.width / 2;
    const cy = this.cameras.main.height / 2;

    // 1. Background Gradient (Emerald Sky)
    const bg = this.add.graphics();
    // Light teal sa taas, papuntang dark emerald green sa baba
    bg.fillGradientStyle(0x38908f, 0x38908f, 0x0a4a3b, 0x0a4a3b, 1);
    bg.fillRect(0, 0, this.cameras.main.width, this.cameras.main.height);

    // 2. Dummy Silhouette (Gagawin nating parang shadow ni Rayquaza sa likod)
    const silhouette = this.add.graphics();
    silhouette.fillStyle(0x073026, 0.8);
    silhouette.fillCircle(cx, cy + 50, 200);

    // 3. Scrolling Clouds (Para kuhang-kuha ang GBA opening)
    this.createClouds();

    // 4. "POKEMON" Logo (Classic Yellow with Blue Stroke)
    this.add.text(cx, cy - 100, 'POKEMON', {
      fontFamily: '"Arial Black", Impact, sans-serif',
      fontSize: '90px',
      fontStyle: 'italic',
      color: '#ffcb05',       // Official Pokemon Yellow
      stroke: '#3466af',      // Official Pokemon Blue
      strokeThickness: 20,
      shadow: { offsetX: 4, offsetY: 4, color: '#000000', fill: true, blur: 5 }
    }).setOrigin(0.5);

    // 5. "VUE VERSION" (Classic White with Black Stroke)
    this.add.text(cx, cy - 10, 'VUE VERSION', {
      fontFamily: '"Arial Black", Impact, sans-serif',
      fontSize: '48px',
      color: '#ffffff',       // White text
      stroke: '#000000',      // Thick black border
      strokeThickness: 12
    }).setOrigin(0.5);

    // 6. Blinking "PRESS ENTER" (Nasa ilalim tulad ng sa GBA)
    this.startText = this.add.text(cx, cy + 130, 'PRESS ENTER', {
      fontFamily: '"Courier New", monospace',
      fontSize: '24px',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 4
    }).setOrigin(0.5);

    this.tweens.add({
      targets: this.startText,
      alpha: 0,
      duration: 600,
      ease: 'Linear',
      yoyo: true,
      repeat: -1
    });

    // 7. Copyright Text (Pinakababa)
    this.add.text(cx, this.cameras.main.height - 30, '© 2026 JDBD GAMES inc.', {
      fontFamily: '"Courier New", monospace',
      fontSize: '16px',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 2
    }).setOrigin(0.5);

    // Listen for input
    this.input.keyboard.once('keydown-ENTER', this.startGame, this);
    this.input.keyboard.once('keydown-SPACE', this.startGame, this);
  }

  // Helper function para gumawa ng lumulutang na ulap
  createClouds() {
    for (let i = 0; i < 4; i++) {
      // Gumawa ng puting rectangle na semi-transparent
      let cloud = this.add.rectangle(
        Math.random() * 800,  // Random Start X
        50 + (i * 120),       // Iba-ibang Y height
        Math.random() * 200 + 100, // Random Width
        30,                   // Height
        0xffffff, 
        0.2                   // Opacity (20% lang para mukhang ulap)
      );

      // Tween para umandar pakaliwa ang ulap nang paulit-ulit
      this.tweens.add({
        targets: cloud,
        x: '-=800',           // Move 800 pixels sa kaliwa
        duration: Math.random() * 5000 + 10000, // 10 to 15 seconds
        repeat: -1,
        onRepeat: () => {
          cloud.x = 850;      // Pag-ulit, ibalik sa kanang dulo
        }
      });
    }
  }

  startGame() {
    this.cameras.main.flash(500, 255, 255, 255);
    this.startText.setVisible(false);
    
    this.time.delayedCall(500, () => {
      EventBus.emit(EVENTS.OPEN_MENU, { menuId: 'startMenu' });
    });
  }
}