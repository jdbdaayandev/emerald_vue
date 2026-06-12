// src/systems/NPCSystem.js
import { useGameStore } from '../store/useGameStore.js';

export default class NPCSystem {
  constructor(scene) {
    this.scene = scene;
    this.npcSprites = this.scene.physics.add.staticGroup(); 
    this.gameStore = useGameStore(); // Connect to global memory
  }

  spawnNPCs(map) {
    const npcLayer = map.getObjectLayer('NPCs');
    if (!npcLayer) return;

    npcLayer.objects.forEach(npcObj => {
      const props = this.parseTiledProperties(npcObj.properties);
      
      // OPTIONAL: Check if this NPC should even exist anymore!
      // Example: If Tiled says "hideIf=oak_gave_pokedex"
      if (props.hideIf && this.gameStore.getNpcFlag(props.hideIf)) {
        return; // Skip spawning this NPC entirely!
      }

      // Spawn the Sprite
      const sprite = this.npcSprites.create(npcObj.x, npcObj.y, props.spriteKey);
      sprite.npcId = props.id;
      sprite.dialogId = props.dialogId;
    });
  }
}