import Phaser from 'phaser';


class Player extends Phaser.Scene {
    constructor(scene, pseudo, numeroPlayer, playerId) {
        super(scene);

        // Autres propriétés du joueur
        this.pseudo = pseudo;
        this.score = 0;
        this.numeroPlayer = numeroPlayer;
        this.playerId = playerId;
        this.scene = scene;

        this.nbGamePlayed = 0;
        this.nbGoldenBottles = 0;
        this.nbFirstCustomersServed = 0;
    }

    updateRequest(addPoints) {
            this.points += addPoints;
    }
}

export default Player;
