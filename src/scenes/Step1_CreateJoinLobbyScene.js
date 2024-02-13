import {
    gameScale,
    socket
} from '../main.js';

class Step1_CreateJoinLobbyScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'Step1_CreateJoinLobbyScene'
        });
    }

    preload() {
        this.load.image('background', './media/img/background.png');
    }

    create() {
        // add background to scene
        let background = this.add.image(gameScale.width / 2, gameScale.height / 2, 'background');
        background.displayWidth = gameScale.width;
        background.displayHeight = gameScale.width / background.width * background.height;
        window.addEventListener('resize', () => {
            background.displayWidth = gameScale.width;
            background.displayHeight = gameScale.width / background.width * background.height;
            background.setPosition(gameScale.width / 2, gameScale.height / 2)
        });

        // Afficher les textes
        let menuTxt = this.add.text(gameScale.width * 0.1, gameScale.height * 0.1, 'Choix de la partie', {
            fontSize: '32px',
            fill: '#fff'
        });

        //Créer les boutons de l'écran
        this.btnCreer = this.createButton(gameScale.width * 0.1, gameScale.height * 0.35, 'Créer une partie', () => this.createGame());
        this.btnJoin = this.createButton(gameScale.width * 0.1, gameScale.height * 0.6, 'Rejoindre une partie', () => this.joinGame());

        // ******************************* SOCKET ************************************************
        socket.on("GAME_MULTI_CREATED", (roomId) => {
            this.scene.start('Step2_LobbyScene', {roomId : roomId, player : "J1"});
        })
    }

    // ************************************* FONCTIONS ************************************************

    createButton(x, y, text, onClick, isVisible = true, isEnable = true) {
        let button = this.add.text(x, y, text, {
                fontSize: '24px',
                fill: '#fff'
            })
            .setInteractive({
                cursor: 'pointer'
            })
            .on('pointerdown', onClick)
            .on('pointerover', () => button.setTint(0x90ee90))
            .on('pointerout', () => button.setTint(0xffffff))
            .setVisible(isVisible);
        button.input.enabled = isEnable;
        return button;
    }

    createGame() {
        socket.emit("CREATE_GAME_MULTI");
    }

    joinGame() {
        this.scene.start('Step2_LobbyScene', {roomId : 0, player : "J2"});
        this.scene.remove('Step1_CreateJoinLobbyScene');
    }
}

export default Step1_CreateJoinLobbyScene;