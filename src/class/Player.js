import Phaser from 'phaser';


class Player extends Phaser.GameObjects.Graphics {
    constructor(scene, pseudo, points) {
        super(scene);

        scene.add.existing(this);



        // Créer le point bleu
        this.fillStyle(0x0000FF, 1);
        this.fillCircle(0, 0, 20);


        // Autres propriétés du client
        this.name = name;
    }

    updateRequest(addPoints) {
            this.points += addPoints;
    }
}

export default Player;
