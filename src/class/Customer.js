import Phaser from 'phaser';

let test;

class Customer extends Phaser.GameObjects.Graphics {
    constructor(scene, x, y, name, initialMessage, commandeMessage, juice) {
        super(scene);

        scene.add.existing(this);

        // Position du client
        this.x = x;
        this.y = y;

        // Créer le point bleu
        this.fillStyle(0x0000FF, 1);
        this.fillCircle(0, 0, 20);

        // Afficher la bulle de dialogue
        this.bubble = scene.add.text(x, y - 30, initialMessage, { fontSize: '16px', fill: '#fff' });

        // Autres propriétés du client
        this.name = name;
        this.request = commandeMessage;
        this.juice = juice;

        test = commandeMessage;
    }

    updateRequest() {
            this.request = test;
            this.bubble.setText(this.request);
    }
}

export default Customer;
