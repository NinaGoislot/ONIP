import Phaser from 'phaser';

class partie extends Phaser.GameObjects.Graphics {
    constructor(scene, mode) {
        // mode can be : "solo" "multi" or "libre". Other will don't work.
        super(scene);
        scene.add.existing(this);

        // ATTRIBUTS
        this.mode = mode;
        this.players = [];
        this.timeOver = false;
        this.customers = [];
    }
}

export default Customer;
