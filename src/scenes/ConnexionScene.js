import {gameScale, socket} from '../main.js';

class ConnexionScene extends Phaser.Scene {
    constructor() {
        super({ key: 'ConnexionScene' });
    }

    preload(){
        this.load.image('background', './media/img/background.png');
        this.load.html('joinRoom', './html/joinGame.html');
    }

    create() {
        // add background to scene
        let background = this.add.image(gameScale.width / 2, gameScale.height / 2, 'background');
        background.displayWidth = gameScale.width;
        background.displayHeight = gameScale.width / background.width * background.height;
        window.addEventListener('resize', () => {
            background.displayWidth = gameScale.width;
            background.displayHeight = gameScale.width / background.width * background.height;
            background.setPosition(gameScale.width/2, gameScale.height/2)
        });

        // Afficher les textes
        let menuTxt = this.add.text(gameScale.width*0.1, gameScale.height * 0.1, 'Connexion au téléphone', { fontSize: '32px', fill: '#fff' });

        this.isSolo = this.game.registry.get('isSolo');
// ******************************* SOLO ************************************************
        if(this.isSolo){
            socket.emit("CREATE_GAME", true);
            this.codePin = this.add.text(gameScale.width*0.1, gameScale.height * 0.25, "", { fontSize: '24px', fill: '#fff' });
            this.btnJouer = this.createButton(gameScale.width * 0.1, gameScale.height * 0.35, 'Lancer la partie', () => this.startGame(), true, false);
            window.addEventListener('resize', () => {
                menuTxt.setPosition(gameScale.width*0.1, gameScale.height * 0.1)
                this.codePin.setPosition(gameScale.width*0.1, gameScale.height * 0.2)
                this.btnJouer.setPosition(gameScale.width*0.1, gameScale.height * 0.3)
            });
        } 
// ******************************* MULTI ************************************************
        else {
            menuTxt.text = "Choix de la partie";
            this.infos = this.add.text(gameScale.width*0.1, gameScale.height * 0.25, "", { fontSize: '24px', fill: '#fff' });
            this.btnCreer = this.createButton(gameScale.width * 0.1, gameScale.height * 0.35, 'Créer une partie', () => this.createGame());
            this.formJoin = this.add.dom(gameScale.width * 0.35, gameScale.height * 0.6).createFromCache('joinRoom');
            this.formJoin.addListener('click');
            window.addEventListener('resize', () => {
                menuTxt.setPosition(gameScale.width*0.1, gameScale.height * 0.1)
                this.btnCreer.setPosition(gameScale.width*0.1, gameScale.height * 0.35);
                this.formJoin.setPosition(gameScale.width * 0.35, gameScale.height*0.6);
                this.infos.setPosition(gameScale.width*0.1, gameScale.height * 0.25);
            });

            const inputRoomId = document.querySelector('#inputRoomId');
            this.infoReady = document.querySelector('#infoReady');
            const joinRoom = document.querySelector('#joinRoom');
            this.divJoin = document.querySelector('#divJoin');

            this.putPseudo = document.querySelector("#putPseudo");
            const inputPseudo = document.querySelector("#inputPseudo");
            const btnReady = document.querySelector("#btnReady");
            this.btnPlay = document.querySelector("#btnPlay");
            const idRoom = document.querySelector("#idRoom");

            this.partie = document.querySelector("#partie");

// ******************************* event click ************************************************
            btnReady.addEventListener('click', () => {
                const pseudo = inputPseudo.value.trim();
                const isValidPseudo = /^[^\s]+/.test(pseudo);
                if (!isValidPseudo) {
                    this.infoReady.innerText = "Veuillez rentrez un pseudo"
                } else if (pseudo.length > 25) {
                    this.infoReady.innerText = "Le pseudo ne peut pas dépasser 25 caractères";
                } else {
                    socket.emit("PSEUDO_READY", pseudo, idRoom.value);
                    this.infoReady.innerText = "En attente de l'autre joueur..."
                }
            })
            
            this.btnPlay.addEventListener('click', () => {
                const pseudo = inputPseudo.value.trim();
                const isValidPseudo = /^[^\s]+/.test(pseudo);
                if (!isValidPseudo) {
                    this.infoReady.innerText = "Veuillez rentrez un pseudo"
                } else if (pseudo.length > 25) {
                    this.infoReady.innerText = "Le pseudo ne peut pas dépasser 25 caractères";
                } else {
                    socket.emit("PSEUDO_READY", inputPseudo.value, idRoom.value);
                }
            })

            joinRoom.addEventListener('click', () => {
                if (inputRoomId.value == null || inputRoomId.value == "") {
                    this.infoReady.innerText = "Veuillez entrer un code de partie."
                } else {
                    socket.emit("JOIN_GAME", inputRoomId.value);
                }
            })
        }

// ******************************* SOCKET ************************************************
        socket.on("WAITING_FOR_SHAKER", (roomId) => {
            this.codePin.text = roomId;
            this.game.registry.set('roomIdJoueur', roomId);
        })

        socket.on("READY_TO_PLAY", (roleJoueur)=>{
            if(roleJoueur == 3){
                this.btnJouer.input.enabled = true;
                this.btnJouer.setTint(0x199F19)
            } else{
                this.infos.visible = false;
                this.putPseudo.removeAttribute('hidden');
                if (roleJoueur == 1) {
                    this.btnPlay.removeAttribute('hidden');
                }
                if (roleJoueur == 2) {
                    btnReady.removeAttribute('hidden');
                }
            }
        })

        socket.on("GAME_CREATED", (roomId) =>{
            if(!this.isSolo){
                console.log(this.isSolo)
                this.divJoin.setAttribute('hidden', '');
                this.btnCreer.visible = false;
                this.infos.text = "En attente des shakers : " + roomId;
            }
        })

        socket.on("READY_TO_CONNECT", () => {
            divJoin?.parentNode?.removeChild(divJoin);
            this.btnCreer.visible = false;
            socket.on("WAITING_FOR_SHAKERS", (roomIdJoueur) => {
                this.infos.text = "En attente des shakers : " + roomIdJoueur;
                idRoom.value = roomIdJoueur;
                this.game.registry.set('roomIdJoueur', roomIdJoueur);
            });
        });

        socket.on("JOUEUR_READY", () => {
            this.btnPlay.disabled = false;
            this.infoReady.innerText = "Le deuxième joueur est prêt !";
        })

        socket.on("GO_PLAY", () => {
            putPseudo.setAttribute('hidden', '');
            partie.removeAttribute('hidden');
            this.scene.start('GameScene');
        })
    }

// ************************************* FONCTIONS ************************************************

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

    createGame() {
        socket.emit("CREATE_GAME", this.isSolo);
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
        this.scene.start('GameScene');
        socket.emit('START_SOLO');
    }
}

export default ConnexionScene;