import {
    gameScale
} from '../main.js';

class StartScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'StartScene'
        });
    }

    create() {
        this.anims.create({
            key: 'transi-start',
            frames: this.anims.generateFrameNumbers('transi-start', {
                start: 0,
                end: 29
            }),
            frameRate: 30,
            repeat: 0
        });

        this.transi = this.add.sprite(gameScale.width/2, gameScale.height/2, 'transi-start');
        this.transi.displayWidth = gameScale.width;
        this.transi.scaleY = this.transi.scaleX;
        this.transi.anims.play('transi-start');
        this.transi.on('animationupdate', function (animation, frame) {
            if (animation.key === 'transi-start' && frame.index === 18) { 
                this.scene.stop('Step4_PseudoScene');
                this.scene.run('GameScene');
                this.scene.bringToTop('StartScene');
            }
        }, this);

        this.transi.on('animationcomplete', function (animation) {          
            if (animation.key === 'transi-start') {
                this.scene.stop('StartScene');
            };
        }, this);
    }
}

export default StartScene;