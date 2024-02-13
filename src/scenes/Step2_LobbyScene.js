import {
    gameScale,
    socket
} from '../main.js';

class Step2_LobbyScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'Step2_LobbyScene'
        });
    }

    preload() {
        this.load.image('background', './media/img/background.png');
        this.load.html('joinRoom', './html/joinGame.html');
    }

    create(data) {
        this.roomId = data.roomId;
        this.numeroPlayer = data.player;

        // add background to scene
        let background = this.add.image(gameScale.width / 2, gameScale.height / 2, 'background');
        background.displayWidth = gameScale.width;
        background.displayHeight = gameScale.width / background.width * background.height;
        window.addEventListener('resize', () => {
            background.displayWidth = gameScale.width;
            background.displayHeight = gameScale.width / background.width * background.height;
            background.setPosition(gameScale.width / 2, gameScale.height / 2)
            this.infos.setPosition(gameScale.width * 0.1, gameScale.height * 0.25);
        });

        this.infos = this.add.text(gameScale.width * 0.1, gameScale.height * 0.25, "", {
            fontSize: '24px',
            fill: '#fff'
        });

        switch (this.numeroPlayer) {
            case "J1":
                this.infos.text = "Id de la room : " + this.roomId;
                break;
            case "J2":
                this.formJoin = this.add.dom(gameScale.width * 0.35, gameScale.height * 0.6).createFromCache('joinRoom');
                this.formJoin.addListener('click');
                window.addEventListener('resize', () => {
                    this.formJoin.setPosition(gameScale.width * 0.35, gameScale.height * 0.6);
                });

                //Inputs pour J2
                this.divJoin = document.querySelector('#divJoin');
                const inputRoomId = document.querySelector('#inputRoomId');
                const joinRoom = document.querySelector('#joinRoom');

                //Code de la partie pour J1
                const idRoom = document.querySelector("#idRoom");

                // ******************************* event click ************************************************s
                joinRoom.addEventListener('click', () => {
                    if (inputRoomId.value == null || inputRoomId.value == "") {
                        this.infoReady.innerText = "Veuillez entrer un code de partie."
                    } else {
                        socket.emit("JOIN_GAME", inputRoomId.value);
                    }
                })
                break;
            default:
                break
        }


        // ******************************* SOCKET ************************************************
        socket.on("READY_TO_CONNECT", () => {
            socket.on("WAITING_FOR_SHAKERS", (roomIdJoueur) => {
                //this.infos.text = "En attente des shakers : " + roomIdJoueur;
                this.game.registry.set('roomIdJoueur', roomIdJoueur);
                this.scene.start('Step3_ConnectPhoneScene');
                this.scene.remove('Step2_LobbyScene');
            });
        });
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
}

export default Step2_LobbyScene;