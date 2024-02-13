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
        this.playerId = this.game.registry.get('roomIdJoueur');
        this.infos.text = "En attente des shakers : " + this.playerId;


        // ******************************* SOCKET ************************************************
        socket.on("READY_TO_PLAY", (roleJoueur) => {
            this.scene.start('Step4_PseudoScene', roleJoueur);
            this.scene.remove('Step3_ConnectPhoneScene');
        })
    }

    // ************************************* FONCTIONS ************************************************
    wait = async (amount) => {
        await new Promise(resolve => this.time.delayedCall(amount, resolve));
    }
}

export default Step3_ConnectPhoneScene;