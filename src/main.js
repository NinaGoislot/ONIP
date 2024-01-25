import 'phaser';
import MenuScene from './scenes/MenuScene';
import GameScene from './scenes/GameScene';
import EndScene from './scenes/EndScene';
import CabinetScene from './scenes/CabinetScene';
import LoadDataScene from './scenes/LoadDataScene';

const VALUES = {
  width: 1920,
  height: 1080,
  speedDown: 300,
};

//Création de la gestion des évènements du jeu
const eventHandler = new Phaser.Events.EventEmitter();

const config = {
  type: Phaser.AUTO,
  scale: {
    // mode: Phaser.Scale.RESIZE,
    // autoCenter: Phaser.Scale.CENTER_BOTH,
    parent: "parentDiv",
    width: VALUES.width,
    height: VALUES.height
  },
  // width: VALUES.width,
  // height: VALUES.height,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: VALUES.speedDown },
      debug: true,
    },
  },
  scene: [LoadDataScene, MenuScene, GameScene, EndScene, CabinetScene], // Ajouter toutes les scènes ici
};

var game = new Phaser.Game(config);

let responsive = {
  width:window.innerWidth,
  height:window.innerHeight,
}
let gameScale = {
  width:VALUES.width,
  height:VALUES.height
}
// Fonction de redimensionnement
function resize() {
  responsive.width = window.innerWidth;
  responsive.height = window.innerHeight;
  // Calcul de la nouvelle hauteur en fonction du facteur de redimensionnement de la largeur
  const newHeight = responsive.width / game.config.width * game.config.height;
  if (newHeight > responsive.height) {
    // Si oui, ajustez la hauteur à la hauteur de la fenêtre et ajustez la largeur en conséquence
    game.scale.resize(responsive.width, responsive.height);
    gameScale.width = responsive.width;
    gameScale.height = responsive.height;
  } else {
    // Sinon, utilisez la hauteur calculée normalement
    game.scale.resize(responsive.width / game.config.width * game.config.width, newHeight);
    gameScale.width = responsive.width / game.config.width * game.config.width;
    gameScale.height = newHeight;
  }
}

// Gestionnaire d'événements pour le redimensionnement de la fenêtre
window.addEventListener('load', resize);
window.addEventListener('resize', resize);
export { gameScale, responsive };