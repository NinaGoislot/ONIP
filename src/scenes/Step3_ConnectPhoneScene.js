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

    preload() {
        this.load.image('background', './media/img/background.png');
    }

    create() {
        // ****** Background ******
        let background = this.add.image(gameScale.width / 2, gameScale.height / 2, 'background');
        background.displayWidth = gameScale.width;
        background.displayHeight = gameScale.width / background.width * background.height;

        // ****** Events Listeners ******
        window.addEventListener('resize', () => {
            background.displayWidth = gameScale.width;
            background.displayHeight = gameScale.width / background.width * background.height;
            background.setPosition(gameScale.width / 2, gameScale.height / 2);
            this.infos.setPosition(gameScale.width * 0.1, gameScale.height * 0.25);
        });

        // ****** Actions ******
        this.infos = this.add.text(gameScale.width * 0.1, gameScale.height * 0.25, "", {
            fontSize: '24px',
            fill: '#fff'
        });
        this.isSolo = this.game.registry.get('isSolo');
        console.log('solo?', this.isSolo)
        if(this.isSolo){
            socket.emit("CREATE_GAME_SOLO");
            this.btnPlaySolo = this.add.text(200, 100, "Start game solo", { fontSize: '24px', fill: '#fff' })
            .setInteractive({ cursor: 'pointer' })
            .on('pointerdown', () => this.startGameSolo())
            .on('pointerover', () => this.btnPlaySolo.setTint(0x90ee90))
            .on('pointerout', () => this.btnPlaySolo.setTint(0xffffff));
            this.btnPlaySolo.input.enabled = false;

            this.btnCopy = this.add.text(200, 250, "copy code pin", { fontSize: '24px', fill: '#fff' })
            .setInteractive({ cursor: 'pointer' })
            .on('pointerover', () => this.btnCopy.setTint(0x90ee90))
            .on('pointerout', () => this.btnCopy.setTint(0xffffff));
        } else {
            this.playerId = this.game.registry.get('roomIdJoueur');
            this.infos.text = "En attente des shakers : " + this.playerId;
        }

        // ******************************* SOCKET ************************************************
        socket.on("READY_TO_PLAY", (roleJoueur) => {
            if(this.isSolo){
            //this.rolePlayer = this.game.registry.set('rolePlayer', 1);
            this.player = new Player(this, "joueurSolo", 1, this.playerId);
            this.partie = new Partie(this, "solo", this.playerId.slice(0, -1), this.player);
            this.game.registry.set('partie', this.partie);
            this.btnPlaySolo.input.enabled = true;
            this.scene.start('Step4_PseudoScene', roleJoueur);
            } else {
                this.scene.start('Step4_PseudoScene', roleJoueur);
                this.scene.remove('Step3_ConnectPhoneScene');
            }
        })

        socket.on("WAITING_FOR_SHAKER", (roomIdJoueur)=>{
            this.game.registry.set('roomIdJoueur', roomIdJoueur);
            this.playerId = this.game.registry.get('roomIdJoueur');
            this.infos.text = "En attente du shaker : " + this.playerId;
            this.btnCopy.on('pointerdown', () => this.copy(this.playerId))
        })
    }

    // ************************************* FONCTIONS ************************************************

    copy(texteARecopier){
        navigator.clipboard.writeText(texteARecopier)
        .then(() => {
            console.log('Contenu copié avec succès !', texteARecopier);
        })
        .catch(err => {
            console.error('Erreur lors de la copie du contenu :', err);
        });
    }

    startGameSolo(){
        this.scene.start('GameScene');
        this.scene.remove('Step3_ConnectPhoneScene');
    }

    wait = async (amount) => {
        await new Promise(resolve => this.time.delayedCall(amount, resolve));
    }
}

export default Step3_ConnectPhoneScene;