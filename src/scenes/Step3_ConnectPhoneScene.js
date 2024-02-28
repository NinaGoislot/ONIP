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

    preload() {
        this.load.image('bg-step3', './media/img/lancement-partie/step3.webp');
    }

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

        this.infos = this.add.text(gameScale.width * 0.68, gameScale.height * 0.515, "", {
            fontFamily: 'soria',
            fontSize: gameScale.width * 0.05 + 'px',
            fill: '#252422',
            align: 'center'
        }).setInteractive({
            cursor: 'pointer'
        });

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
            this.infos.setPosition(gameScale.width * 0.685, gameScale.height * 0.515);
        };
        window.addEventListener('resize', resizeListener);
        this.resizeListeners.push(resizeListener);

        // ****** Actions ******

        console.log('solo?', this.isSolo)
        if (this.isSolo) {
            socket.emit("CREATE_GAME_SOLO");

            //ENELEVER CA
            // this.btnPlaySolo = this.add.text(200, 100, "Start game solo", {
            //         fontSize: '24px',
            //         fill: '#fff'
            //     })
            //     .setInteractive({
            //         cursor: 'pointer'
            //     })
            //     .on('pointerdown', () => this.startGameSolo())
            //     .on('pointerover', () => this.btnPlaySolo.setTint(0x90ee90))
            //     .on('pointerout', () => this.btnPlaySolo.setTint(0xffffff));
            // this.btnPlaySolo.input.enabled = false;
        } else {
            this.playerId = this.game.registry.get('roomIdJoueur');
            this.infos.text = this.playerId;
            this.infos.on('pointerdown', () => this.copy(this.playerId));
        }

        // ******************************* SOCKET ************************************************
        socket.on("READY_TO_PLAY", (roleJoueur) => {
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
        })

        socket.on("WAITING_FOR_SHAKER", (roomIdJoueur) => {
            this.game.registry.set('roomIdJoueur', roomIdJoueur);
            this.playerId = this.game.registry.get('roomIdJoueur');
            this.infos.text = this.playerId;
            this.infos.on('pointerdown', () => this.copy(this.playerId));
        })
    }

    // ************************************* FONCTIONS ************************************************

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

    startGameSolo() {
        console.log(this.playerId.slice(0, -1), this.player.numeroPlayer)
        socket.emit("START_GAME", this.playerId.slice(0, -1), this.player.numeroPlayer);
        this.scene.start('GameScene');
        // this.scene.remove('Step3_ConnectPhoneScene');
    }

    wait = async (amount) => {
        await new Promise(resolve => this.time.delayedCall(amount, resolve));
    }
}

export default Step3_ConnectPhoneScene;