import {gameScale, responsive} from '../main.js';

class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    preload(){
        this.load.image('background', './media/img/background.png');
    }

    create() {
        // add background to scene
        let background = this.add.image(gameScale.width / 2, gameScale.height / 2, 'background');
        //place la taille de l'image en fonction de la taille du jeu
        background.displayWidth = gameScale.width;
        background.displayHeight = gameScale.width / background.width * background.height;
        //lorsque la page change de taille, on ajuste la taille de l'image et sa position centrée
        window.addEventListener('resize', () => {
            background.displayWidth = gameScale.width;
            background.displayHeight = gameScale.width / background.width * background.height;
            background.setPosition(gameScale.width/2, gameScale.height/2)
        });

        // Afficher le menu
        this.add.text(200, 150, 'Menu', { fontSize: '32px', fill: '#fff' });
        
        // Ajouter un bouton "Mode libre"
        const btnSoloMode = this.add.text(200, 200, 'Mode libre', { fontSize: '24px', fill: '#fff' })
            .setInteractive()
            .on('pointerdown', () => this.startGame());


            
    }

    startGame() {
        // Lancer la scène de jeu
        this.scene.start('GameScene');
    }
}

export default MenuScene;