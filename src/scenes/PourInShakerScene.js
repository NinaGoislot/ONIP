import Phaser from 'phaser';
import Customer from '@/class/Customer'
import GameCanva from '@/canvas/GameCanva'
import {gameScale,socket} from '../main.js';

class PourInShakerScene extends Phaser.Scene {

    constructor() {
        super({
            key: 'PourInShakerScene'
        });
    }

    preload() {
        this.load.image('bg-shaker', './media/img/shaker/ecran-shaker-bg.webp');
        this.load.image('shaker-servir', './media/img/shaker/shaker-servir.webp');
    }

    create() {
        // add background service to scene
        let background = this.add.image(gameScale.width / 2, gameScale.height / 2, 'bg-shaker');
        background.displayWidth = gameScale.width;
        background.displayHeight = gameScale.width / background.width * background.height;
        // background responsive
        window.addEventListener('resize', () => {
            background.displayWidth = gameScale.width;
            background.displayHeight = gameScale.width / background.width * background.height;
            background.setPosition(gameScale.width/2, gameScale.height/2)
        });

        let shakerService = this.add.image(gameScale.width * 0.32, gameScale.height * 0.48, 'shaker-servir');
        shakerService.setScale(0.1);
        shakerService.displayWidth = gameScale.width * 0.355;
        shakerService.scaleY = shakerService.scaleX

        this.currentCustomer = this.game.registry.get('customerData');
        this.nbrBoucle = this.currentCustomer.drink.ingredients.length;
        this.partie = this.game.registry.get('partie');
        this.nbrBottleChoose = this.partie.player.nbrBottleChoosed;

        this.btnPlaySolo = this.add.text(200, 100, "Verser la boisson", { fontSize: '24px', fill: '#fff' })
        .setInteractive({ cursor: 'pointer' })
        .on('pointerover', () => this.btnPlaySolo.setTint(0x90ee90))
        .on('pointerout', () => this.btnPlaySolo.setTint(0xffffff));

        if(this.nbrBottleChoose == this.nbrBoucle){
            this.btnPlaySolo.on('pointerdown', () => this.openGameScene())
        } else{
            this.btnPlaySolo.on('pointerdown', () => this.openCabinet())
        }

        socket.on("GAME_PAUSED", (secondPaused) => {
            this.canva.startPause(this.scene, this, secondPaused);
        })

        socket.on("NOMORE_CLIENT", (peutPlus) => {
            this.ajoutClient = peutPlus;
            this.add.text(gameScale.width*0.8, gameScale.height*0.1, 'Dernier client', {fontSize: '32px',fill: '#fff'});
        })
    }

    openCabinet(){
        this.scene.start("CabinetScene");
    }

    openGameScene(){
        this.scene.start("GameScene");
    }
}

export default PourInShakerScene;