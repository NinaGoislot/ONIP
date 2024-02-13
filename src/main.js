import 'phaser';
import MenuScene from '@/scenes/MenuScene';
import Step1_CreateJoinLobbyScene from '@/scenes/Step1_CreateJoinLobbyScene';
import Step2_LobbyScene from '@/scenes/Step2_LobbyScene';
import Step3_ConnectPhoneScene from '@/scenes/Step3_ConnectPhoneScene';
import Step4_PseudoScene from '@/scenes/Step4_PseudoScene';
import ConnexionScene from '@/scenes/ConnexionScene';
import GameScene from '@/scenes/GameScene';
import EndScene from '@/scenes/EndScene';
import CabinetScene from '@/scenes/CabinetScene';
import LoadDataScene from '@/scenes/LoadDataScene';
import OptionsScene from '@/scenes/OptionsScene';
import PauseScene from '@/scenes/PauseScene';
import {io} from "https://cdn.socket.io/4.7.4/socket.io.esm.min.js";
const socket = io("http://127.0.0.1:3006"); //connexion au serveur socket.io

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
    parent: "parentDiv",
    width: VALUES.width,
    height: VALUES.height
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: VALUES.speedDown },
      debug: true,
    },
  },
  dom: {
    createContainer: true //pour ajouter du html
  },
  audio: {
    disableWebAudio: true //pour ajouter du son
  },
  scene: [LoadDataScene, MenuScene, ConnexionScene, Step1_CreateJoinLobbyScene, Step2_LobbyScene, Step3_ConnectPhoneScene, Step4_PseudoScene, GameScene, EndScene, CabinetScene, OptionsScene, PauseScene], // Ajouter toutes les scènes ici
};

var game = new Phaser.Game(config);

// ******************************* RESPONSIVE DU JEU *******************************
let responsive = {
  width:window.innerWidth,
  height:window.innerHeight,
}
let gameScale = {
  width:VALUES.width,
  height:VALUES.height
}
const parentDiv = document.querySelector("#parentDiv");
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
  parentDiv.style.width = gameScale.width + 'px';
  parentDiv.style.height = gameScale.height + 'px';
}

// Gestionnaire d'événements pour le redimensionnement de la fenêtre
window.addEventListener('load', resize);
window.addEventListener('resize', resize);

export { gameScale, socket };