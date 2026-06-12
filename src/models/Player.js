// src/models/Player.js

export default class Player {
  constructor(name = 'Ash') {
    this.name = name;
    this.money = 3000;
    this.badges = 0;
    this.party = []; // Array of Pokemon class instances
    this.inventory = {
      items: [],
      keyItems: [],
      pokeballs: []
    };
  }

  addMoney(amount) {
    this.money += amount;
  }

  addPokemon(pokemon) {
    if (this.party.length < 6) {
      this.party.push(pokemon);
    } else {
      console.log('Party is full! Sent to PC.');
    }
  }
}