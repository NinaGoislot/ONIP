import Partie from '../class/Partie.js';
import Player from '../class/Player.js';
import {
    gameScale,
    socket
} from '../main.js';

class Step4_PseudoScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'Step4_PseudoScene'
        });
    }

    // preload() {
    //     this.load.image('bg-step4-j1', './media/img/lancement-partie/step4-j1.webp');
    //     this.load.image('bg-step4-j2', './media/img/lancement-partie/step4-j2.webp');
    //     this.load.image('step4-btn-noactive', './media/img/lancement-partie/step4-btn-noactive.webp');
    //     this.load.image('step4-btn-active', './media/img/lancement-partie/step4-btn-active.webp');
    //     this.load.html('joinRoom', './html/joinGame.html');
    // }

    create(data) {
        this.rolePlayer = data;
        this.game.registry.set('rolePlayer', this.rolePlayer);
        this.roomIdPlayer = this.game.registry.get('roomIdJoueur');
        this.isSolo = this.game.registry.get('isSolo');
        this.partie = this.game.registry.get('partie');
        this.aPlayerReady = false;
        this.j1Ready = false;
        this.canEnter = true;
        this.resizeListeners = [];


        // ****** Background ******
        let background;
        if(this.rolePlayer == 1){
            background = this.add.image(gameScale.width / 2, gameScale.height / 2, 'bg-step4-j1');
            this.btnPreReady = this.add.image(gameScale.width * 1, gameScale.height * 1, 'step4-btn-noactive').setOrigin(1,1);
            this.btnPreReady.displayWidth = gameScale.width * 0.22
            this.btnPreReady.scaleY = this.btnPreReady.scaleX;
            this.btnIsReady = this.add.image(gameScale.width * 1, gameScale.height * 1, 'step4-btn-active').setOrigin(1,1).setInteractive({ cursor: 'pointer' });
            this.btnIsReady.displayWidth = gameScale.width * 0.22
            this.btnIsReady.scaleY = this.btnIsReady.scaleX;
            this.btnIsReady.setVisible(false);
        } else {
            background = this.add.image(gameScale.width / 2, gameScale.height / 2, 'bg-step4-j2');
        }
        background.displayWidth = gameScale.width;
        background.displayHeight = gameScale.width / background.width * background.height;
        this.btnBack = this.add.rectangle(gameScale.width*0.06, gameScale.height*0.105, gameScale.width*0.072, gameScale.width*0.072, 0x6666ff, 0);
        this.btnBack.setInteractive({cursor: 'pointer'});
        this.btnBack.on('pointerdown', ()=> this.back());

        this.menuTransi = this.game.registry.get('menuTransi');
        this.menuPingPong = this.game.registry.get('menuPingPong');
        this.menuToc = this.game.registry.get('menuToc');
        this.musicJ2JOIN = this.sound.add('musicJ2Join');
        this.musicValid = this.sound.add('PingPongPaddle');

        // ****** Events Listeners ******
        window.addEventListener('resize', () => {
            background.displayWidth = gameScale.width;
            background.displayHeight = gameScale.width / background.width * background.height;
            background.setPosition(gameScale.width / 2, gameScale.height / 2);
            if(this.rolePlayer == 1){
                this.btnPreReady.displayWidth = gameScale.width * 0.22
                this.btnPreReady.scaleY = this.btnPreReady.scaleX;
                this.btnPreReady.setPosition(gameScale.width * 1, gameScale.height * 1);
                this.btnIsReady.displayWidth = gameScale.width * 0.22
                this.btnIsReady.scaleY = this.btnIsReady.scaleX;
                this.btnIsReady.setPosition(gameScale.width * 1, gameScale.height * 1);
            }
            this.btnBack.displayWidth = this.btnBack.displayHeight = gameScale.width*0.072;
            this.btnBack.setPosition(gameScale.width*0.06, gameScale.height*0.105);
        });

        // ****** Actions ******
        this.formJoin = this.add.dom(gameScale.width * 0.14, gameScale.height * 0.42).createFromCache('joinRoom').setOrigin(0,0);
        this.formJoin.addListener('click');
        this.messageInfos = this.add.text(gameScale.width * 0.33, gameScale.height * 0.35, "", {
            fontFamily:'soria',
            fontSize:  gameScale.width*0.025 + 'px',
            // fontSize: '30px',
            fill: '#EFECEA',
            align: 'center',
            wordWrap: {width: gameScale.width*0.25}
        }).setOrigin(0.5,1);
        this.messageStatePlayer = this.add.text(gameScale.width * 0.72, gameScale.height * 0.47, "", {
            fontFamily:'soria',
            fontSize:  gameScale.width*0.03 + 'px',
            // fontSize: '45px',
            fill: '#EFECEA',
            align: 'center',
            wordWrap: {width: gameScale.width*0.2}
        }).setOrigin(0.5,0.5);

        //js
        this.divJoin = document.querySelector('#divJoin');
        this.divJoin.setAttribute('hidden', true);
        this.putPseudo = document.querySelector("#putPseudo");
        this.putPseudo.removeAttribute('hidden');
        this.inputPseudo = document.querySelector("#inputPseudo");
        this.inputPseudo.style.fontSize = gameScale.width * 0.035 + "px";

        this.btnValidation = this.add.rectangle(gameScale.width*0.33, gameScale.height*0.6, gameScale.width*0.14, gameScale.height*0.09, 0x6666ff, 0).setOrigin(0.5,0.5);
        this.btnValidation.setInteractive({cursor: 'pointer'});
        this.btnValidation.on('pointerdown', ()=> this.validation());
        this.input.keyboard.on('keydown-ENTER', () => {
            if(this.canEnter){
                this.validation();
            }
        });
        //resize
        window.addEventListener('resize', () => {
            this.formJoin.setPosition(gameScale.width * 0.14, gameScale.height * 0.42);
            this.btnValidation.displayWidth = gameScale.width*0.14;
            this.btnValidation.displayHeight = gameScale.height*0.09;
            this.btnValidation.setPosition(gameScale.width*0.33, gameScale.height*0.6);
        });
        const resizeListener = () => {
            this.inputPseudo.style.fontSize = gameScale.width * 0.035 + "px";
            this.messageInfos.setWordWrapWidth(gameScale.width * 0.25);
            this.messageInfos.setFontSize(gameScale.width*0.025);
            this.messageInfos.setPosition(gameScale.width * 0.33, gameScale.height * 0.35);
            this.messageStatePlayer.setWordWrapWidth(gameScale.width * 0.2);
            this.messageStatePlayer.setFontSize(gameScale.width*0.03);
            this.messageStatePlayer.setPosition(gameScale.width * 0.72, gameScale.height * 0.47);
        };
        window.addEventListener('resize', resizeListener);
        this.resizeListeners.push(resizeListener);
    
        console.log('aPlayerReady', this.game.registry.get('aPlayerReady'));
        if(this.game.registry.get('aPlayerReady')){
            this.messageStatePlayer.text = "Le deuxième joueur est prêt !";
            this.aPlayerReady = true;
            this.musicJ2JOIN.play();
            if(this.j1Ready || this.isSolo){
                this.btnPreReady.setVisible(false);
                this.btnIsReady.setVisible(true);
                this.btnIsReady.on('pointerdown', ()=> this.goPlay(this.roomId));
            }
        }
    
        // ******************************* SOCKET ************************************************
        socket.once("JOUEUR_READY", () => {
            this.messageStatePlayer.text = "Le deuxième joueur est prêt !";
            this.aPlayerReady = true;
            if(this.j1Ready || this.isSolo){
                this.btnPreReady.setVisible(false);
                this.btnIsReady.setVisible(true);
                this.btnIsReady.on('pointerdown', ()=> this.goPlay(this.roomId));
            }
        });

        socket.once("GO_PLAY", () => {
            console.log("je reçois le 'GO_PLAY'");
            if (!this.isSolo) {
                this.player = new Player(this, this.pseudo, this.rolePlayer, this.roomIdPlayer);
                this.partie = new Partie(this, "multi", this.roomIdPlayer.slice(0, -1), this.player);
                this.game.registry.set('partie', this.partie);
            } else{
                this.partie.player.pseudo = this.pseudo;
                this.game.registry.set('partie',this.partie);
            }
            socket.emit("START_GAME", this.roomIdPlayer.slice(0, -1), this.rolePlayer);
            this.removeResizeListeners();

            this.menuMusic = this.game.registry.get('musicMenu');
            this.menuMusic.stop();
            this.game.registry.set('musicMenu', this.music);
            this.scene.launch('StartScene');
            this.scene.bringToTop('StartScene');
            setTimeout(() => {
                this.putPseudo.setAttribute('hidden', '');
                this.formJoin.destroy();
            }, 300);
            // this.menuTransi.play();
            // setTimeout(() => {
            //     this.scene.start('GameScene');
            //     this.scene.bringToTop('StartScene');
            // }, 600);
        });
    }

    // ************************************* FONCTIONS ************************************************

    goPlay(){
        console.log("J'envoie WANT_TO_PLAY");
        socket.emit("WANT_TO_PLAY", this.roomIdPlayer);
        this.btnIsReady.disableInteractive();
    }

    removeResizeListeners() {
        this.resizeListeners.forEach(listener => {
            window.removeEventListener('resize', listener);
        });
    }

    validation(){
        this.pseudo = this.inputPseudo.value.trim();
        const isValidPseudo = /^[^\s]+/.test(this.pseudo);
        if (!isValidPseudo) {
            this.messageInfos.text = "Écris ton pseudo."
        } else if (this.pseudo.length > 15) {
            this.messageInfos.text = "Le pseudo ne peut pas dépasser 15 caractères.";
            this.menuToc.play();
        } else {
            console.log('test isSolo', this.isSolo);
            if(!this.aPlayerReady && !this.isSolo){
                this.messageStatePlayer.text = "En attente de l'autre joueur...";
            }
            if(this.aPlayerReady && this.rolePlayer == 1 || this.isSolo){
                this.btnPreReady.setVisible(false);
                this.btnIsReady.setVisible(true);
                this.btnIsReady.on('pointerdown', ()=> this.goPlay(this.roomId));
            }
            if(this.rolePlayer == 1 ){
                this.j1Ready = true;
            }
            socket.emit("PSEUDO_READY", this.pseudo, this.roomIdPlayer, this.isSolo ? "solo" : "multi");
            this.messageInfos.text = "";
            //console.log(this.aPlayerReady);
            this.btnValidation.disableInteractive();
            this.canEnter = false;
            this.musicValid.play();
        }
    }
}

export default Step4_PseudoScene;