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

    // preload() {
    //     this.load.image('bg-step1', './media/img/lancement-partie/step1.webp');
    // }

    create() {
        // add background to scene
        let background = this.add.image(gameScale.width / 2, gameScale.height / 2, 'bg-step1');
        background.displayWidth = gameScale.width;
        background.displayHeight = gameScale.width / background.width * background.height;

        this.btnBack = this.add.rectangle(gameScale.width*0.06, gameScale.height*0.105, gameScale.width*0.072, gameScale.width*0.072, 0x6666ff, 0);
        this.btnBack.setInteractive({cursor: 'pointer'});
        this.btnBack.on('pointerdown', ()=> this.back());
        //faire la fonction retour
        this.btnCreer = this.add.rectangle(gameScale.width*0.495, gameScale.height*0.275, gameScale.width*0.755, gameScale.height*0.445, 0x78FFD6, 0);
        this.btnCreer.setInteractive({cursor: 'pointer'});
        this.btnCreer.on('pointerdown', ()=> this.createGame());
        this.btnJoin = this.add.rectangle(gameScale.width*0.495, gameScale.height*0.722, gameScale.width*0.755, gameScale.height*0.44, 0x6666ff, 0);
        this.btnJoin.setInteractive({cursor: 'pointer'});
        this.btnJoin.on('pointerdown', ()=> this.joinGame());

        window.addEventListener('resize',()=>{
            background.displayWidth = gameScale.width;
            background.displayHeight = gameScale.width / background.width * background.height;
            background.setPosition(gameScale.width / 2, gameScale.height / 2)
            this.btnBack.displayWidth = this.btnBack.displayHeight = gameScale.width*0.072;
            this.btnBack.setPosition(gameScale.width*0.06, gameScale.height*0.105);
            this.btnCreer.displayWidth = gameScale.width*0.755;
            this.btnCreer.displayHeight = gameScale.height*0.445;
            this.btnCreer.setPosition(gameScale.width*0.495, gameScale.height*0.275);
            this.btnJoin.displayWidth = gameScale.width*0.755;
            this.btnJoin.displayHeight = gameScale.height*0.445;
            this.btnJoin.setPosition(gameScale.width*0.495, gameScale.height*0.722);
        })

        this.menuTransi = this.game.registry.get('menuTransi');

        // ******************************* SOCKET ************************************************
        socket.once("GAME_MULTI_CREATED", (roomId) => {
            this.scene.start('Step2_LobbyScene', {roomId : roomId, player : "J1"});
            this.menuTransi.play();
        })
    }

    // ************************************* FONCTIONS ************************************************
    back(){
        this.scene.start('MenuScene');
        this.menuTransi.play();
    }

    createGame() {
        socket.emit("CREATE_GAME_MULTI");
    }

    joinGame() {
        this.scene.start('Step2_LobbyScene', {roomId : 0, player : "J2"});
        this.menuTransi.play();
        // this.scene.remove('Step1_CreateJoinLobbyScene');
    }
}

export default Step1_CreateJoinLobbyScene;