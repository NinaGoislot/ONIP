import {
    gameScale, socket
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
        this.partie = this.game.registry.get('partie');
        this.anims.create({
            key: 'transi-verse',
            frames: this.anims.generateFrameNumbers('transi-verse', {
                start: 0,
                end: 29
            }),
            frameRate: 30,
            repeat: 0
        });

        this.transi = this.add.sprite(gameScale.width/2, gameScale.height/2, 'transi-verse');
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
                socket.emit("GO_TO_POUR", this.partie.roomId, this.partie.player.numeroPlayer);
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