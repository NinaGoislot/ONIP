import Phaser from 'phaser';
import Customer from './../class/Customer'

class GameScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'GameScene'
        });
    }

    create() {
        // Ajouter le client avec sa bulle de dialogue
        this.customer = new Customer(this, 300, 300, 'Dieu', 'Bonjour je suis Dieu.');
        this.time.delayedCall(5000, () => {
            this.customer.updateRequest();
            this.showCabinetButton();
        });

        // Démarrer le chrono du jeu
        this.timer = this.time.delayedCall(45000, () => this.endGame(), [], this);
    }

    showCabinetButton() {
        // Affichage du bouton pour ouvrir l'armoire à jus / alcool
        const openCabinetButton = this.add.text(400, 400, 'Ouvrir l\'armoire à jus', {
            fontSize: '20px',
            fill: '#fff'
        });
        openCabinetButton.setInteractive();
        openCabinetButton.on('pointerdown', () => this.openCabinet());
    }

    openCabinet() {
        // Changement de scène vers la sélection des jus
        this.scene.start('CabinetScene');
    }

    endGame() {
        // Fin du jeu, changement de scène
        this.scene.start('EndScene');
    }
}

export default GameScene;