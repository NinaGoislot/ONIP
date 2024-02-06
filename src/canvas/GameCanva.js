import Phaser from 'phaser';

class GameCanva extends Phaser.GameObjects.Graphics {
    constructor(scene, customer, score) {
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
        this.clientImage = this.scene.add.image(270, 270, this.customer.picture);
        this.clientImage.setScale(0.1);
        this.clientImage.setVisible(true);

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
        this.clientImage.setVisible(false);
        this.bubble.setVisible(false);
        this.displayScore.setVisible(false);
    }

    updateDialogue(dialogue) {
        this.customer.currentDialogue = dialogue; // Afficher le dialogue progressivement
        
        this.writeDialogue(this.customer.currentDialogue);
    }

    writeDialogue(dialogue) {
        this.bubble.setText(dialogue);
    }

    
    updateScore(score) {
        this.score = score;
        this.displayScore.setText(this.score)
    }

    finalDialogue() {
        if (this.customer.succeed != null) {
            if (this.customer.succeed) {
                this.writeDialogue(this.customer.successText);
            }
            else {
                this.writeDialogue(this.customer.failureText);
            }
        }
    }
}

export default GameCanva;
