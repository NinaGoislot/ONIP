import {
    gameScale, socket
} from '../main.js';

class VerseArmoireScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'VerseArmoireScene'
        });
    }

    create() {
        this.partie = this.game.registry.get('partie');
        this.anims.create({
            key: 'transi-armoire',
            frames: this.anims.generateFrameNumbers('transi-armoire', {
                start: 0,
                end: 29
            }),
            frameRate: 30,
            repeat: 0
        });

        this.transi = this.add.sprite(gameScale.width/2, gameScale.height/2, 'transi-armoire');
        this.transi.displayWidth = gameScale.width;
        this.transi.scaleY = this.transi.scaleX;
        this.transi.anims.play('transi-armoire');
        this.transiSwipe2 = this.sound.add('transiSwipe2');
        this.transiSwipe2.play();

        this.transi.on('animationupdate', function (animation, frame) {
            if (animation.key === 'transi-armoire' && frame.index === 15) { 
                this.scene.stop("PourInShakerScene");
                this.scene.run("CabinetScene");
                this.scene.bringToTop('VerseArmoireScene');
                socket.emit("GO_TO_CABINET", this.partie.roomId, this.partie.player.numeroPlayer);
            }
        }, this);
        this.transi.on('animationcomplete', function (animation) {          
            if (animation.key === 'transi-armoire') {
                socket.emit("CAN_SWIPE", this.partie.roomId, this.partie.player.numeroPlayer);
                this.scene.stop('VerseArmoireScene');
            };
        }, this);
    }
}

export default VerseArmoireScene;