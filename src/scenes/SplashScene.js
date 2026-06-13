// src/scenes/SplashScene.js
import { Scene } from 'phaser';

export default class SplashScene extends Scene {
  constructor() {
    super('SplashScene');
  }

  create() {
    this.cameras.main.setBackgroundColor('#000000');
    
    const cx = this.cameras.main.width / 2;
    const cy = this.cameras.main.height / 2;
    const baseFont = { fontFamily: '"Courier New", monospace', color: '#ffffff', align: 'center' };

    // 1. Create the text objects (opacity set to 0 so they are invisible)
    this.copyrightText = this.add.text(cx, cy, '© 2026 POKEMON\n© 1995-2026 NINTENDO\nCREATURES INC.\nGAME FREAK INC.', { ...baseFont, fontSize: '24px' }).setOrigin(0.5).setAlpha(0);
    
    this.jdbdText = this.add.text(cx, cy, 'JDBD GAMES\nPRESENTS', { ...baseFont, fontSize: '32px', color: '#48c870' }).setOrigin(0.5).setAlpha(0);
    
    this.gameFreakText = this.add.text(cx, cy, 'GAME FREAK', { ...baseFont, fontSize: '36px' }).setOrigin(0.5).setAlpha(0);

    // 2. Run the sequence
    this.playSequence();
  }

  async playSequence() {
    // Wait 1 second before starting
    await this.delay(1000); 

    await this.fadeText(this.copyrightText);
    await this.fadeText(this.jdbdText);
    await this.fadeText(this.gameFreakText);

    // Sequence complete, jump to Title Screen!
    this.scene.start('IntroScene');
  }

  // --- Helper Methods to make the sequence readable ---

  delay(ms) {
    return new Promise(resolve => this.time.delayedCall(ms, resolve));
  }

  fadeText(textObject) {
    return new Promise(resolve => {
      this.tweens.add({
        targets: textObject,
        alpha: 1,       // Fade to fully visible
        duration: 800,  // Takes 0.8 seconds to fade in
        hold: 1500,     // Stays on screen for 1.5 seconds
        yoyo: true,     // Fades back out automatically
        onComplete: () => {
          // Wait 500ms of black screen before showing the next logo
          this.time.delayedCall(500, resolve);
        }
      });
    });
  }
}