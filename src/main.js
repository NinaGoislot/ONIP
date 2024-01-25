import 'phaser';
import MenuScene from './scenes/MenuScene';
import GameScene from './scenes/GameScene';
import EndScene from './scenes/EndScene';
import CabinetScene from './scenes/CabinetScene';
import LoadDataScene from './scenes/LoadDataScene';

const VALUES = {
  width: window.innerWidth,
  height: window.innerHeight,
  speedDown: 300,
};

//Création de la gestion des évènements du jeu
const eventHandler = new Phaser.Events.EventEmitter();

const config = {
  type: Phaser.AUTO,
  width: VALUES.width,
  height: VALUES.height,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: VALUES.speedDown },
      debug: true,
    },
  },
  scene: [LoadDataScene, MenuScene, GameScene, EndScene, CabinetScene], // Ajouter toutes les scènes ici
};

const game = new Phaser.Game(config);
