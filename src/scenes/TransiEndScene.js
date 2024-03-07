import {
    gameScale
} from '../main.js';

class TransiEndScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'TransiEndScene'
        });
    }

    create() {
        this.anims.create({
            key: 'transi-end',
            frames: this.anims.generateFrameNumbers('transi-end', {
                start: 0,
                end: 29
            }),
            frameRate: 30,
            repeat: 0
        });

        this.transi = this.add.sprite(gameScale.width/2, gameScale.height/2, 'transi-end');
        this.transi.displayWidth = gameScale.width;
        this.transi.scaleY = this.transi.scaleX;
        this.transi.anims.play('transi-end');
        this.transiGameScene = this.sound.add('transiGameScene');
        this.transiGameScene.play();

        this.transi.on('animationupdate', function (animation, frame) {
            if (animation.key === 'transi-end' && frame.index === 18) { 
                this.scene.stop('GameScene');
                this.scene.run('EndScene');
                this.scene.bringToTop('TransiEndScene');
            }
        }, this);

        this.transi.on('animationcomplete', function (animation) {          
            if (animation.key === 'transi-end') {
                this.scene.stop('TransiEndScene');
            };
        }, this);
    }
}

export default TransiEndScene;