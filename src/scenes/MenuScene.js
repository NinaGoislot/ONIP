import Partie from '../class/Partie.js';
import Player from '../class/Player.js';
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

        let rectangle = this.add.rectangle(gameScale.width*1, gameScale.height*0, 100, 100, 0x6666ff, 0.5).setOrigin(1,0);
        rectangle.setInteractive({cursor: 'pointer'})
        rectangle.on('pointerdown', ()=> this.fullScreen())
        //resize
        window.addEventListener('resize', () => {
            background.displayWidth = gameScale.width;
            background.displayHeight = gameScale.width / background.width * background.height;
            background.setPosition(gameScale.width/2, gameScale.height/2);
            rectangle.setPosition(gameScale.width*1, gameScale.height*0);
        });

        // Afficher le menu
        let menuTxt = this.add.text(gameScale.width*0.1, gameScale.height * 0.1, 'One Night In Paradoxe', { fill: '#252422', fontFamily:'soria', fontSize:  gameScale.width*0.05 + 'px',});

        // Utilisation de la fonction pour créer les boutons
        let btnJouer = this.createButton(gameScale.width * 0.1, gameScale.height * 0.2, 'Jouer', () => this.jouerBtn(), true, false);
        this.btnJouerSolo = this.createButton(gameScale.width * 0.25, gameScale.height * 0.17, 'Mode solo', () => this.goToLobby("solo"), false);
        this.btnJouerMulti = this.createButton(gameScale.width * 0.25, gameScale.height * 0.23, 'Mode multi', () => this.goToLobby("multi"), false);
        let btnModeLibre = this.createButton(gameScale.width * 0.1, gameScale.height * 0.27, 'Mode libre', () => this.startGame(), true, false);
        let btnLeaderboard = this.createButton(gameScale.width * 0.1, gameScale.height * 0.34, 'Tableau d\'honneur', () => {});
        let btnOptions = this.createButton(gameScale.width * 0.1, gameScale.height * 0.41, 'Options', () => this.startOptions());
        let btnCredits = this.createButton(gameScale.width * 0.1, gameScale.height * 0.48, 'Crédits', () => {});

        //responsive des boutons
        this.resizeListeners = [];
        const resizeListener = () => {
            menuTxt.setPosition(gameScale.width*0.1, gameScale.height * 0.1)
            btnJouer.setPosition(gameScale.width*0.1, gameScale.height * 0.2)
            this.btnJouerSolo.setPosition(gameScale.width * 0.25, gameScale.height * 0.17)
            this.btnJouerMulti.setPosition(gameScale.width * 0.25, gameScale.height * 0.23)
            btnModeLibre.setPosition(gameScale.width*0.1, gameScale.height * 0.27)
            btnLeaderboard.setPosition(gameScale.width*0.1, gameScale.height * 0.34)
            btnOptions.setPosition(gameScale.width*0.1, gameScale.height * 0.41)
            btnCredits.setPosition(gameScale.width*0.1, gameScale.height * 0.48)

            menuTxt.setFontSize(gameScale.width*0.05);
            btnJouer.setFontSize(gameScale.width*0.03);
            this.btnJouerSolo.setFontSize(gameScale.width*0.03);
            this.btnJouerMulti.setFontSize(gameScale.width*0.03);
            btnModeLibre.setFontSize(gameScale.width*0.03);
            btnLeaderboard.setFontSize(gameScale.width*0.03);
            btnOptions.setFontSize(gameScale.width*0.03);
            btnCredits.setFontSize(gameScale.width*0.03);
        };
        window.addEventListener('resize', resizeListener);
        this.resizeListeners.push(resizeListener);

        if(this.game.registry.get('connected')){
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
        let button = this.add.text(x, y, text, { fill: '#252422', fontFamily:'soria', fontSize:  gameScale.width*0.03 + 'px'})
            .setInteractive({ cursor: 'pointer' })
            .on('pointerdown', onClick)
            .on('pointerover', () => button.setTint(0x90ee90))
            .on('pointerout', () => button.setTint(0xffffff))
            .setVisible(isVisible);
            button.input.enabled = isEnable;
        return button;
    }

    fullScreen(){
        if (this.scale.isFullscreen) {
            this.scale.stopFullscreen();
            // On stop fulll screen
        } else {
            this.scale.startFullscreen();
            // On start fulll screen
        }
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

    removeResizeListeners() {
        this.resizeListeners.forEach(listener => {
            window.removeEventListener('resize', listener);
        });
    }

    startGame() {
        //faire créer une room et rejoindre quand même donc euh système connexion tel aussi
        this.player = new Player(this, "this.pseudo", 1, "12341");
        this.partie = new Partie(this, "solo", "1234", this.player);
        this.game.registry.set('rolePlayer', 1);
        this.game.registry.set('partie', this.partie);
        // this.scene.start('GameScene');

        this.scene.start('EndScene');

        console.log('il ne se passe rien.')
        // socket.emit('START_SOLO');
    }

    goToLobby(mode){
        this.removeResizeListeners();
        if(mode == "solo"){
            this.scene.start('Step3_ConnectPhoneScene', {
                'mode' : true,
            });
        } else {
            this.scene.start('Step1_CreateJoinLobbyScene');
        }
    }

    startOptions(){
        this.scene.start('OptionsScene');
    }
}

export default MenuScene;