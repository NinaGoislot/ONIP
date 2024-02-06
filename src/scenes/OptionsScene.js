import {gameScale,socket} from '../main.js';

class OptionsScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'OptionsScene'
        });
    }
    init(startData) {
        if (startData.isSolo) {
            this.isSolo = startData.isSolo;
            console.log(this.isSolo);
        } else {
            this.isSolo = false;
        }
    }
    preload() {
        this.load.html('volumeOp', './html/volumeOp.html');
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

        // Afficher les textes
        let menuTxt = this.add.text(gameScale.width * 0.1, gameScale.height * 0.1, 'Options', {fontSize: '32px',fill: '#fff'});
        this.volumeOptions = this.add.dom(gameScale.width * 0.35, gameScale.height * 0.6).createFromCache('volumeOp');
        this.volumeOptions.addListener('click');
        this.volumeRange = document.querySelector('#volume');

        this.btnBack = this.createButton(gameScale.width * 0.1, gameScale.height * 0.35, 'Back to menu', () => this.backToMenu());
        this.btnPause = this.createButton(gameScale.width * 0.1, gameScale.height * 0.5, 'Pause/Play music', () => this.pauseMusic());

        // changevolume(this.value)
        this.volumeRange.value = this.game.registry.get('music').volume;
        this.volumeRange.addEventListener("input", (event) => this.changevolume(event.target.value));
    }



    backToMenu() {
        this.scene.start('MenuScene');
    }

    createButton(x, y, text, onClick, isVisible = true, isEnable = true) {
        let button = this.add.text(x, y, text, {
                fontSize: '24px',
                fill: '#fff'
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

    changevolume(value) {
        let music = this.game.registry.get('music');
        music.setVolume(value);
        this.game.registry.set('music', music);
    }

    pauseMusic() {
        let music = this.game.registry.get('music');
        if (music.isPaused) {
            music.resume();
        } else if (music.isPlaying) {
            music.pause();
        }
        this.game.registry.set('music', music);
    }
}

export default OptionsScene;