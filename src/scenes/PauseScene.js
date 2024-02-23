import {
    gameScale,
    socket
} from '../main.js';

class PauseScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'PauseScene'
        });
    }
    init(data) {
        if (data.secondPaused) {
            this.secondPaused = data.secondPaused;
        } else {
            this.secondPaused = false;
        }
    }

    create() {
        // add background to scene
        let background = this.add.image(gameScale.width / 2, gameScale.height / 2, 'background');
        background.displayWidth = gameScale.width;
        background.displayHeight = gameScale.width / background.width * background.height;
        window.addEventListener('resize', () => {
            background.displayWidth = gameScale.width;
            background.displayHeight = gameScale.width / background.width * background.height;
            background.setPosition(gameScale.width / 2, gameScale.height / 2)
        });
        

        //Bouton resume game, seulement chez le joueur qui a appuyé sur pause
        if(!this.secondPaused){
            this.PauseButton = this.createButton(0,0,'RESUME', ()=>this.resumePause())
        }

        socket.on('GAME_RESUME',()=>{
            this.scene.stop('PauseScene');
            this.scene.resume(this.game.currentScene);
        })
    }

    resumePause() {
        let roomIdJoueur = this.game.registry.get('roomIdJoueur');
        socket.emit("RESUME", roomIdJoueur);
        this.scene.stop('PauseScene');
        this.scene.resume(this.game.currentScene);
    }

    createButton(x, y, text, onClick, isVisible = true, isEnable = true) {
        let button = this.add.text(x, y, text, {
                fill: '#252422',
                fontFamily:'soria', 
                fontSize: gameScale.width*0.03 + 'px'
            })
            .setInteractive({
                cursor: 'pointer'
            })
            .on('pointerdown', onClick)
            .on('pointerover', () => button.setTint(0x90ee90))
            .on('pointerout', () => button.setTint(0xffffff))
            .setVisible(isVisible);
        button.input.enabled = isEnable;
        return button;
    }
}

export default PauseScene;