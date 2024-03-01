import {
    gameScale
} from '../main.js';

class ArmoireVerseScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'ArmoireVerseScene'
        });
    }

    create(startData) {
        if (startData.bottleChoosed) {
            this.bottleChoosed = startData.bottleChoosed;
        } else {
            console.log("there is an error.")
        }
        this.anims.create({
            key: 'transi-verse',
            frames: [
                {key: 'transi-verse0'},
                {key: 'transi-verse1'},
                {key: 'transi-verse2'},
                {key: 'transi-verse3'},
                {key: 'transi-verse4'},
                {key: 'transi-verse5'},
                {key: 'transi-verse6'},
                {key: 'transi-verse7'},
                {key: 'transi-verse8'},
                {key: 'transi-verse9'},
                {key: 'transi-verse10'},
                {key: 'transi-verse11'},
                {key: 'transi-verse12'},
                {key: 'transi-verse13'},
                {key: 'transi-verse14'},
                {key: 'transi-verse15'},
                {key: 'transi-verse16'},
                {key: 'transi-verse17'},
                {key: 'transi-verse18'},
                {key: 'transi-verse19'},
                {key: 'transi-verse20'},
                {key: 'transi-verse21'},
                {key: 'transi-verse22'},
                {key: 'transi-verse23'},
                {key: 'transi-verse24'},
                {key: 'transi-verse25'},
                {key: 'transi-verse26'},
                {key: 'transi-verse27'},
                {key: 'transi-verse28'},
                {key: 'transi-verse29'},
            ],
            frameRate: 30,
            repeat: 0
        });

        this.transi = this.add.sprite(gameScale.width/2, gameScale.height/2, 'transi-verse0');
        this.transi.displayWidth = gameScale.width;
        this.transi.scaleY = this.transi.scaleX;
        this.transi.anims.play('transi-verse');
        this.transi.on('animationupdate', function (animation, frame) {
            if (animation.key === 'transi-verse' && frame.index === 15) { 
                console.log('this.bottleChoosed',this.bottleChoosed);
                this.scene.stop('CabinetScene');
                this.scene.run('PourInShakerScene', {
                    'bottleChoosed': this.bottleChoosed
                });
                this.scene.bringToTop('ArmoireVerseScene');
            }
        }, this);
        this.transi.on('animationcomplete', function (animation) {          
            if (animation.key === 'transi-verse') {
                console.log("Fin Armoire Verse");
                this.scene.stop('ArmoireVerseScene');
            };
        }, this);
    }
}

export default ArmoireVerseScene;