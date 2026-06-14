// src/scenes/OverworldScene.js
import Phaser, { Scene } from 'phaser';
import mapRegistry from '../data/maps.json';
import npcRegistry from '../data/npcs.json';
import MovementSystem from '../systems/MovementSystem.js';
import AnimationSystem from '../systems/AnimationSystem.js'; 
import { GameState } from '../core/GameState.js';
import NPCSystem from '../systems/NPCSystem.js';
import { EventBus, EVENTS } from '../core/events/EventBus.js';

// 👇 1. I-IMPORT ANG BAGONG CUTSCENE FUNCTION 👇
import { playMomIntro } from '../core/events/MomIntroEvent.js'; 

export default class OverworldScene extends Scene {
  constructor() {
    super('OverworldScene');
  }

  init(data) {
    this.currentMapKey = data.mapKey || GameState.player.location.map;
    this.mapConfig = mapRegistry[this.currentMapKey];
    
    this.spawnX = data.spawnX || GameState.player.location.x;
    this.spawnY = data.spawnY || GameState.player.location.y;
  }

  preload() {
    this.load.tilemapTiledJSON(this.currentMapKey, this.mapConfig.mapAsset);
    this.load.image(this.mapConfig.tilesetNameInTiled, this.mapConfig.tilesetAsset);
  }

  create() {
    const map = this.make.tilemap({ key: this.currentMapKey });
    const tileset = map.addTilesetImage(this.mapConfig.tilesetNameInTiled, this.mapConfig.tilesetNameInTiled);
    
    const groundLayer = map.createLayer('Ground', tileset, 0, 0);
    const objectLayer = map.createLayer('Object', tileset, 0, 0);
    const collisionLayer = map.createLayer('Collission', tileset, 0, 0);
    
    const debugGraphics = this.add.graphics().setAlpha(0.75); 
    collisionLayer.renderDebug(debugGraphics, {
      tileColor: null, 
      collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), 
      faceColor: new Phaser.Display.Color(40, 39, 37, 255) 
    });

    if (collisionLayer) collisionLayer.setVisible(false);

    const playerSnapX = Math.floor(this.spawnX / 16) * 16 + 8;
    const playerSnapY = Math.floor(this.spawnY / 16) * 16 + 8;
    this.playerSprite = this.physics.add.sprite(playerSnapX, playerSnapY, 'player');
    
    this.playerSprite.setOrigin(0.5, 0.75);
    this.playerSprite.body.customSize = true;
    this.playerSprite.body.setSize(16, 16, false);
    this.playerSprite.body.setOffset(8, 16); 

    this.animationSystem = new AnimationSystem(this);
    this.animationSystem.createCharacterAnimations('player');
    this.animationSystem.createCharacterAnimations('npc_1');
    this.animationSystem.createCharacterAnimations('mom');
    this.playerSprite.setFrame(0);

    this.npcSystem = new NPCSystem(this);
    this.npcSystem.spawnNPCs(map, collisionLayer);

    const overheadLayer = map.createLayer('Overhead', tileset, 0, 0);
    if (overheadLayer) overheadLayer.setDepth(10); 

    this.movementSystem = new MovementSystem(this, this.playerSprite, collisionLayer);
    this.cameras.main.startFollow(this.playerSprite);
    this.cameras.main.setZoom(2);

    // 🎬 👇 2. TAWAGIN ANG CUTSCENE SA ISANG LINYA LANG! 👇 🎬
    playMomIntro(this);
  }

  update() {
    this.movementSystem.update();
    
    if (this.playerSprite && this.playerSprite.body) {
      this.playerSprite.body.setSize(16, 16, false);
      this.playerSprite.body.setOffset(8, 16); 
    }
  }
}