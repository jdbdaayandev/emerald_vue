// src/systems/MovementSystem.js
import Phaser from 'phaser';
import { CONTROL_MAP } from '../core/Keybindings.js'; 

export default class MovementSystem {
  constructor(scene, sprite, collisionLayer) {
    this.scene = scene;
    this.sprite = sprite;
    this.collisionLayer = collisionLayer; 
    
    this.tileSize = 16; 
    this.speed = 160;   
    this.isMoving = false;
    this.currentDirection = 'down'; 
    this.keyboard = this.scene.input.keyboard;
  }

  isButtonDown(buttonName) {
    const assignedKeys = CONTROL_MAP[buttonName];
    if (!assignedKeys) return false;

    return assignedKeys.some(keyStr => {
      let phaserKeyName = keyStr.toUpperCase();
      if (phaserKeyName === 'ARROWUP') phaserKeyName = 'UP';
      if (phaserKeyName === 'ARROWDOWN') phaserKeyName = 'DOWN';
      if (phaserKeyName === 'ARROWLEFT') phaserKeyName = 'LEFT';
      if (phaserKeyName === 'ARROWRIGHT') phaserKeyName = 'RIGHT';

      try {
        const phaserKey = this.keyboard.addKey(phaserKeyName);
        return phaserKey.isDown;
      } catch (e) {
        return false;
      }
    });
  }

  update() {
    if (this.isMoving) return;

    if (this.isButtonDown('A')) {
      if (!this.spacePressed) {
        this.spacePressed = true;
        this.interact(); 
        
        // Cooldown para hindi mag-doble-doble ang kausap
        this.scene.time.delayedCall(500, () => { this.spacePressed = false; });
      }
      return; 
    }

    if (this.isButtonDown('LEFT')) {
      this.movePlayer('left');
    } else if (this.isButtonDown('RIGHT')) {
      this.movePlayer('right');
    } else if (this.isButtonDown('UP')) {
      this.movePlayer('up');
    } else if (this.isButtonDown('DOWN')) {
      this.movePlayer('down');
    } else {
      if (this.sprite && typeof this.sprite.stop === 'function') {
        this.sprite.stop();
      }
    }
  }

  movePlayer(direction) {
    // 1. TURN IN PLACE MECHANIC
    if (this.currentDirection !== direction) {
      this.currentDirection = direction; 
      
      if (this.sprite && typeof this.sprite.setFrame === 'function') {
        this.sprite.stop();
        if (direction === 'down') this.sprite.setFrame(0);
        if (direction === 'left') this.sprite.setFrame(4);
        if (direction === 'right') this.sprite.setFrame(8);
        if (direction === 'up') this.sprite.setFrame(12);
      }

      this.isMoving = true;
      this.scene.time.delayedCall(100, () => {
        this.isMoving = false;
      });
      return; 
    }

    // 2. KUKUNIN ANG TARGET POSITION
    let targetX = this.sprite.x;
    let targetY = this.sprite.y;

    if (direction === 'left') targetX -= this.tileSize;
    if (direction === 'right') targetX += this.tileSize;
    if (direction === 'up') targetY -= this.tileSize;
    if (direction === 'down') targetY += this.tileSize;

    // 3. COLLISION CHECK PADER (Look-Ahead Radar para sa Tiles)
    if (this.collisionLayer) {
      const targetTile = this.collisionLayer.getTileAtWorldXY(targetX, targetY, true);
      
      if (targetTile && targetTile.index !== -1) {
        this.isMoving = true;
        
        if (this.sprite && typeof this.sprite.play === 'function') {
          this.sprite.play(`player-walk-${direction}`, true);
        }
        
        this.scene.time.delayedCall(this.speed, () => {
          this.isMoving = false;
          this.checkIdleFrame(direction);
        });
        
        return; 
      }
    }

    // 👇 3.5. BAGONG RADAR: COLLISION CHECK PARA SA NPC AT SIGNPOSTS 👇
    const hitBodies = this.scene.physics.overlapRect(targetX - 7, targetY - 7, 14, 14);
    const isNpcInWay = hitBodies.some(body => body.gameObject !== this.sprite);

    if (isNpcInWay) {
      // Parehong bumping animation kapag nakabangga ng pader!
      this.isMoving = true;
      
      if (this.sprite && typeof this.sprite.play === 'function') {
        this.sprite.play(`player-walk-${direction}`, true);
      }
      
      this.scene.time.delayedCall(this.speed, () => {
        this.isMoving = false;
        this.checkIdleFrame(direction);
      });
      
      return; // PUMIGIL DITO PARA HINDI TUMAGOS KAY MOM!
    }
    // 👆 END NG NPC RADAR 👆

    // 4. KUNG WALANG BUMPING, TULOY ANG NORMAL NA LAKAD
    this.isMoving = true;

    if (this.sprite && typeof this.sprite.play === 'function') {
      this.sprite.play(`player-walk-${direction}`, true);
    }

    this.scene.tweens.add({
      targets: this.sprite,
      x: targetX,
      y: targetY,
      duration: this.speed,
      onComplete: () => {
        this.isMoving = false;
        this.checkIdleFrame(direction);
      }
    });
  }

