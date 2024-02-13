import Phaser from 'phaser';
import Customer from '@/class/Customer'
import GameCanva from '@/canvas/GameCanva'
import {
    gameScale,
    socket
} from '../main.js';

const URL_PORTRAITS_CUSTOMERS = "./media/img/testPortraits/",
    NBR_PORTRAITS_CUSTOMERS = 3,

    //Chemins vers les dossiers d'images du jeu
    URL_BOTTLES_CARTE = "./media/img/bouteilles-carte/normal/",
    URL_BOTTLES_CARTE_GOLD = "./media/img/bouteilles-carte/luxe/",
    URL_COCKTAIL = "./media/img/cocktails-verre/",

    //Responsive values
    BOTTLE_CARD_IMG_YSCALE = 0.25,
    BOTTLE_CARD_IMG_YSCALEAFTER = 0.03,
    BOTTLE_CARD_IMG_YSCALEAFTER_HEIGHT = 6,
    BOTTLE_CARD_IMG_XSCALE = 0.665,
    BOTTLE_CARD_GRID_NBR_ROW = 2,
    BOTTLE_CARD_GRID_NBR_COL_PLUS_1 = 4,
    BOTTLE_CARD_IMG_WIDTHSCALE = 0.095,
    BOTTLE_CARD_IMG_ANGLE = 2.27,
    BOTTLE_CARD_IMG_GAP_Y_BETWEEN = 0.11,
    BOTTLE_CARD_IMG_GAP_X_SECOND_ROW = 0.01 * 0.333;

class GameScene extends Phaser.Scene {

    constructor() {
        super({
            key: 'GameScene'
        });
    }

    preload() {
        this.imageClientKey = [];
        this.bottleImgKeys = [];
        this.bottleGoldImgKeys = [];
        this.cocktailImgKeys = [];
        this.assets = [];
        this.currentCustomer = this.game.registry.get('customerData') || null;
        this.bottlesData = this.game.registry.get('ingredients');
        this.cocktailsData = this.game.registry.get('cocktails');

        //Fonds du jeu
        this.load.image('bg-service', './media/img/ecran-service/bg-service.webp');
        this.load.image('bar-service', './media/img/ecran-service/bar-service.webp');
        this.load.image('carte-service', './media/img/ecran-service/carte.webp');
        this.load.image('shaker-service', './media/img/shaker/shaker-service.webp');
        this.assets.push(`bg-service`);
        this.assets.push(`bar-service`);
        this.assets.push(`carte-service`);
        this.assets.push(`shaker-service`);

        //Spritesheets clients
        this.load.spritesheet('client-1', './media/img/clients/gaetan.webp',{
            frameWidth:590,
            frameHeight:900,
            startFrame:0,
            endFrame:8
        });
        this.load.spritesheet('client-2', './media/img/clients/line.webp',{
            frameWidth:540,
            frameHeight:900,
            startFrame:0,
            endFrame:8
        });
        this.imageClientKey.push(`client-1`);
        this.imageClientKey.push(`client-2`);

        //Bouteilles normales et dorées
        this.load.path = URL_BOTTLES_CARTE;
        for (let i = 1; i <= this.bottlesData.length; i++) {
            this.load.image(`carte-bouteille${i}`, `carte-bouteille${i}.webp`);
            this.bottleImgKeys.push(`carte-bouteille${i}`);
        }
        this.load.path = URL_BOTTLES_CARTE_GOLD;
        for (let i = 1; i <= this.bottlesData.length; i++) {
            this.load.image(`carte-luxe-bouteille${i}`, `carte-luxe-bouteille${i}.webp`);
            this.bottleGoldImgKeys.push(`carte-luxe-bouteille${i}`);
        }
        this.load.path = URL_COCKTAIL;
        for (let i = 1; i <= 5; i++) {
            this.load.image(`cocktail${i}`, `cocktail${i}.webp`);
            this.cocktailImgKeys.push(`cocktail${i}`);
        }
        this.assets.push(this.bottleImgKeys);
        this.assets.push(this.bottleGoldImgKeys);
        this.assets.push(this.cocktailImgKeys);

        // Écouter l'événement de chargement complet
        this.load.on('complete', () => {
            console.log('Chargement des images complet');
        });
    }

