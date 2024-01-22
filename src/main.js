import 'phaser';
import MenuScene from './scenes/MenuScene';
import GameScene from './scenes/GameScene';
import EndScene from './scenes/EndScene';
import CabinetScene from './scenes/CabinetScene';

const VALUES = {
  width: window.innerWidth,
  height: window.innerHeight,
  speedDown: 300,
};

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
  scene: [MenuScene, GameScene, EndScene, CabinetScene], // Ajouter toutes les scènes ici
};

const game = new Phaser.Game(config);