  // 👇 IDUGTONG ITO SA ILALIM NG movePlayer 👇
  interact() {
    // 1. Alamin kung aling tile ang nasa TAPAT ni Ash
    let targetX = this.sprite.x;
    let targetY = this.sprite.y;

    if (this.currentDirection === 'left') targetX -= this.tileSize;
    if (this.currentDirection === 'right') targetX += this.tileSize;
    if (this.currentDirection === 'up') targetY -= this.tileSize;
    if (this.currentDirection === 'down') targetY += this.tileSize;

    // 2. Silipin gamit ang radar kung may NPC doon
    const hitBodies = this.scene.physics.overlapRect(targetX - 7, targetY - 7, 14, 14);
    
    // Hanapin ang unang natamaan na HINDI si Ash at MAY dialogId
    const npcBody = hitBodies.find(body => body.gameObject !== this.sprite && body.gameObject.dialogId);

    if (npcBody) {
      const npc = npcBody.gameObject;
      
      // 3. Paharapin si NPC sa kung nasaan si Ash!
      let oppositeDirection = 'down';
      if (this.currentDirection === 'up') oppositeDirection = 'down';
      if (this.currentDirection === 'down') oppositeDirection = 'up';
      if (this.currentDirection === 'left') oppositeDirection = 'right';
      if (this.currentDirection === 'right') oppositeDirection = 'left';
      
      // I-update ang frame ng NPC para tumingin sa'yo
      if (this.scene.npcSystem) {
        // Kunin muli ang config gamit ang npcId niya para makuha ang frames
        const config = require('../data/npcs.json')[npc.npcId];
        this.scene.npcSystem.faceDirection(npc, oppositeDirection, config);
      }

      // 4. TAWAGIN ANG DIALOGUE SYSTEM MO DITO!
      console.log(`💬 Kakausapin si: ${npc.npcId} | Babasahin ang: ${npc.dialogId}`);
      
      // Kung may nagawa ka nang dialogue box / UI, dito mo ipapasa ang npc.dialogId
      // Halimbawa: this.scene.events.emit('SHOW_DIALOGUE', npc.dialogId);
    }
  }

  checkIdleFrame(direction) {
    this.scene.time.delayedCall(10, () => {
      if (!this.isMoving && this.sprite && typeof this.sprite.stop === 'function') {
        this.sprite.stop(); 
        
        if (direction === 'down') this.sprite.setFrame(0);
        if (direction === 'left') this.sprite.setFrame(4);
        if (direction === 'right') this.sprite.setFrame(8);
        if (direction === 'up') this.sprite.setFrame(12);
      }
    });
  }
}