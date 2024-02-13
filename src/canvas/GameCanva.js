import Phaser from 'phaser';
import {
    socket
} from '../main.js';

class GameCanva extends Phaser.GameObjects.Graphics {
    constructor(scene, customer = {}, score = "0") {
        super(scene);
        scene.add.existing(this);

        // ATTRIBUTS
        this.customer = customer;
        this.scene = scene;
        this.score = score;

        this.draw();
    }

    // FONCTIONS

    draw() {
        // Créer l'image du client à la place du point bleu
        if (this.customer != {}) {
            this.clientImage = this.scene.add.image(270, 270, this.customer.picture);
            this.clientImage.setScale(0.1);
            this.clientImage.setVisible(true);
        }
        // Afficher la bulle de dialogue
        this.bubble = this.scene.add.text(350, 300 - 30, "", {
            fontSize: '16px',
            fill: '#fff'
        });

        this.displayScore = this.scene.add.text(20, 20, this.score, {
            fontSize: '16px',
            fill: '#fff'
        });
    }

    remove() {
        this.customer != {} ? this.clientImage.setVisible(false) : "";
        this.bubble.setVisible(false);
        this.displayScore.setVisible(false);
    }

    updateDialogue(currentDialogue) {
        this.bubble.setText(currentDialogue);
    }

    updateScore(score) {
        this.score = score;
        this.displayScore.setText(this.score)
    }

    //Obsolète ?
    writeDialogue(dialogue) {
        this.bubble.setText(dialogue);
    }

    menuPauseButton(scene, thos) {
        this.PauseButton = thos.add.text(0, 0, "PAUSE", {
                fontSize: '24px',
                fill: '#fff'
            })
            .setInteractive({
                cursor: 'pointer'
            })
            .on('pointerdown', () => this.startPause(scene, thos))
            .on('pointerover', () => this.PauseButton.setTint(0x90ee90))
            .on('pointerout', () => this.PauseButton.setTint(0xffffff))
    }

    startPause(scene, thos, secondPaused) {
        thos.game.currentScene = scene.key;

        let roomIdJoueur = thos.game.registry.get('roomIdJoueur');
        if (!secondPaused) {
            socket.emit("PAUSED", roomIdJoueur);
        }

        scene.pause()
        scene.launch('PauseScene', {
            'secondPaused': secondPaused
        });
    }
}

export default GameCanva;