import Partie from '../class/Partie.js';
import Player from '../class/Player.js';
import {
    gameScale,
    socket
} from '../main.js';

class Step3_ConnectPhoneScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'Step3_ConnectPhoneScene'
        });
    }

    init(startData) {
        startData.mode ? this.isSolo = true : this.isSolo = false;
    }

    // preload() {
    //     this.load.image('bg-step3', './media/img/lancement-partie/step3.webp');
    // }

    create() {
        this.resizeListeners = [];
        // ****** Background ******
        let background = this.add.image(gameScale.width / 2, gameScale.height / 2, 'bg-step3');
        background.displayWidth = gameScale.width;
        background.displayHeight = gameScale.width / background.width * background.height;
        this.btnBack = this.add.rectangle(gameScale.width * 0.06, gameScale.height * 0.105, gameScale.width * 0.072, gameScale.width * 0.072, 0x6666ff, 0);
        this.btnBack.setInteractive({
            cursor: 'pointer'
        });
        this.btnBack.on('pointerdown', () => this.back());

        this.infos = this.add.text(gameScale.width * 0.74, gameScale.height * 0.56, "", {
            fontFamily: 'soria',
            fontSize: gameScale.width * 0.05 + 'px',
            fill: '#252422',
            align: 'center'
        }).setInteractive({
            cursor: 'pointer'
        }).setOrigin(0.5,0.5);
        this.infos.setLetterSpacing(gameScale.width*0.005);

        // ****** Events Listeners ******
        window.addEventListener('resize', () => {
            background.displayWidth = gameScale.width;
            background.displayHeight = gameScale.width / background.width * background.height;
            background.setPosition(gameScale.width / 2, gameScale.height / 2);
            this.btnBack.displayWidth = this.btnBack.displayHeight = gameScale.width * 0.072;
            this.btnBack.setPosition(gameScale.width * 0.06, gameScale.height * 0.105);
        });

        const resizeListener = () => {
            this.infos.setFontSize(gameScale.width * 0.05);
            this.infos.setPosition(gameScale.width * 0.74, gameScale.height * 0.56);
            this.infos.setLetterSpacing(gameScale.width*0.005);
        };
        window.addEventListener('resize', resizeListener);
        this.resizeListeners.push(resizeListener);
        this.menuTransi = this.game.registry.get('menuTransi');

        // ****** Actions ******

        console.log('solo?', this.isSolo)
        if (this.isSolo) {
            socket.emit("CREATE_GAME_SOLO");
        } else {
            this.playerId = this.game.registry.get('roomIdJoueur');
            this.infos.text = this.playerId;
            this.infos.on('pointerdown', () => this.copy(this.playerId));
        }

        // ******************************* SOCKET ************************************************
        socket.once("READY_TO_PLAY", (roleJoueur) => {
            if (this.isSolo) {
                //this.rolePlayer = this.game.registry.set('rolePlayer', 1);
                this.player = new Player(this, "joueurSolo", 1, this.playerId);
                this.partie = new Partie(this, "solo", this.playerId.slice(0, -1), this.player);
                this.game.registry.set('partie', this.partie);
                this.game.registry.set('isSolo', true);
                // this.btnPlaySolo.input.enabled = true;
                this.removeResizeListeners();

                this.scene.start('Step4_PseudoScene', roleJoueur);
            } else {
                this.game.registry.set('isSolo', false);
                this.removeResizeListeners();
                this.scene.start('Step4_PseudoScene', roleJoueur);
                // this.scene.remove('Step3_ConnectPhoneScene');
            }
            this.menuTransi.play();
        })

        socket.once("WAITING_FOR_SHAKER", (roomIdJoueur) => {
            this.game.registry.set('roomIdJoueur', roomIdJoueur);
            this.playerId = this.game.registry.get('roomIdJoueur');
            this.infos.text = this.playerId;
            this.infos.on('pointerdown', () => this.copy(this.playerId));
        })

        socket.once("JOUEUR_READY", () => {
            this.game.registry.set('aPlayerReady', true);
        });
    }

    // ************************************* FONCTIONS ************************************************
    back(){
        //si solo, changer au menu
        //si duo, rien
        if(this.isSolo){
            const roomId = this.playerId.slice(0, -1);
            console.log("go back", roomId);
            socket.emit("GO_BACK_FROM_STEP1", roomId);
            this.isSolo = null;
            this.scene.start('MenuScene');
            this.menuTransi.play();
        }
    }

    copy(texteARecopier) {
        navigator.clipboard.writeText(texteARecopier)
            .then(() => {
                console.log('Contenu copié avec succès !', texteARecopier);
            })
            .catch(err => {
                console.error('Erreur lors de la copie du contenu :', err);
            });
    }

    removeResizeListeners() {
        this.resizeListeners.forEach(listener => {
            window.removeEventListener('resize', listener);
        });
    }

    wait = async (amount) => {
        await new Promise(resolve => this.time.delayedCall(amount, resolve));
    }
}

export default Step3_ConnectPhoneScene;