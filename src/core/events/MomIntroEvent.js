// src/core/events/MomIntroEvent.js
import { EventBus, EVENTS } from './EventBus.js';
import npcRegistry from '../../data/npcs.json';
import { GameState } from '../GameState.js'; // 👈 1. I-IMPORT ANG GAMESTATE

export function playMomIntro(scene) {
  // 👈 2. CHECK FLAG: Kung tapos na ang eksena, wag nang ituloy!
  if (GameState.storyFlags && GameState.storyFlags.momIntroFinished) {
    return; 
  }

  if (scene.movementSystem) {
    scene.movementSystem.isMoving = true;
  }

  const onDialogEnded = () => {
    EventBus.off(EVENTS.DIALOG_ENDED, onDialogEnded);

    const returnSteps = ['right', 'right', 'right', 'right', 'right', 'up'];
    
    scene.npcSystem.executeMoveRoute('mom', returnSteps, (momSprite) => {
      
      // 💥 NUCLEAR OPTION: Burahin nang tuluyan si Mom sa mapa!
      // Tatanggalin nito ang sprite, ang animation, at ang makulit na purple square.
      momSprite.destroy(); 
      
      // Palayain na si Ash!
      if (scene.movementSystem) {
        scene.movementSystem.isMoving = false;
      }

      // I-save ang Story Flag
      if (!GameState.storyFlags) GameState.storyFlags = {};
      GameState.storyFlags.momIntroFinished = true;
    });
  };

  EventBus.on(EVENTS.DIALOG_ENDED, onDialogEnded);

  scene.time.delayedCall(1000, () => {
    const momSteps = ['left', 'left', 'left', 'left', 'left']; 

    scene.npcSystem.executeMoveRoute('mom', momSteps, (momSprite) => {
      if (scene.movementSystem) {
        scene.movementSystem.currentDirection = 'right'; 
        scene.playerSprite.stop(); 
        scene.playerSprite.setFrame(8); 
      }

      EventBus.emit(EVENTS.DIALOG_TRIGGERED, { 
        dialogId: momSprite.dialogId, 
        speaker: 'Mom' 
      });
    });
  });
}