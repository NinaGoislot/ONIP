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
            frames: this.anims.generateFrameNumbers('transi-swipe-droite', {
                start: 0,
                end: 29
            }),
            frameRate: 30,
            repeat: 0
        });
        this.anims.create({
            key: 'transi-swipe-gauche',
            frames: this.anims.generateFrameNumbers('transi-swipe-gauche', {
                start: 0,
                end: 29
            }),
            frameRate: 30,
            repeat: 0
        });

        if(this.sens == "gauche"){
            this.transi = this.add.sprite(gameScale.width/2, gameScale.height/2, 'transi-swipe-gauche');
            this.transi.displayWidth = gameScale.width;
            this.transi.scaleY = this.transi.scaleX;
            this.transi.anims.play('transi-swipe-gauche');
            console.log("play transi gauche ");
        } else if(this.sens == "droite"){
            this.transi = this.add.sprite(gameScale.width/2, gameScale.height/2, 'transi-swipe-droite');
            this.transi.displayWidth = gameScale.width;
            this.transi.scaleY = this.transi.scaleX;
            this.transi.anims.play('transi-swipe-droite');
            console.log("play transi droite");
        }
        this.transiGameScene = this.sound.add('transiGameScene');
        this.transiGameScene.play();

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