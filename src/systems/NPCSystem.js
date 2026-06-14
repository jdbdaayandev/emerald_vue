// src/systems/NPCSystem.js
import { useGameStore } from '../store/useGameStore.js';
import npcRegistry from '../data/npcs.json'; 
import Phaser from 'phaser';

export default class NPCSystem {
  constructor(scene) {
    this.scene = scene;
    this.npcSprites = this.scene.physics.add.staticGroup(); 
    this.gameStore = useGameStore(); 
    this.wanderingNPCs = [];
    this.npcMap = {};
  }

  spawnNPCs(map, collisionLayer) {
    const npcLayer = map.getObjectLayer('NPCs');
    if (!npcLayer) return;

    npcLayer.objects.forEach(npcObj => {
      const props = this.parseTiledProperties(npcObj.properties);
      const npcId = props.id || npcObj.name; 

      const config = npcRegistry[npcId];
      if (!config) return; 

      if (props.hideIf && this.gameStore.getNpcFlag(props.hideIf)) {
        return; 
      }

      if (config.movementType === 'wander') {
        // 🏃‍♂️ PARA SA WANDERING NPC (PINK BOX)
        const snapX = Math.floor(npcObj.x / 16) * 16 + 8;
        const snapY = Math.floor(npcObj.y / 16) * 16 + 8;

        const sprite = this.scene.physics.add.sprite(snapX, snapY, config.spriteKey);
        
        // 👇 PERFECT MATH PARA SA WANDERING NPC 👇
        sprite.setOrigin(0.5, 0.75);
        sprite.body.customSize = true; 
        sprite.body.setSize(16, 16, false);
        sprite.body.setOffset(0, 16); 

        this.faceDirection(sprite, 'down', config);
        
        sprite.npcId = npcId;
        sprite.dialogId = config.dialogId;
        
        this.scene.physics.add.collider(this.scene.playerSprite, sprite);

        this.setupWanderingLogic(sprite, collisionLayer, config);
        this.wanderingNPCs.push(sprite);

      } else {
        // 🧘‍♂️ PARA SA STATIC NPC GAYA NI MOM
        const snapX = Math.floor(npcObj.x / 16) * 16 + 8;
        const snapY = Math.floor(npcObj.y / 16) * 16 + 8;

        const sprite = this.scene.physics.add.sprite(snapX, snapY, config.spriteKey);
        
        sprite.setOrigin(0.5, 0.75); 
        sprite.body.customSize = true;
        sprite.body.setSize(16, 16, false);

        // 👇 ANG FIX: Gawing 0 ang X offset dahil 16px lang ang lapad ng sprite niya! 👇
        sprite.body.setOffset(0, 16); 

        // I-freeze para hindi matulak
        sprite.setImmovable(true); 
        sprite.body.moves = false; 

        sprite.npcId = npcId;
        sprite.dialogId = config.dialogId;
        
        this.scene.physics.add.collider(this.scene.playerSprite, sprite);

        const initialDirection = props.direction || config.direction || 'down';
        this.faceDirection(sprite, initialDirection, config);
        this.npcMap[npcId] = sprite;
      }
    }
  );
  } 

  setupWanderingLogic(sprite, collisionLayer, config) {
    const speed = config.speed || 250;

    const loopWander = () => {
      if (!sprite.active || sprite.isMoving) return;

      if (Phaser.Math.Between(0, 1) === 0) {
        this.scene.time.delayedCall(Phaser.Math.Between(2000, 4000), loopWander);
        return;
      }

      const directions = ['left', 'right', 'up', 'down'];
      const chosenDirection = Phaser.Utils.Array.GetRandom(directions);

      let targetX = sprite.x;
      let targetY = sprite.y;
      const tileSize = 16;

      if (chosenDirection === 'left') targetX -= tileSize;
      if (chosenDirection === 'right') targetX += tileSize;
      if (chosenDirection === 'up') targetY -= tileSize;
      if (chosenDirection === 'down') targetY += tileSize;

      if (collisionLayer) {
        const targetTile = collisionLayer.getTileAtWorldXY(targetX, targetY, true);
        if (targetTile && targetTile.index !== -1) {
          this.faceDirection(sprite, chosenDirection, config);
          this.scene.time.delayedCall(Phaser.Math.Between(2000, 4000), loopWander);
          return; 
        }
      }

      sprite.isMoving = true;
      
      // 👇 1. I-PLAY ANG ANIMATION BAGO MAG-TWEEN 👇
      const animKey = `${config.spriteKey}-walk-${chosenDirection}`;
      
      // I-check muna kung ginawa mo na ang animation para hindi mag-error
      if (this.scene.anims.exists(animKey)) {
        sprite.play(animKey, true);
      } else {
        // Kung walang animation, face direction na lang (fallback)
        this.faceDirection(sprite, chosenDirection, config);
      }

      this.scene.tweens.add({
        targets: sprite,
        x: targetX,
        y: targetY,
        duration: speed, 
        onComplete: () => {
          sprite.isMoving = false;
          
          // 👇 2. PATIGILIN ANG ANIMATION AT I-SET SA IDLE FRAME 👇
          sprite.stop();
          this.faceDirection(sprite, chosenDirection, config);
          
          this.scene.time.delayedCall(Phaser.Math.Between(2000, 4000), loopWander);
        }
      });
    }; // 👈 IBINALIK ANG NAWALANG CLOSING BRACE NG loopWander

    // 👈 IBINALIK ANG INITIAL CALL PARA MAG-UMPISA ANG PAGLALAKAD
    this.scene.time.delayedCall(Phaser.Math.Between(2000, 4000), loopWander);
  } // 👈 IBINALIK ANG NAWALANG CLOSING BRACE NG setupWanderingLogic

  faceDirection(sprite, direction, config) {
    if (config && config.frames && config.frames[direction] !== undefined) {
      sprite.setFrame(config.frames[direction]);
    }
  }

  parseTiledProperties(propertiesArray) {
    if (!propertiesArray) return {};
    const props = {};
    propertiesArray.forEach(p => { props[p.name] = p.value; });
    return props;
  }

  // 👇 IDUGTONG ITO SA ILALIM NG NPCSystem.js 👇
  executeMoveRoute(npcId, route, onComplete) {
    const npc = this.npcMap[npcId];
    if (!npc) return;
    
    const config = npcRegistry[npcId];
    let stepIndex = 0;

    const nextStep = () => {
      // Kapag tapos na ang lahat ng hakbang, patakbuhin ang onComplete
      if (stepIndex >= route.length) {
        if (onComplete) onComplete(npc);
        return;
      }

      const dir = route[stepIndex];
      stepIndex++;

      let targetX = npc.x;
      let targetY = npc.y;
      if (dir === 'left') targetX -= 16;
      if (dir === 'right') targetX += 16;
      if (dir === 'up') targetY -= 16;
      if (dir === 'down') targetY += 16;

      npc.isMoving = true;
      
      // I-play ang animation ng NPC
      const animKey = `${config.spriteKey}-walk-${dir}`;
      if (this.scene.anims.exists(animKey)) {
        npc.play(animKey, true);
      } else {
        this.faceDirection(npc, dir, config);
      }

      // Ilakad ang NPC sa susunod na tile
      this.scene.tweens.add({
        targets: npc,
        x: targetX,
        y: targetY,
        duration: 250, // Bilis ng lakad ni Mom
        onComplete: () => {
          npc.isMoving = false;
          if (npc.stop) npc.stop();
          this.faceDirection(npc, dir, config);
          nextStep(); // Ulitin para sa susunod na hakbang!
        }
      });
    };

    nextStep(); // Simulan ang unang hakbang
  }
}