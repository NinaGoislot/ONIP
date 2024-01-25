import Phaser from 'phaser';
import Customer from './../class/Customer'
import GameCanva from './../canvas/GameCanva'

class GameScene extends Phaser.Scene {

    constructor() {
        super({
            key: 'GameScene'
        });
    }

    preload() {
        this.currentCustomer = this.game.registry.get('customerData') || null
    }

    create() {

        if (this.currentCustomer === null) {

            // Création du client 
            this.generateNewClient()
            this.canva = new GameCanva(this, this.currentCustomer);

            // Fonction asynchrone pour afficher les dialogues successifs
            const showNextDialogue = async () => {
                for (let i = 0; i < this.currentCustomer.firstDialogues.length; i++) {
                    this.canva.updateDialogue();

                    // Attendre 3 secondes avant le prochain dialogue
                    await new Promise(resolve => this.time.delayedCall(3000, resolve));
                }

                this.showCabinetButton();
            };

            // Démarrer l'affichage des dialogues
            showNextDialogue().then(() => {
                // Démarrer le chrono du jeu
                this.timer = this.time.delayedCall(45000, () => this.endGame(), [], this);
            });

            // Stocker les données du client et de la scène principale dans le registre global du jeu
            this.game.registry.set('customerData', this.currentCustomer);

        } else {
            this.canva = new GameCanva(this, this.currentCustomer);

            this.currentCustomer.succeed = this.playerChoiceCorrect();

            const showNextDialogue = async () => {
                    this.canva.updateDialogue();
                    // Attendre 3 secondes avant le prochain dialogue
                    await new Promise(resolve => this.time.delayedCall(3000, resolve));
            };

            showNextDialogue().then(() => {
                this.endGame();
            })

        }
    }
    
    endGame() {
        this.game.registry.remove('customerData');
        this.scene.start('EndScene');
    }

    generateNewClient() {
        const emotion = this.game.registry.get('emotions')[Math.floor(Math.random() * this.game.registry.get('emotions').length)];
        const cocktail = this.game.registry.get('cocktails')[Math.floor(Math.random() * this.game.registry.get('cocktails').length)];

        this.currentCustomer = new Customer(this, 300, 300, emotion, cocktail);
    } 

    playerChoiceCorrect(){
       const isCorrect = this.currentCustomer.drink.name === this.game.registry.get('playerJuiceChoice');
       return isCorrect;
    }

    openCabinet() {
        // Changement de scène vers la sélection des jus
        this.scene.start('CabinetScene');
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
}

export default GameScene;