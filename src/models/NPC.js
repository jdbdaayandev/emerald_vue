// src/models/NPC.js

export default class NPC {
  constructor(id, name, dialogId) {
    this.id = id;
    this.name = name;
    this.dialogId = dialogId; // Matches a key in src/data/dialog.json
    this.hasSpokenTo = false; // Example of tracking state
  }
}