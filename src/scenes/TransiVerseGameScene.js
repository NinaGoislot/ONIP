import {
    gameScale, socket
} from '../main.js';

class VerseGameScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'VerseGameScene'
        });
    }

    create() {
        this.partie = this.game.registry.get('partie');
        this.anims.create({
            key: 'transi-verse-game',
            frames: this.anims.generateFrameNumbers('transi-verse-game', {
                start: 0,
                end: 29
            }),
            frameRate: 30,
            repeat: 0
        });

        this.transi = this.add.sprite(gameScale.width/2, gameScale.height/2, 'transi-verse-game');
        this.transi.displayWidth = gameScale.width;
        this.transi.scaleY = this.transi.scaleX;
        this.transi.anims.play('transi-verse-game');
        this.transiSwipe2 = this.sound.add('transiSwipe2');
        this.transiSwipe2.play();
        this.transi.on('animationupdate', function (animation, frame) {
            if (animation.key === 'transi-verse-game' && frame.index === 18) { 
                this.scene.stop("CabinetScene");
                this.scene.stop("PourInShakerScene");
                this.scene.run("GameScene");
                this.scene.bringToTop('VerseGameScene');
                socket.emit("POURING_FINISHED", this.partie.roomId, this.partie.player.numeroPlayer);
            }
        }, this);

        this.transi.on('animationcomplete', function (animation) {          
            if (animation.key === 'transi-verse-game') {
                this.scene.stop('VerseGameScene');
            };
        }, this);
    }
}

export default VerseGameScene;