import Partie from '../class/Partie.js';
import Player from '../class/Player.js';
import {gameScale, socket} from '../main.js';

class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    // preload(){
    //     this.load.image('background', './media/img/background.png');
    // }

    create() {
        // add background to scene
        let background = this.add.image(gameScale.width / 2, gameScale.height / 2, 'background');
        //place la taille de l'image en fonction de la taille du jeu
        background.displayWidth = gameScale.width;
        background.displayHeight = gameScale.width / background.width * background.height;

        this.fullscreen = this.add.image(gameScale.width*0.98, gameScale.height*0.02, 'fullscreen').setOrigin(1,0).setInteractive({cursor:'pointer'}).on('pointerdown', ()=>this.fullScreen()).setVisible(true);
        this.fullscreen.displayWidth = gameScale.width * 0.02;
        this.fullscreen.scaleY = this.fullscreen.scaleX;
        this.fullscreenExit = this.add.image(gameScale.width*0.95, gameScale.height*0.05, 'fullscreen-exit').setOrigin(1,0).setInteractive({cursor:'pointer'}).on('pointerdown', ()=>this.fullScreen()).setVisible(false);
        this.fullscreenExit.displayWidth = gameScale.width * 0.02;
        this.fullscreenExit.scaleY = this.fullscreenExit.scaleX;

        //resize
        window.addEventListener('resize', () => {
            background.displayWidth = gameScale.width;
            background.displayHeight = gameScale.width / background.width * background.height;
            background.setPosition(gameScale.width/2, gameScale.height/2);
            this.fullscreen.displayWidth = gameScale.width * 0.02;
            this.fullscreen.scaleY = this.fullscreen.scaleX;
            this.fullscreen.setPosition(gameScale.width*0.98, gameScale.height*0.02);
            this.fullscreenExit.displayWidth = gameScale.width * 0.02;
            this.fullscreenExit.scaleY = this.fullscreenExit.scaleX;
            this.fullscreenExit.setPosition(gameScale.width*0.98, gameScale.height*0.02);
        });

        // Afficher le menu
        let menuTxt = this.add.text(gameScale.width*0.5, gameScale.height * 0.2, 'One Night In Paradoxe', { fill: '#252422', fontFamily:'soria', fontSize:  gameScale.width*0.05 + 'px',}).setOrigin(0.5,0.5);

        // Utilisation de la fonction pour créer les boutons
        // let btnJouer = this.createButton(gameScale.width * 0.1, gameScale.height * 0.2, 'Jouer', () => this.jouerBtn(), true, false);
        // this.btnJouerSolo = this.createButton(gameScale.width * 0.25, gameScale.height * 0.17, 'Mode solo', () => this.goToLobby("solo"), false);
        // this.btnJouerMulti = this.createButton(gameScale.width * 0.25, gameScale.height * 0.23, 'Mode multi', () => this.goToLobby("multi"), false);
        // let btnModeLibre = this.createButton(gameScale.width * 0.1, gameScale.height * 0.27, 'Mode libre', () => this.startGame(), true, false);
        // let btnLeaderboard = this.createButton(gameScale.width * 0.1, gameScale.height * 0.34, 'Tableau d\'honneur', () => {});
        // let btnOptions = this.createButton(gameScale.width * 0.1, gameScale.height * 0.41, 'Options', () => this.startOptions());
        // let btnCredits = this.createButton(gameScale.width * 0.1, gameScale.height * 0.48, 'Crédits', () => {});

        // let btnJouer = this.createButton(gameScale.width * 0.5, gameScale.height * 0.4, 'Jouer', () => this.jouerBtn(), true, false);
        this.btnJouerSolo = this.createButton(gameScale.width * 0.5, gameScale.height * 0.33, 'Solo', () => this.goToLobby("solo"), true, false);
        this.btnJouerMulti = this.createButton(gameScale.width * 0.5, gameScale.height * 0.4, 'Multijoueur', () => this.goToLobby("multi"), true, false);

        //responsive des boutons
        this.resizeListeners = [];
        const resizeListener = () => {
            menuTxt.setPosition(gameScale.width*0.5, gameScale.height * 0.2)
            // btnJouer.setPosition(gameScale.width*0.1, gameScale.height * 0.2)
            this.btnJouerSolo.setPosition(gameScale.width * 0.5, gameScale.height * 0.33)
            this.btnJouerMulti.setPosition(gameScale.width * 0.5, gameScale.height * 0.4)
            // btnModeLibre.setPosition(gameScale.width*0.1, gameScale.height * 0.27)
            // btnLeaderboard.setPosition(gameScale.width*0.1, gameScale.height * 0.34)
            // btnOptions.setPosition(gameScale.width*0.1, gameScale.height * 0.41)
            // btnCredits.setPosition(gameScale.width*0.1, gameScale.height * 0.48)

            menuTxt.setFontSize(gameScale.width*0.05);
            // btnJouer.setFontSize(gameScale.width*0.03);
            this.btnJouerSolo.setFontSize(gameScale.width*0.03);
            this.btnJouerMulti.setFontSize(gameScale.width*0.03);
            // btnModeLibre.setFontSize(gameScale.width*0.03);
            // btnLeaderboard.setFontSize(gameScale.width*0.03);
            // btnOptions.setFontSize(gameScale.width*0.03);
            // btnCredits.setFontSize(gameScale.width*0.03);
        };
        window.addEventListener('resize', resizeListener);
        this.resizeListeners.push(resizeListener);
        this.btnJouerSolo.input.enabled = true;
        this.btnJouerMulti.input.enabled = true;
        // if(this.game.registry.get('connected')){
        //     this.btnJouerSolo.input.enabled = true;
        //     this.btnJouerMulti.input.enabled = true;
        // }
        // **************************** MUSIC *****************************************
        // let music = this.game.registry.get('music');
        // if(music.isPaused){
        //     music.pause();
        //     this.game.registry.set('music', music);
        // } else if (music.isPlaying){
        //     music.resume();
        //     this.game.registry.set('music', music);
        // } else{
        //     //pour pas que ça gène, j'ai mis en commentaire le play de la music
        //     // music.play();
        //     // this.game.registry.set('music', music);
        // }

        this.menuMusic = this.sound.add('menu', {loop:true});
        if (!this.menuMusic.isPlaying){
            console.log('this.menuMusic.isPlaying',this.menuMusic.isPlaying)
            this.menuMusic.play();
        }
        this.game.registry.set('musicMenu', this.menuMusic);

        this.menuTransi = this.sound.add('PasTransi');
        this.game.registry.set('menuTransi', this.menuTransi);
        this.menuToc = this.sound.add('Toc');
        this.game.registry.set('menuToc', this.menuToc);
        this.menuPingPong = this.sound.add('PingPong');
        this.game.registry.set('menuPingPong', this.menuPingPong);
    }

    createButton(x, y, text, onClick, isVisible = true, isEnable = true) {
        let button = this.add.text(x, y, text, { fill: '#252422', fontFamily:'soria', fontSize:  gameScale.width*0.03 + 'px'})
            .setInteractive({ cursor: 'pointer' })
            .on('pointerdown', onClick)
            .on('pointerover', () => button.setTint(0x90ee90))
            .on('pointerout', () => button.setTint(0xffffff))
            .setVisible(isVisible)
            .setOrigin(0.5,0.5);
            button.input.enabled = isEnable;
        return button;
    }

    fullScreen(){
        if (this.scale.isFullscreen) {
            this.scale.stopFullscreen();
            this.fullscreen.setVisible(true);
            this.fullscreenExit.setVisible(false);
            // On stop fulll screen
        } else {
            this.scale.startFullscreen();
            this.fullscreen.setVisible(false);
            this.fullscreenExit.setVisible(true);
            // On start fulll screen
        }
        this.menuPingPong.play();
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
        // this.player = new Player(this, "this.pseudo", 1, "12341");
        // this.partie = new Partie(this, "solo", "1234", this.player);
        // this.game.registry.set('rolePlayer', 1);
        // this.game.registry.set('partie', this.partie);
        // this.scene.start('EndScene');
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
        this.menuTransi.play();
        if (!this.menuMusic.isPlaying){
            this.menuMusic.play();
        }
    }

    startOptions(){
        this.scene.start('OptionsScene');
    }
}

export default MenuScene;