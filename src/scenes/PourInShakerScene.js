import Phaser from 'phaser';
import Customer from '@/class/Customer'
import GameCanva from '@/canvas/GameCanva'
import {
    gameScale,
    socket
} from '../main.js';

class PourInShakerScene extends Phaser.Scene {

    constructor() {
        super({
            key: 'PourInShakerScene'
        });
    }

    preload() {
        this.load.image('bg-service', './media/img/ecran-service/bg-service.webp');
    }

    create() {
        // add background service to scene
        let background = this.add.image(gameScale.width / 2, gameScale.height / 2, 'bg-service');
        background.displayWidth = gameScale.width;
        background.displayHeight = gameScale.width / background.width * background.height;
        // background responsive
        window.addEventListener('resize', () => {
            background.displayWidth = gameScale.width;
            background.displayHeight = gameScale.width / background.width * background.height;
            background.setPosition(gameScale.width/2, gameScale.height/2)
        });


        socket.on("GAME_PAUSED", (secondPaused) => {
            this.canva.startPause(this.scene, this, secondPaused);
        })

        socket.on("NOMORE_CLIENT", (peutPlus) => {
            this.ajoutClient = peutPlus;
            this.add.text(gameScale.width * 0.8, gameScale.height * 0.1, 'Dernier client', {fontSize: '32px',fill: '#fff'});
        })
    }
}

export default PourInShakerScene;