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
            frames: [
                {key: 'transi-verse-game0'},
                {key: 'transi-verse-game1'},
                {key: 'transi-verse-game2'},
                {key: 'transi-verse-game3'},
                {key: 'transi-verse-game4'},
                {key: 'transi-verse-game5'},
                {key: 'transi-verse-game6'},
                {key: 'transi-verse-game7'},
                {key: 'transi-verse-game8'},
                {key: 'transi-verse-game9'},
                {key: 'transi-verse-game10'},
                {key: 'transi-verse-game11'},
                {key: 'transi-verse-game12'},
                {key: 'transi-verse-game13'},
                {key: 'transi-verse-game14'},
                {key: 'transi-verse-game15'},
                {key: 'transi-verse-game16'},
                {key: 'transi-verse-game17'},
                {key: 'transi-verse-game18'},
                {key: 'transi-verse-game19'},
                {key: 'transi-verse-game20'},
                {key: 'transi-verse-game21'},
                {key: 'transi-verse-game22'},
                {key: 'transi-verse-game23'},
                {key: 'transi-verse-game24'},
                {key: 'transi-verse-game25'},
                {key: 'transi-verse-game26'},
                {key: 'transi-verse-game27'},
                {key: 'transi-verse-game28'},
                {key: 'transi-verse-game29'},
            ],
            frameRate: 30,
            repeat: 0
        });

        this.transi = this.add.sprite(gameScale.width/2, gameScale.height/2, 'transi-verse-game0');
        this.transi.displayWidth = gameScale.width;
        this.transi.scaleY = this.transi.scaleX;
        this.transi.anims.play('transi-verse-game');

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