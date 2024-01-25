import Phaser from 'phaser';

class GameCanva extends Phaser.GameObjects.Graphics {
    constructor(scene, customer) {
        super(scene);
        scene.add.existing(this);

        // ATTRIBUTS
        this.customer = customer;
        this.scene = scene;

        this.draw();
    }

    // FONCTIONS

    draw() {
        // Créer le point bleu
        this.fillStyle(0x0000FF, 1);
        this.fillCircle(270, 270, 20);

        // Afficher la bulle de dialogue
        this.bubble = this.scene.add.text(300, 300 - 30, "", {
            fontSize: '16px',
            fill: '#fff'
        });
    }

    updateDialogue() {
        if (this.customer.dialogueIndex < this.customer.firstDialogues.length) {
            this.customer.currentDialogue = this.customer.firstDialogues[this.customer.dialogueIndex]; // Afficher le prochain dialogue

            if (this.customer.dialogueIndex == this.customer.firstDialogues.length -1) {
                this.customer.currentDialogue = this.customer.currentDialogue + this.customer.drink.name;
            }

            this.customer.dialogueIndex++;
            this.writeDialogue(this.customer.currentDialogue);
        } else if (this.customer.succeed != null) {
            if (this.customer.succeed) {
                this.writeDialogue(this.customer.successText);
            }
            else {
                this.writeDialogue(this.customer.failureText);
            }
        }
    }

    writeDialogue(dialogue) {
        this.bubble.setText(dialogue);
    }
}

export default GameCanva;
