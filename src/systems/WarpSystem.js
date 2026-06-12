// src/systems/WarpSystem.js

export default class WarpSystem {
  constructor(scene, map, playerSprite) {
    this.scene = scene;
    
    // Create an invisible physics group for all warp zones
    this.warpZones = this.scene.physics.add.staticGroup();

    // Parse the Tiled map for the "Warps" layer
    const warpLayer = map.getObjectLayer('Warps');
    if (warpLayer) {
      warpLayer.objects.forEach(warpObj => {
        // Create an invisible zone based on the Tiled rectangle
        const zone = this.warpZones.create(warpObj.x, warpObj.y, null);
        zone.setOrigin(0, 1); // Adjust based on Tiled's coordinate system
        zone.setSize(warpObj.width, warpObj.height);
        zone.visible = false;
        
        // Attach the target data to the zone
        const props = this.parseTiledProperties(warpObj.properties);
        zone.targetMap = props.targetMap;
        zone.targetX = props.targetX;
        zone.targetY = props.targetY;
      });
    }

    // Tell Phaser to check if the player steps into any of these zones
    this.scene.physics.add.overlap(
      playerSprite, 
      this.warpZones, 
      this.handleWarp, 
      null, 
      this
    );
  }

  handleWarp(player, zone) {
    // Prevent multiple warps from triggering at once
    if (this.isWarping) return;
    this.isWarping = true;

    // Optional: Add a fade-to-black camera effect here!
    this.scene.cameras.main.fadeOut(250, 0, 0, 0);
    
    this.scene.cameras.main.once('camerafadeoutcomplete', () => {
      // 🚀 THE MAGIC: Restart the scene, passing in the new map from the Registry!
      this.scene.scene.restart({
        mapKey: zone.targetMap,
        spawnX: zone.targetX,
        spawnY: zone.targetY
      });
    });
  }

  parseTiledProperties(properties = []) {
    const parsed = {};
    properties.forEach(prop => parsed[prop.name] = prop.value);
    return parsed;
  }
}