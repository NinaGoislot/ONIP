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

    // preload() {
    //     this.load.image('bg-step2', './media/img/lancement-partie/step2.webp');
    //     this.load.image('btn-copy', './media/img/lancement-partie/step2-btn-copy.webp');
    //     this.load.image('btn-check', './media/img/lancement-partie/step2-btn-check.webp');
    //     this.load.html('joinRoom', './html/joinGame.html');
    // }

    create(data) {
        this.roomId = data.roomId;
        this.numeroPlayer = data.player;
        this.resizeListeners = [];

        // background to scene
        let background = this.add.image(gameScale.width / 2, gameScale.height / 2, 'bg-step2');
        background.displayWidth = gameScale.width;
        background.displayHeight = gameScale.width / background.width * background.height;

        let copy = this.add.image(gameScale.width*0.82, gameScale.height*0.5, 'btn-copy');
        copy.displayWidth = gameScale.width * 0.06;
        copy.scaleY = copy.scaleX;
        copy.setInteractive({cursor: 'pointer'});
        copy.setVisible(false);

        let check = this.add.image(gameScale.width*0.82, gameScale.height*0.5, 'btn-check');
        check.displayWidth = gameScale.width * 0.06;
        check.scaleY = check.scaleX;
        check.setInteractive({cursor: 'pointer'});
        check.setVisible(false);

        this.btnBack = this.add.rectangle(gameScale.width*0.06, gameScale.height*0.105, gameScale.width*0.072, gameScale.width*0.072, 0x6666ff, 0);
        this.btnBack.setInteractive({cursor: 'pointer'});
        this.btnBack.on('pointerdown', ()=> this.back());
        //faire la fonction retour

        this.title = this.add.text(gameScale.width * 0.535, gameScale.height * 0.335, "Partage ce code à ton ami.e", {
            fontFamily:'soria',
            fontSize: gameScale.width*0.05 + 'px',
            // fontSize:  '70px',
            fill: '#EFECEA',
            align: 'center'
        }).setOrigin(0.5,0.5);
        this.codePin = this.add.text(gameScale.width * 0.535, gameScale.height * 0.5, "", {
            fontFamily:'soria',
            fontSize: gameScale.width*0.08 + 'px',
            // fontSize: '120px',
            fill: '#EFECEA',
        }).setOrigin(0.5,0.5);
        this.codePin.setLetterSpacing(gameScale.width*0.025);
        this.codePin.setVisible(false);
        this.messageInfos = this.add.text(gameScale.width * 0.535, gameScale.height * 0.71, "", {
            fontFamily:'soria',
            fontSize:  gameScale.width*0.03 + 'px',
            // fontSize: '45px',
            fill: '#EFECEA'
        }).setOrigin(0.5,0.5);
        this.messageInfos.setVisible(false);

        //faire un texte au cas où erreur -> mauvais code pin, pas de code pin etc, actuellement : this.infos.text

        window.addEventListener('resize', () => {
            background.displayWidth = gameScale.width;
            background.displayHeight = gameScale.width / background.width * background.height;
            background.setPosition(gameScale.width / 2, gameScale.height / 2)
            copy.displayWidth = gameScale.width * 0.06;
            copy.scaleY = copy.scaleX;
            copy.setPosition(gameScale.width*0.82, gameScale.height*0.5);
            check.displayWidth = gameScale.width * 0.06;
            check.scaleY = check.scaleX;
            check.setPosition(gameScale.width*0.82, gameScale.height*0.5)
            this.btnBack.displayWidth = this.btnBack.displayHeight = gameScale.width*0.072;
            this.btnBack.setPosition(gameScale.width*0.06, gameScale.height*0.105);
        });

        const resizeListener = () => {
            this.title.setPosition(gameScale.width * 0.535, gameScale.height * 0.335);
            this.title.setFontSize(gameScale.width*0.05);
            this.codePin.setPosition(gameScale.width * 0.535, gameScale.height * 0.5);
            this.codePin.setFontSize(gameScale.width*0.08);
            this.codePin.setLetterSpacing(gameScale.width*0.025);
            this.messageInfos.setPosition(gameScale.width * 0.535, gameScale.height * 0.71);
            this.messageInfos.setFontSize(gameScale.width*0.03);
        };
        window.addEventListener('resize', resizeListener);
        this.resizeListeners.push(resizeListener);

        switch (this.numeroPlayer) {
            case "J1":
                this.codePin.text = this.roomId;
                copy.setVisible(true);
                this.codePin.setVisible(true);
                copy.on('pointerdown', ()=> this.copy(this.roomId));
                break;
            case "J2":
                this.title.text = "Entre le code pour rejoindre";
                check.setVisible(true);
                this.messageInfos.setVisible(true);
                this.formJoin = this.add.dom(gameScale.width * 0.05, gameScale.height * 0.42).createFromCache('joinRoom').setOrigin(0,0);
                this.formJoin.addListener('click');
                //Input pour J2
                this.divJoin = document.querySelector('#divJoin');
                this.inputRoomId = document.querySelector('#inputRoomId');
                this.inputRoomId.style.letterSpacing = gameScale.width * 0.04 + "px";
                this.inputRoomId.style.fontSize = gameScale.width * 0.07 + "px";
                check.on('pointerdown', ()=> this.onCheck());

                const resizeListener2 = () => {
                    this.formJoin.setPosition(gameScale.width * 0.05, gameScale.height * 0.42);
                    this.inputRoomId.style.letterSpacing = gameScale.width * 0.04 + "px";
                    this.inputRoomId.style.fontSize = gameScale.width * 0.07 + "px";
                };
                window.addEventListener('resize', resizeListener2);
                this.resizeListeners.push(resizeListener2);
    
                socket.on("BAD_GAME_ID", ()=>{
                    this.messageInfos.text = "Mauvais code. Réessaie."
                })
                break;
            default:
                break
        }


        // ******************************* SOCKET ************************************************
        socket.on("READY_TO_CONNECT", () => {
            socket.on("WAITING_FOR_SHAKERS", (roomIdJoueur) => {
                this.game.registry.set('roomIdJoueur', roomIdJoueur);
                this.removeResizeListeners();
                this.scene.start('Step3_ConnectPhoneScene');
                // this.scene.remove('Step2_LobbyScene');
            });
        });
    }

    // ************************************* FONCTIONS ************************************************

    back(){
        this.scene.start('Step1_CreateJoinLobbyScene');
        socket.emit("GO_BACK_FROM_STEP1", this.roomId);
    }


    copy(texteARecopier){
        navigator.clipboard.writeText(texteARecopier)
        .then(() => {
            this.messageInfos.setVisible(true);
            this.messageInfos.text = "Code copié !"
            console.log('Contenu copié avec succès !', texteARecopier);
        })
        .catch(err => {
            console.error('Erreur lors de la copie du contenu :', err);
        });
    }

    onCheck(){
        if (this.inputRoomId.value == null || this.inputRoomId.value == "") {
            this.messageInfos.text = "Entre un code de partie."
        } else {
            this.inputRoomId.value = this.inputRoomId.value.toUpperCase();
            this.inputRoomId.value = this.inputRoomId.value.replace(/O/g, '0');
            socket.emit("JOIN_GAME", this.inputRoomId.value);
        }
    }

    removeResizeListeners() {
        this.resizeListeners.forEach(listener => {
            window.removeEventListener('resize', listener);
        });
    }
}

export default Step2_LobbyScene;