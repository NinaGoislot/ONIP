import 'phaser';

class LoadDataScene extends Phaser.Scene {
    preload() {
        this.load.json('globalGameData', './data/data.json');
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

        // Lancer la scène suivante (MenuScene dans cet exemple)
        this.scene.start('MenuScene');
    }
}

export default LoadDataScene;
