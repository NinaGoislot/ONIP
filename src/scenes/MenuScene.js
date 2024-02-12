import {gameScale, socket} from '../main.js';

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
        let menuTxt = this.add.text(gameScale.width*0.1, gameScale.height * 0.1, 'Menu', { fontSize: '32px', fill: '#fff' });

        // Utilisation de la fonction pour créer les boutons
        let btnJouer = this.createButton(gameScale.width * 0.1, gameScale.height * 0.2, 'Jouer', () => this.jouerBtn(), true, false);
        this.btnJouerSolo = this.createButton(gameScale.width * 0.25, gameScale.height * 0.17, 'Mode solo', () => this.startConnexion(true), false);
        this.btnJouerMulti = this.createButton(gameScale.width * 0.25, gameScale.height * 0.23, 'Mode multi', () => this.startConnexion(false), false);
        let btnModeLibre = this.createButton(gameScale.width * 0.1, gameScale.height * 0.27, 'Mode libre', () => this.startGame(), true, false);
        let btnLeaderboard = this.createButton(gameScale.width * 0.1, gameScale.height * 0.34, 'Tableau d\'honneur', () => {});
        let btnOptions = this.createButton(gameScale.width * 0.1, gameScale.height * 0.41, 'Options', () => this.startOptions());
        let btnCredits = this.createButton(gameScale.width * 0.1, gameScale.height * 0.48, 'Crédits', () => {});
        //responsive des boutons
        window.addEventListener('resize', () => {
            menuTxt.setPosition(gameScale.width*0.1, gameScale.height * 0.1)
            btnJouer.setPosition(gameScale.width*0.1, gameScale.height * 0.2)
            this.btnJouerSolo.setPosition(gameScale.width * 0.25, gameScale.height * 0.17)
            this.btnJouerMulti.setPosition(gameScale.width * 0.25, gameScale.height * 0.23)
            btnModeLibre.setPosition(gameScale.width*0.1, gameScale.height * 0.27)
            btnLeaderboard.setPosition(gameScale.width*0.1, gameScale.height * 0.34)
            btnOptions.setPosition(gameScale.width*0.1, gameScale.height * 0.41)
            btnCredits.setPosition(gameScale.width*0.1, gameScale.height * 0.48)
        });

        if(this.game.registry.has('connected')){
            btnJouer.input.enabled = true;
            btnModeLibre.input.enabled = true;
        }

        // **************************** MUSIC *****************************************
        let music = this.game.registry.get('music');
        if(music.isPaused){
            music.pause();
            this.game.registry.set('music', music);
        } else if (music.isPlaying){
            music.resume();
            this.game.registry.set('music', music);
        } else{
            //pour pas que ça gène, j'ai mis en commentaire le play de la music
            // music.play();
            // this.game.registry.set('music', music);
        }
    }

    createButton(x, y, text, onClick, isVisible = true, isEnable = true) {
        let button = this.add.text(x, y, text, { fontSize: '24px', fill: '#fff' })
            .setInteractive({ cursor: 'pointer' })
            .on('pointerdown', onClick)
            .on('pointerover', () => button.setTint(0x90ee90))
            .on('pointerout', () => button.setTint(0xffffff))
            .setVisible(isVisible);
            button.input.enabled = isEnable;
        return button;
    }

    jouerBtn(){
        if(this.btnJouerSolo.visible == false){
            this.btnJouerSolo.visible = true;
            this.btnJouerMulti.visible = true;
        } else {
            this.btnJouerSolo.visible = false;
            this.btnJouerMulti.visible = false;
        }
    }

    startGame() {
        // Lancer la scène de jeu
        this.scene.start('GameScene');
        socket.emit('START_SOLO');
    }

    startConnexion(solo){
        this.game.registry.set('isSolo', solo);
        this.scene.start('ConnexionScene')
    }

    startOptions(){
        this.scene.start('OptionsScene')
    }
}

export default MenuScene;