    create() {       
        this.rolePlayer = this.game.registry.get('rolePlayer');
        this.partie = this.game.registry.get('partie');
        this.emotionsData = this.game.registry.get('emotions');
        this.ajoutClient = true;
        this.dataCustomer = [];

        this.canva = new GameCanva(this, this.game.registry.get('score'), this.assets, this.bottlesData, this.cocktailsData);
        this.canva.menuPauseButton(this.scene, this);

        if (this.currentCustomer === null) {

            this.canva.menuPauseButton(this.scene, this);

            //COMPTE A REBOURS
            this.rebours = this.add.text(gameScale.width * 0.5, gameScale.height * 0.5, "", {
                fontSize: '32px',
                fill: '#fff'
            })

            //afficher compte à rebours
            // const countdownPromise = new Promise((resolve) => {
            //     this.compteARebours(resolve);
            // });

            // Exécuter les autres fonctions une fois que la promesse est résolue
            // countdownPromise.then(() => {
            console.log("Le compte à rebours est terminé !");
            //Set un nombre de client pour la partie
            this.game.registry.set('nbrCustomers', 5);

            // Création du client
            if (this.rolePlayer == 1) {
                this.generateNewClient().then(() => {
                    console.log("J'ai créé un client : ", this.dataCustomer)
                    socket.emit("CREATE_FIRST_CUSTOMER", {
                        currentCustomer: this.dataCustomer,
                        idRoom: this.partie.roomId
                    });
                });
            }

            socket.on("RECEIVE_FIRST_CUSTOMER", (currentCustomer) => {
                console.log("Je rentre dans le emit du client")

                if (this.rolePlayer == 2) {
                    console.log("J2 reçoit bient l'info du socket");
                }

                this.currentCustomer = new Customer(this, 300, 300, this.findObjectById(this.emotionsData, currentCustomer[0]), this.findObjectById(this.cocktailsData, currentCustomer[1]), currentCustomer[2]);

                this.canva.customer = this.currentCustomer;
                this.canva.draw();

                // Fonction asynchrone pour afficher les dialogues successifs et ce qui se passe après
                this.showNextDialogue(this.currentCustomer.firstDialogues).then(() => {
                    this.showCabinetButton()
                });

                this.game.registry.set('nbrCustomers', this.game.registry.get('nbrCustomers') - 1);
                // Stocker les données du client et de la scène principale dans le registre global du jeu
                this.game.registry.set('customerData', this.currentCustomer);

            });

            // });

        } else {
            this.canva = new GameCanva(this, this.currentCustomer, this.game.registry.get('score'));

            console.log("GAME_SCENE : Score actuel dans le dataManager : ", this.game.registry.get('score'))
            this.canva.menuPauseButton(this.scene);
            this.showNextDialogue(this.currentCustomer.secondaryDialogues).then(() => {
                this.canva.drawCocktailFinal();
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

            //Tous les joueurs ont cliqués sur "Servir le client"
            socket.on("ALL_PLAYERS_READY_TO_SERVE", () => {
                this.readyText.setVisible(false);
                this.showFinalDialogue().then(() => {
                    if (this.game.registry.get('nbrCustomers') > 0 && this.ajoutClient == true) {
                        this.canva.remove();
                        if (this.rolePlayer == 1) {
                            this.generateNewClient().then(() => {
                                console.log("J'ai créé un client : ", this.dataCustomer)
                                socket.emit("CREATE_NEXT_CUSTOMER", {
                                    currentCustomer: this.dataCustomer,
                                    idRoom: this.partie.roomId
                                });
                            });
                        }
                    } else {
                        this.endGame();
                    }
                })
            });

            socket.on("RECEIVE_NEXT_CUSTOMER", (currentCustomer) => {
                console.log("Je rentre dans le emit du client n°2");

                this.currentCustomer = new Customer(this, 300, 300, this.findObjectById(this.emotionsData, currentCustomer[0]), this.findObjectById(this.cocktailsData, currentCustomer[1]), currentCustomer[2]);
                this.canva.customer = this.currentCustomer;

                setTimeout(() => {
                    console.log("Voici le client : ", this.currentCustomer);
                    console.log("Voici les dialogues que j'envoie : ", this.currentCustomer.firstDialogues);

                    this.canva.draw();
                    this.showNextDialogue(this.currentCustomer.firstDialogues).then(() => {
                        this.showCabinetButton();
                    });

                    this.game.registry.set('nbrCustomers', this.game.registry.get('nbrCustomers') - 1);
                    this.game.registry.set('customerData', this.currentCustomer);
                }, 2000);
            });
        }

        socket.on("GAME_PAUSED", (secondPaused) => {
            this.canva.startPause(this.scene, this, secondPaused);
        })

        socket.on("NOMORE_CLIENT", (peutPlus) => {
            this.ajoutClient = peutPlus;
            this.add.text(gameScale.width * 0.8, gameScale.height * 0.1, 'Dernier client', {
                fontSize: '32px',
                fill: '#fff'
            });
        })
    }

    // ************************************* FONCTIONS ************************************************

    compteARebours = (resolve) => {
        var duree = 3;
        var intervalId = setInterval(() => {
            if (duree <= 0) {
                clearInterval(intervalId);
                this.rebours.visible = false;
                resolve();
                return;
            }
            this.rebours.text = duree;
            duree--;
        }, 1000);
    }

    endGame() {
        socket.emit("GAME_OVER");
        this.game.registry.remove('customerData');
        this.game.registry.remove('nbrCustomers');
        this.scene.start('EndScene');
    }

    generateNewClient = async () => {
        // Choisir une image aléatoire du tableau
        const randomImageKey = Phaser.Math.RND.pick(this.imageClientKey);

        const emotion = this.emotionsData[Math.floor(Math.random() * this.emotionsData.length)];
        const cocktail = this.cocktailsData[Math.floor(Math.random() * this.cocktailsData.length)];

        this.dataCustomer = [emotion.id, cocktail.id, randomImageKey];

        //this.currentCustomer = new Customer(this, 300, 300, emotion, cocktail, randomImageKey);
    }

    openCabinet() {
        // Changement de scène vers la sélection des jus
        this.scene.start('CabinetScene');
    }

    playerChoiceCorrect() {
        const isCorrect = this.currentCustomer.drink.name === this.game.registry.get('playerJuiceChoice');

        if (isCorrect) {
            this.canva.updateScore(this.canva.score + 10)
        };
        this.game.registry.set('score', this.canva.score);

        return isCorrect;
    }

    serveCustomer() {
        this.currentCustomer.succeed = this.playerChoiceCorrect();
        console.log("Fonction serveCustomer(), la valeur de succeed est a ", this.currentCustomer.succeed);

        this.readyText = this.add.text(gameScale.width * 0.15, gameScale.height * 0.15, "Le joueur " + this.rolePlayer + " est prêt", {
            fontSize: '32px',
            fill: '#fff'
        })

        socket.emit("SET_PLAYER_READY", {
            playerId: this.partie.player.playerId,
            roomId: this.partie.roomId
        });
    }

    showCabinetButton() {
        // Affichage du bouton pour ouvrir l'armoire à jus / alcool
        const openCabinetButton = this.add.text(400, 400, 'Ouvrir l\'armoire à jus', {
            fontSize: '20px',
            fill: '#fff'
        });
        openCabinetButton.setInteractive();
        openCabinetButton.on('pointerdown', () => this.openCabinet());
        //afficher les boissons nécessaires
        this.drawBottleCocktail()
    }

    showNextDialogue = async (dialogue) => {
        this.canva.isTalking = true;

        for (let i = 0; i < dialogue.length; i++) {
            let currentDialogue = dialogue[i];
            this.canva.isTalking = "talk"
            for (let j = 0; j < currentDialogue.length; j++) {
                if (dialogue === this.currentCustomer.firstDialogues && currentDialogue == dialogue[dialogue.length - 1]) {
                    console.log("Je dois écrire le nom de la boisson à la fin de ce dialogue")
                    currentDialogue += this.currentCustomer.drink.name; // Ajouter le nom de la commande
                }
                let displayedDialogue = currentDialogue.substring(0, j + 1);

                console.log("Je dois écrire la lettre '" + displayedDialogue + "'")
                this.canva.updateDialogue(displayedDialogue); // Afficher les dialogues lettre par lettre

                // Attendre un court laps de temps avant d'afficher la prochaine lettre
                await new Promise(resolve => this.time.delayedCall(30, resolve));
            }
            this.canva.isTalking = "stop"
            console.log("pause ?", this.canva.isTalking)
            this.canva.animClientTalk(this.canva.isTalking)
            // Attendre 3 secondes après l'affichage complet du dialogue
            await new Promise(resolve => this.time.delayedCall(3000, resolve));
        }
        // this.canva.isTalking = "stop"
        // console.log("stop ?", this.canva.isTalking)
    }


    showFinalDialogue = async () => {
        const dialogue = this.currentCustomer.succeed ? this.currentCustomer.successDialogue : this.currentCustomer.failureDialogue;

        for (let i = 0; i < dialogue.length; i++) {
            let currentDialogue = dialogue[i];

            for (let j = 0; j < currentDialogue.length; j++) {
                let displayedDialogue = currentDialogue.substring(0, j + 1);

                this.canva.updateDialogue(displayedDialogue); // Afficher les dialogues lettre par lettre

                // Attendre un court laps de temps avant d'afficher la prochaine lettre
                await new Promise(resolve => this.time.delayedCall(50, resolve));
            }

            // Attendre 3 secondes après l'affichage complet du dialogue
            await new Promise(resolve => this.time.delayedCall(3000, resolve));
        }
    }

    wait = async (amount) => {
        await new Promise(resolve => this.time.delayedCall(amount, resolve));
    }

    findObjectById(objects, id) {
        const foundObject = objects.find(object => object.id == id);
        return foundObject;
    }
}

export default GameScene;