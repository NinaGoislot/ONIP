import {
    gameScale
} from '../main.js';

class VerseArmoireScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'VerseArmoireScene'
        });
    }

    create() {
        this.anims.create({
            key: 'transi-armoire',
            frames: [
                {key: 'transi-armoire0'},
                {key: 'transi-armoire1'},
                {key: 'transi-armoire2'},
                {key: 'transi-armoire3'},
                {key: 'transi-armoire4'},
                {key: 'transi-armoire5'},
                {key: 'transi-armoire6'},
                {key: 'transi-armoire7'},
                {key: 'transi-armoire8'},
                {key: 'transi-armoire9'},
                {key: 'transi-armoire10'},
                {key: 'transi-armoire11'},
                {key: 'transi-armoire12'},
                {key: 'transi-armoire13'},
                {key: 'transi-armoire14'},
                {key: 'transi-armoire15'},
                {key: 'transi-armoire16'},
                {key: 'transi-armoire17'},
                {key: 'transi-armoire18'},
                {key: 'transi-armoire19'},
                {key: 'transi-armoire20'},
                {key: 'transi-armoire21'},
                {key: 'transi-armoire22'},
                {key: 'transi-armoire23'},
                {key: 'transi-armoire24'},
                {key: 'transi-armoire25'},
                {key: 'transi-armoire26'},
                {key: 'transi-armoire27'},
                {key: 'transi-armoire28'},
                {key: 'transi-armoire29'},
            ],
            frameRate: 30,
            repeat: 0
        });

        this.transi = this.add.sprite(gameScale.width/2, gameScale.height/2, 'transi-armoire0');
        this.transi.displayWidth = gameScale.width;
        this.transi.scaleY = this.transi.scaleX;
        this.transi.on('animationupdate', function (animation, frame) {
            if (animation.key === 'transi-armoire' && frame.index === 15) { 
                this.scene.stop("PourInShakerScene");
                this.scene.run("CabinetScene");
                this.scene.bringToTop('VerseArmoireScene');
            }
        }, this);

        this.transi.anims.play('transi-armoire');
        this.transi.on('animationcomplete', function (animation) {          
            if (animation.key === 'transi-armoire') {
                this.scene.stop('VerseArmoireScene');
            };
        }, this);
    }
}

export default VerseArmoireScene;