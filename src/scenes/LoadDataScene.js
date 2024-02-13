import 'phaser';
import {socket} from '../main.js';

class LoadDataScene extends Phaser.Scene {
    preload() {
        this.load.json('globalGameData', './data/data.json');
        this.load.audio('theme', './media/audio/BE-song.mp3');

        this.game.registry.set('connected', false);

        socket.on("CONNECTED", () => {
            console.log("Je recois l'info CONNECTED");
            this.game.registry.set('connected', true);
        });
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
       
        console.log(socket);

        // POUR LA MUSIQUE
        // this.load.audio('theme', './media/audio/BE-song.mp3');
        this.music = this.sound.add('theme');
        this.game.registry.set('music', this.music);
        //juste pour pas que la musique dérange pendant les tests..
        this.game.registry.get('music').pause();

        // Lancer la scène suivante (MenuScene dans cet exemple)
        this.scene.start('MenuScene');
    }
}

export default LoadDataScene;
