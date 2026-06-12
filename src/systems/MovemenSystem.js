// src/systems/MovementSystem.js

export default class MovementSystem {
  /**
   * @param {Phaser.Scene} scene - The active Phaser scene
   * @param {Phaser.GameObjects.Sprite} sprite - The player's sprite
   */
  constructor(scene, sprite) {
    this.scene = scene;
    this.sprite = sprite;
    
    this.tileSize = 32; // Change this if your Tiled grid is 16x16
    this.speed = 200;   // Milliseconds it takes to walk one tile
    
    this.isMoving = false;
    
    // Setup keyboard listeners
    this.cursors = this.scene.input.keyboard.createCursorKeys();
  }

  update() {
    // If we are currently moving between tiles, do not accept new input
    if (this.isMoving) return;

    if (this.cursors.left.isDown) {
      this.movePlayer('left');
    } else if (this.cursors.right.isDown) {
      this.movePlayer('right');
    } else if (this.cursors.up.isDown) {
      this.movePlayer('up');
    } else if (this.cursors.down.isDown) {
      this.movePlayer('down');
    }
  }

  movePlayer(direction) {
    let targetX = this.sprite.x;
    let targetY = this.sprite.y;

    // Determine the destination pixel coordinates
    if (direction === 'left') targetX -= this.tileSize;
    if (direction === 'right') targetX += this.tileSize;
    if (direction === 'up') targetY -= this.tileSize;
    if (direction === 'down') targetY += this.tileSize;

    // TODO: Before moving, check if the targetX and targetY hit a wall tile here!

    // Lock input
    this.isMoving = true;

    // Play walking animation here (e.g., this.sprite.anims.play(`walk-${direction}`))

    // Use a Tween to smoothly slide the sprite to the new tile
    this.scene.tweens.add({
      targets: this.sprite,
      x: targetX,
      y: targetY,
      duration: this.speed,
      onComplete: () => {
        // Unlock input when the movement finishes
        this.isMoving = false;
        
        // Stop animation here (e.g., this.sprite.anims.stop())
      }
    });
  }
}