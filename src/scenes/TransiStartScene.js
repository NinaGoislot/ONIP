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
            frames: [
                {key: 'transi-start0'},
                {key: 'transi-start1'},
                {key: 'transi-start2'},
                {key: 'transi-start3'},
                {key: 'transi-start4'},
                {key: 'transi-start5'},
                {key: 'transi-start6'},
                {key: 'transi-start7'},
                {key: 'transi-start8'},
                {key: 'transi-start9'},
                {key: 'transi-start10'},
                {key: 'transi-start11'},
                {key: 'transi-start12'},
                {key: 'transi-start13'},
                {key: 'transi-start14'},
                {key: 'transi-start15'},
                {key: 'transi-start16'},
                {key: 'transi-start17'},
                {key: 'transi-start18'},
                {key: 'transi-start19'},
                {key: 'transi-start20'},
                {key: 'transi-start21'},
                {key: 'transi-start22'},
                {key: 'transi-start23'},
                {key: 'transi-start24'},
                {key: 'transi-start25'},
                {key: 'transi-start26'},
                {key: 'transi-start27'},
                {key: 'transi-start28'},
                {key: 'transi-start29'},
            ],
            frameRate: 30,
            repeat: 0
        });

        this.transi = this.add.sprite(gameScale.width/2, gameScale.height/2, 'transi-start0');
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