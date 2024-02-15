import Phaser from 'phaser';
import Player from './Player';

class Partie extends Phaser.Scene {
    constructor(scene, mode, roomId, player) {
        super(scene);
        // mode can be : "solo" "multi" or "libre". Others will don't work.

        // ATTRIBUTS
        this.mode = mode;
        this.player = player;
        this.customers = [];
        this.timeOver = false;
        this.errorMessage = "Tout est okay";
        this.roomId = roomId;
        this.scene = scene;
        this.tabBottles = []
        this.tabBottlesChoosed = [];
        this.goldBottleId = null;
        this.addCustomer = true;

        // switch (mode) {
        //     case "solo", "libre":
        //         this.players.push(player);
        //         break;
        //     case "multi":
        //         this.players.push(player);
        //         break;
        //     default : 
        //         this.errorMessage = "Le mode de jeu envoyé n'existe pas"
        // }
    }
}

export default Partie;