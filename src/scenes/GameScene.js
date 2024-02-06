import Phaser from 'phaser';
import Customer from '@/class/Customer'
import GameCanva from '@/canvas/GameCanva'

const URL_PORTRAITS_CUSTOMERS = "./media/img/testPortraits/", NBR_PORTRAITS_CUSTOMERS = 3;

class GameScene extends Phaser.Scene {

    constructor() {
        super({
            key: 'GameScene'
        });
    }

    preload() {
        this.currentCustomer = this.game.registry.get('customerData') || null;

        this.imageKeys = [];

        // Définir le chemin de base pour les images
        this.load.path = URL_PORTRAITS_CUSTOMERS;
    
        // Charger les images une par une
        for (let i = 1; i <= NBR_PORTRAITS_CUSTOMERS; i++) {
            this.load.image(`portrait${i}`, `${i}.jpg`);
            this.imageKeys.push(`portrait${i}`);
        }
    
        // Écouter l'événement de chargement complet
        this.load.on('complete', () => {
            console.log('Chargement des images complet');
        });
    }

    create() {

        if (this.currentCustomer === null) {

            //Set un nombre de client pour la partie
            this.game.registry.set('nbrCustomers', 5);

            // Création du client 
            this.generateNewClient()
            this.canva = new GameCanva(this, this.currentCustomer, this.game.registry.get('score'));

            // Fonction asynchrone pour afficher les dialogues successifs et ce qui se passe après
            this.showNextDialogue(this.currentCustomer.firstDialogues).then(() => {
                this.showCabinetButton();

                // Démarrer le chrono du jeu
                this.timer = this.time.delayedCall(45000, () => this.endGame(), [], this);
            });

            // Stocker les données du client et de la scène principale dans le registre global du jeu
            this.game.registry.set('customerData', this.currentCustomer);

        } else {
            this.canva = new GameCanva(this, this.currentCustomer, this.game.registry.get('score'));
            console.log("GAME_SCENE : Score actuel dans le dataManager : ", this.game.registry.get('score'))

            this.showNextDialogue(this.currentCustomer.secondaryDialogues).then(() => {
                const serviceButton = this.add.text(400, 400, 'Servir le client', {
                    fontSize: '20px',
                    fill: '#fff'
                });

                serviceButton.setInteractive();
                serviceButton.on('pointerdown', () => {
                    serviceButton.destroy();
                    this.serveCustomer();
                });
            });
        }
    }

    endGame() {
        this.game.registry.remove('customerData');
        this.game.registry.remove('nbrCustomers');
        this.scene.start('EndScene');
    }

    generateNewClient() {
        // Choisir une image aléatoire du tableau
        const randomImageKey = Phaser.Math.RND.pick(this.imageKeys);
        console.log(randomImageKey);

        const emotion = this.game.registry.get('emotions')[Math.floor(Math.random() * this.game.registry.get('emotions').length)];
        const cocktail = this.game.registry.get('cocktails')[Math.floor(Math.random() * this.game.registry.get('cocktails').length)];

        this.currentCustomer = new Customer(this, 300, 300, emotion, cocktail, randomImageKey);

        this.game.registry.set('nbrCustomers', this.game.registry.get('nbrCustomers') - 1);

    }

    playerChoiceCorrect() {
        const isCorrect = this.currentCustomer.drink.name === this.game.registry.get('playerJuiceChoice');

        if (isCorrect) {this.canva.updateScore(this.canva.score + 10)};
        this.game.registry.set('score', this.canva.score);

        return isCorrect;
    }

    openCabinet() {
        // Changement de scène vers la sélection des jus
        this.scene.start('CabinetScene');
    }

    serveCustomer() {
        this.currentCustomer.succeed = this.playerChoiceCorrect();
        this.showFinalDialogue().then(() => {
            if (this.game.registry.get('nbrCustomers') > 0) {
                this.canva.remove();
                this.generateNewClient();
                this.canva.customer = this.currentCustomer;

                this.wait(2000).then(() => {
                    this.canva.draw();
                    this.showNextDialogue(this.currentCustomer.firstDialogues).then(() => {
                        this.game.registry.set('customerData', this.currentCustomer);
                        this.showCabinetButton();
                    });
                })
            } else {
                this.endGame();
            }
        })
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

    showNextDialogue = async (dialogue) => {
        this.canva.customer.dialogueIndex = 0;
    
        for (let i = 0; i < dialogue.length; i++) {
            let currentDialogue = dialogue[i];

            for (let j = 0; j < currentDialogue.length; j++) {
                if (dialogue === this.currentCustomer.firstDialogues && currentDialogue == dialogue[dialogue.length -1]) {
                    currentDialogue += this.currentCustomer.drink.name; // Ajouter le nom de la commande
                }
                let displayedDialogue = currentDialogue.substring(0, j + 1);
                this.canva.updateDialogue(displayedDialogue); // Afficher les dialogues lettre par lettre
    
                // Attendre un court laps de temps avant d'afficher la prochaine lettre
                await new Promise(resolve => this.time.delayedCall(50, resolve));
            }
    
            // Attendre 3 secondes après l'affichage complet du dialogue
            await new Promise(resolve => this.time.delayedCall(3000, resolve));
        }
    }
    

    showFinalDialogue = async () => {
        this.canva.finalDialogue();

        // Attendre 3 secondes avant le prochain dialogue
        await new Promise(resolve => this.time.delayedCall(3000, resolve));
    }

    wait = async (amount) => {
        await new Promise(resolve => this.time.delayedCall(amount, resolve));
    }
}

export default GameScene;