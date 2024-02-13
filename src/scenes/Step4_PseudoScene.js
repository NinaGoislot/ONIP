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

    preload() {
        this.load.image('background', './media/img/background.png');
        this.load.html('joinRoom', './html/joinGame.html');
    }

    create(data) {
        this.rolePlayer = data;
        this.game.registry.set('rolePlayer', this.rolePlayer);
        this.roomIdPlayer = this.game.registry.get('roomIdJoueur');

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
        this.formJoin = this.add.dom(gameScale.width * 0.35, gameScale.height * 0.6).createFromCache('joinRoom');
        this.formJoin.addListener('click');
        window.addEventListener('resize', () => {
            this.formJoin.setPosition(gameScale.width * 0.35, gameScale.height * 0.6);
        });

        this.infoReady = document.querySelector('#infoReady');
        this.divJoin = document.querySelector('#divJoin');

        this.putPseudo = document.querySelector("#putPseudo");
        const inputPseudo = document.querySelector("#inputPseudo");
        const btnReady = document.querySelector("#btnReady");
        this.btnPlay = document.querySelector("#btnPlay");
        const idRoom = document.querySelector("#idRoom");
        this.partie = document.querySelector("#partie");

        this.divJoin.setAttribute('hidden', true);
        this.putPseudo.removeAttribute('hidden');
        this.putPseudo.removeAttribute('hidden');

        if (this.rolePlayer == 1) {
            this.btnPlay.removeAttribute('hidden');
        }
        if (this.rolePlayer == 2) {
            btnReady.removeAttribute('hidden');
        }

        // ******************************* event click ************************************************
        btnReady.addEventListener('click', () => {
            this.pseudo = inputPseudo.value.trim();
            const isValidPseudo = /^[^\s]+/.test(this.pseudo);
            if (!isValidPseudo) {
                this.infoReady.innerText = "Veuillez rentrez un pseudo"
            } else if (this.pseudo.length > 25) {
                this.infoReady.innerText = "Le pseudo ne peut pas dépasser 25 caractères";
            } else {
                this.infoReady.innerText = "En attente de l'autre joueur...";
                socket.emit("PSEUDO_READY", this.pseudo,  this.roomIdPlayer );
            }
        });

        this.btnPlay.addEventListener('click', () => {
            this.pseudo = inputPseudo.value.trim();
            const isValidPseudo = /^[^\s]+/.test(this.pseudo);
            if (!isValidPseudo) {
                this.infoReady.innerText = "Veuillez rentrez un pseudo"
            } else if (this.pseudo.length > 25) {
                this.infoReady.innerText = "Le pseudo ne peut pas dépasser 25 caractères";
            } else {
                socket.emit("PSEUDO_READY", this.pseudo,  this.roomIdPlayer );
            }
        });

        // ******************************* SOCKET ************************************************
        socket.on("JOUEUR_READY", () => {
            this.btnPlay.disabled = false;
            this.infoReady.innerText = "Le deuxième joueur est prêt !";
        });

        socket.on("GO_PLAY", () => {
            putPseudo.setAttribute('hidden', '');
            partie.removeAttribute('hidden');
            this.player = new Player(this, this.pseudo, this.rolePlayer, this.roomIdPlayer);
            this.partie = new Partie(this, "multi", this.roomIdPlayer.slice(0, -1), this.rolePlayer);
            this.game.registry.set('partie', this.partie);
            
            this.scene.start('GameScene');
            this.scene.remove('Step4_PseudoScene');
        });
    }

    // ************************************* FONCTIONS ************************************************

    jouerBtn() {
        if (this.btnJouerSolo.visible == false) {
            this.btnJouerSolo.visible = true;
            this.btnJouerMulti.visible = true;
        } else {
            this.btnJouerSolo.visible = false;
            this.btnJouerMulti.visible = false;
        }
    }
}

export default Step4_PseudoScene;