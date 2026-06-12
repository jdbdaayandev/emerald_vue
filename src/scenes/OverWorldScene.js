import { Scene } from 'phaser';
import mapRegistry from '../data/maps.json';
import MovementSystem from '../systems/MovementSystem.js';
import WarpSystem from '../systems/WarpSystem.js';

export default class OverworldScene extends Scene {
  constructor() {
    super('OverworldScene');
  }

  // 1. Receive the target map data when the scene starts
  init(data) {
    // Default to pallet_town if no data is passed (e.g., when the game first boots)
    this.currentMapKey = data.mapKey || 'pallet_town';
    this.mapConfig = mapRegistry[this.currentMapKey];
    
    // Default spawn coordinates (overridden if stepping through a door)
    this.spawnX = data.spawnX || 160;
    this.spawnY = data.spawnY || 160;
  }

  preload() {
    // 2. Dynamically load the assets for THIS map only
    this.load.tilemapTiledJSON(this.currentMapKey, this.mapConfig.mapAsset);
    this.load.image(this.mapConfig.tilesetNameInTiled, this.mapConfig.tilesetAsset);
  }

  create() {
    // 3. Draw the specific map requested
    const map = this.make.tilemap({ key: this.currentMapKey });
    const tileset = map.addTilesetImage(this.mapConfig.tilesetNameInTiled);
    map.createLayer('Ground', tileset, 0, 0);

    // 4. Spawn Player at the dynamic coordinates
    this.playerSprite = this.physics.add.sprite(this.spawnX, this.spawnY, 'player_sprite');
    this.movementSystem = new MovementSystem(this, this.playerSprite);

    // 5. Initialize the Warp System to look for doors
    this.warpSystem = new WarpSystem(this, map, this.playerSprite);
  }

  update() {
    this.movementSystem.update();
  }
}