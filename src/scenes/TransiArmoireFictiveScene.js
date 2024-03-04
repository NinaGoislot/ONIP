import {
    gameScale, socket
} from '../main.js';

class ArmoireFictiveScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'ArmoireFictiveScene'
        });
    }

    create(data) {
        if(data.sens){
            this.sens = data.sens;
            this.sceneToMove = data.sceneToMove;
        } else{
            console.log("There's an error in data TransiArmoireFictive");
        }
        console.log("sens de la transi :", this.sens);
        this.partie = this.game.registry.get('partie');
        this.anims.create({
            key: 'transi-swipe-droite',
            frames: [
                {key: 'transi-swipe-droite0'},
                {key: 'transi-swipe-droite1'},
                {key: 'transi-swipe-droite2'},
                {key: 'transi-swipe-droite3'},
                {key: 'transi-swipe-droite4'},
                {key: 'transi-swipe-droite5'},
                {key: 'transi-swipe-droite6'},
                {key: 'transi-swipe-droite7'},
                {key: 'transi-swipe-droite8'},
                {key: 'transi-swipe-droite9'},
                {key: 'transi-swipe-droite10'},
                {key: 'transi-swipe-droite11'},
                {key: 'transi-swipe-droite12'},
                {key: 'transi-swipe-droite13'},
                {key: 'transi-swipe-droite14'},
                {key: 'transi-swipe-droite15'},
                {key: 'transi-swipe-droite16'},
                {key: 'transi-swipe-droite17'},
                {key: 'transi-swipe-droite18'},
                {key: 'transi-swipe-droite19'},
                {key: 'transi-swipe-droite20'},
                {key: 'transi-swipe-droite21'},
                {key: 'transi-swipe-droite22'},
                {key: 'transi-swipe-droite23'},
                {key: 'transi-swipe-droite24'},
                {key: 'transi-swipe-droite25'},
                {key: 'transi-swipe-droite26'},
                {key: 'transi-swipe-droite27'},
                {key: 'transi-swipe-droite28'},
                {key: 'transi-swipe-droite29'},
            ],
            frameRate: 30,
            repeat: 0
        });

        this.anims.create({
            key: 'transi-swipe-gauche',
            frames: [
                {key: 'transi-swipe-gauche0'},
                {key: 'transi-swipe-gauche1'},
                {key: 'transi-swipe-gauche2'},
                {key: 'transi-swipe-gauche3'},
                {key: 'transi-swipe-gauche4'},
                {key: 'transi-swipe-gauche5'},
                {key: 'transi-swipe-gauche6'},
                {key: 'transi-swipe-gauche7'},
                {key: 'transi-swipe-gauche8'},
                {key: 'transi-swipe-gauche9'},
                {key: 'transi-swipe-gauche10'},
                {key: 'transi-swipe-gauche11'},
                {key: 'transi-swipe-gauche12'},
                {key: 'transi-swipe-gauche13'},
                {key: 'transi-swipe-gauche14'},
                {key: 'transi-swipe-gauche15'},
                {key: 'transi-swipe-gauche16'},
                {key: 'transi-swipe-gauche17'},
                {key: 'transi-swipe-gauche18'},
                {key: 'transi-swipe-gauche19'},
                {key: 'transi-swipe-gauche20'},
                {key: 'transi-swipe-gauche21'},
                {key: 'transi-swipe-gauche22'},
                {key: 'transi-swipe-gauche23'},
                {key: 'transi-swipe-gauche24'},
                {key: 'transi-swipe-gauche25'},
                {key: 'transi-swipe-gauche26'},
                {key: 'transi-swipe-gauche27'},
                {key: 'transi-swipe-gauche28'},
                {key: 'transi-swipe-gauche29'},
            ],
            frameRate: 30,
            repeat: 0
        });

        if(this.sens == "gauche"){
            this.transi = this.add.sprite(gameScale.width/2, gameScale.height/2, 'transi-swipe-gauche0');
            this.transi.displayWidth = gameScale.width;
            this.transi.scaleY = this.transi.scaleX;
            this.transi.anims.play('transi-swipe-gauche');
            console.log("play transi gauche ");
        } else if(this.sens == "droite"){
            this.transi = this.add.sprite(gameScale.width/2, gameScale.height/2, 'transi-swipe-droite0');
            this.transi.displayWidth = gameScale.width;
            this.transi.scaleY = this.transi.scaleX;
            this.transi.anims.play('transi-swipe-droite');
            console.log("play transi droite");
        }

        this.transi.on('animationupdate', function (animation, frame) {
            if ((animation.key === 'transi-swipe-gauche' && frame.index === 18) || (animation.key === 'transi-swipe-droite' && frame.index === 18)) { 
                if(this.sceneToMove == "CabinetScene"){
                    this.scene.stop('FictiveGameScene');
                    this.scene.run('CabinetScene');
                    this.scene.bringToTop('ArmoireFictiveScene');
                } else if(this.sceneToMove == "FictiveGameScene"){
                    this.scene.stop('CabinetScene');
                    this.scene.run('FictiveGameScene');
                    this.scene.bringToTop('ArmoireFictiveScene');
                } else if(this.sceneToMove == "CabinetFromGameScene"){
                    this.scene.stop('GameScene');
                    this.scene.run('CabinetScene');
                    this.scene.bringToTop('ArmoireFictiveScene');
                }
            }
        }, this);

        this.transi.on('animationcomplete', function (animation) {          
            if (animation.key === 'transi-swipe-gauche' || animation.key === 'transi-swipe-droite') {
                console.log("transi finie, emit CAN_SWIPE");
                socket.emit("CAN_SWIPE", this.partie.roomId, this.partie.player.numeroPlayer);
                this.scene.stop('ArmoireFictiveScene');
            };
        }, this);
    }
}

export default ArmoireFictiveScene;