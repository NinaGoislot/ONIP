import 'phaser';
import {socket} from '../main.js';

class LoadDataScene extends Phaser.Scene {
    preload() {
        this.load.json('globalGameData', './data/data.json');
        this.load.audio('theme', './media/audio/BE-song.mp3');
        socket.on("CONNECTED", () => {
            console.log("je suis connectée")
            this.game.registry.set('connected', true);
        });
        this.loadFont("soria", "./media/font/soria-font.ttf");
        this.loadFont("alpino", "./media/font/alpino-variable.ttf");
    }

    create() {
        // Accéder aux données depuis le cache
        const globalGameData = this.cache.json.get('globalGameData');

        // Stocker les données dans le registre du jeu
        this.game.registry.set('cocktails', globalGameData.cocktails);
        this.game.registry.set('ingredients', globalGameData.ingredients);
        this.game.registry.set('movements', globalGameData.movements);
        this.game.registry.set('emotions', globalGameData.emotions);
        this.game.registry.set('extras', globalGameData.extras);
        this.game.registry.set('score', 0);


        // POUR LA MUSIQUE
        // this.load.audio('theme', './media/audio/BE-song.mp3');
        this.music = this.sound.add('theme');
        this.game.registry.set('music', this.music);
        //juste pour pas que la musique dérange pendant les tests..
        this.game.registry.get('music').pause();

        // this.scale.startFullscreen();
        // Lancer la scène suivante (MenuScene dans cet exemple)
        this.scene.start('MenuScene');
    }

    loadFont(name, url) {
        var newFont = new FontFace(name, `url(${url})`);
        newFont.load().then(function (loaded) {
            document.fonts.add(loaded);
        }).catch(function (error) {
            return error;
        });
    }
}

export default LoadDataScene;
