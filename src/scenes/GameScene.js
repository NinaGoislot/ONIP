import Phaser from 'phaser';
import Customer from '@/class/Customer'
import GameCanva from '@/canvas/GameCanva'
import {
    gameScale,
    socket
} from '../main.js';

const URL_PORTRAITS_CUSTOMERS = "./media/img/testPortraits/",
    NBR_PORTRAITS_CUSTOMERS = 3,
    URL_BOTTLES_CARTE = "./media/img/bouteilles-carte/normal/",
    URL_BOTTLES_CARTE_GOLD = "./media/img/bouteilles-carte/luxe/",
    BOTTLE_CARD_IMG_YSCALE = 0.25,
    BOTTLE_CARD_IMG_YSCALEAFTER = 0.02,
    BOTTLE_CARD_IMG_YSCALEAFTER_HEIGHT = 2,
    BOTTLE_CARD_IMG_XSCALE = 0.65,
    BOTTLE_CARD_GRID_NBR_ROW = 2,
    BOTTLE_CARD_GRID_NBR_COL_PLUS_1 = 4,
    BOTTLE_CARD_IMG_WIDTHSCALE = 0.085,
    BOTTLE_CARD_IMG_ANGLE = 2.5,
    BOTTLE_CARD_IMG_GAP_Y_BETWEEN = 0.11,
    BOTTLE_CARD_IMG_GAP_X_SECOND_ROW = 0.01*0.55,
    URL_COCKTAIL = "./media/img/cocktails-verre/"
    ;

class GameScene extends Phaser.Scene {

    constructor() {
        super({
            key: 'GameScene'
        });
    }

    preload() {
        this.load.image('bg-service', './media/img/ecran-service/bg-service.webp');
        this.load.image('bar-service', './media/img/ecran-service/bar-service.webp');
        this.load.image('carte-service', './media/img/ecran-service/carte.webp');
        this.load.image('shaker-service', './media/img/shaker/shaker-service.webp');
        //spritesheet clients
        this.imageClientKey = []
        this.load.spritesheet('client-1', './media/img/clients/gaetan.webp',{
            frameWidth:590,
            frameHeight:900,
            startFrame:0,
            endFrame:8
        });
        this.imageClientKey.push(`client-1`)
        this.load.spritesheet('client-2', './media/img/clients/line.webp',{
            frameWidth:540,
            frameHeight:900,
            startFrame:0,
            endFrame:8
        });
        this.imageClientKey.push(`client-2`)

        this.currentCustomer = this.game.registry.get('customerData') || null;

        this.imageKeys = [];
        // Définir le chemin de base pour les images
        this.load.path = URL_PORTRAITS_CUSTOMERS;
        // Charger les images une par une
        for (let i = 1; i <= NBR_PORTRAITS_CUSTOMERS; i++) {
            this.load.image(`portrait${i}`, `${i}.jpg`);
            this.imageKeys.push(`portrait${i}`);
        }

        //image bouteilles carte normale et luxe=gold
        this.bottlesData = this.game.registry.get('ingredients');
        this.bottleImgKeys = [];
        this.load.path = URL_BOTTLES_CARTE;
        for (let i = 1; i <= this.bottlesData.length; i++) {
            this.load.image(`carte-bouteille${i}`, `carte-bouteille${i}.webp`);
            this.bottleImgKeys.push(`carte-bouteille${i}`);
        }
        this.bottleGoldImgKeys = [];
        this.load.path = URL_BOTTLES_CARTE_GOLD;
        for (let i = 1; i <= this.bottlesData.length; i++) {
            this.load.image(`carte-luxe-bouteille${i}`, `carte-luxe-bouteille${i}.webp`);
            this.bottleGoldImgKeys.push(`carte-luxe-bouteille${i}`);
        }
        //image cocktails
        this.cocktailsData = this.game.registry.get('cocktails');
        this.cocktailImgKeys = [];
        this.load.path = URL_COCKTAIL;
        for (let i = 1; i <= 5; i++) {
            this.load.image(`cocktail${i}`, `cocktail${i}.webp`);
            this.cocktailImgKeys.push(`cocktail${i}`);
        }

        // Écouter l'événement de chargement complet
        this.load.on('complete', () => {
            console.log('Chargement des images complet');
        });
    }

    create() {
        this.rolePlayer = this.game.registry.get('rolePlayer');
        this.partie = this.game.registry.get('partie');
        this.emotions = this.game.registry.get('emotions');
        this.cocktails = this.game.registry.get('cocktails');
        this.ajoutClient = true;
        this.dataCustomer = [];

        // add background service to scene
        let background = this.add.image(gameScale.width / 2, gameScale.height / 2, 'bg-service');
        background.displayWidth = gameScale.width;
        background.displayHeight = gameScale.width / background.width * background.height;
        // background responsive
        window.addEventListener('resize', () => {
            background.displayWidth = gameScale.width;
            background.displayHeight = gameScale.width / background.width * background.height;
            background.setPosition(gameScale.width/2, gameScale.height/2)
        });

        if (this.currentCustomer === null) {

            // Création du canva 
            this.canva = new GameCanva(this, this.game.registry.get('score'));
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
                //this.currentCustomer = JSON.parse(currentCustomer);

                if (this.rolePlayer == 2) {
                    console.log("J2 reçoit bient l'info du socket");
                }

                this.currentCustomer = new Customer(this, 300, 300, this.findObjectById(this.emotions, currentCustomer[0]), this.findObjectById(this.cocktails, currentCustomer[1]), currentCustomer[2]);

                this.canva.customer = this.currentCustomer;
                this.canva.draw();

                //background comptoir du bar devant le client
                let backgroundBar = this.add.image(gameScale.width / 2, gameScale.height / 2, 'bar-service');
                backgroundBar.displayWidth = gameScale.width;
                backgroundBar.displayHeight = gameScale.width / backgroundBar.width * backgroundBar.height;
                window.addEventListener('resize', () => {
                    backgroundBar.displayWidth = gameScale.width;
                    backgroundBar.displayHeight = gameScale.width / backgroundBar.width * backgroundBar.height;
                    backgroundBar.setPosition(gameScale.width/2, gameScale.height/2)
                });
                
                this.drawShaker();

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

            let backgroundBar = this.add.image(gameScale.width / 2, gameScale.height / 2, 'bar-service');
            backgroundBar.displayWidth = gameScale.width;
            backgroundBar.displayHeight = gameScale.width / backgroundBar.width * backgroundBar.height;
            window.addEventListener('resize', () => {
                backgroundBar.displayWidth = gameScale.width;
                backgroundBar.displayHeight = gameScale.width / backgroundBar.width * backgroundBar.height;
                backgroundBar.setPosition(gameScale.width/2, gameScale.height/2)
            });

            console.log("GAME_SCENE : Score actuel dans le dataManager : ", this.game.registry.get('score'))
            this.canva.menuPauseButton(this.scene);
            this.showNextDialogue(this.currentCustomer.secondaryDialogues).then(() => {
                this.drawCocktailFinal();
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

                this.currentCustomer = new Customer(this, 300, 300, this.findObjectById(this.emotions, currentCustomer[0]), this.findObjectById(this.cocktails, currentCustomer[1]), currentCustomer[2]);
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
            this.add.text(gameScale.width * 0.8, gameScale.height * 0.1, 'Dernier client', {fontSize: '32px',fill: '#fff'});
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

    drawBottleCocktail(){
        let goldenBottle = this.goldBottle()
        // background de la carte
        let backgroundCard = this.add.image(gameScale.width, 0, 'carte-service').setOrigin(1,0);
        backgroundCard.displayHeight = gameScale.height;
        backgroundCard.displayWidth = gameScale.height / backgroundCard.height * backgroundCard.width;
        // responsive
        window.addEventListener('resize', ()=>{
            backgroundCard.displayHeight = gameScale.height;
            backgroundCard.displayWidth = gameScale.height / backgroundCard.height * backgroundCard.width;
            backgroundCard.setPosition(gameScale.width, 0)
        })
        // pour les bouteilles de la carte
        let posY = gameScale.height*BOTTLE_CARD_IMG_YSCALE;
        let k = 0;
        let maxK = this.currentCustomer.drink.ingredients.length
        let posX = gameScale.width*BOTTLE_CARD_IMG_XSCALE;
        for(let i=0; i<BOTTLE_CARD_GRID_NBR_ROW; i++){
            for(let j=1; j<BOTTLE_CARD_GRID_NBR_COL_PLUS_1;j++){
                let imageKey;
                let cocktailBottleImg = this.getBottleImg(this.currentCustomer.drink.ingredients[k].alcoholId)
                if(cocktailBottleImg.id == goldenBottle){
                    imageKey = this.bottleGoldImgKeys.find(image => image == `carte-luxe-bouteille`+goldenBottle);
                } else{
                    imageKey = this.bottleImgKeys.find(image => image == `carte-bouteille`+cocktailBottleImg.id);
                }
                //position et taille de l'image
                let bottleImg = this.add.image(posX, posY, imageKey)
                bottleImg.scaleX=1;
                bottleImg.displayWidth=gameScale.width*BOTTLE_CARD_IMG_WIDTHSCALE; 
                bottleImg.scaleY=bottleImg.scaleX
                bottleImg.angle = BOTTLE_CARD_IMG_ANGLE;
                //pour le responsive et la suite des boucles
                let bottleGapXSecondRow = 0
                let bottlePosition2Y2 = 0
                if(i==1){
                    bottleGapXSecondRow = BOTTLE_CARD_IMG_GAP_X_SECOND_ROW;
                    bottlePosition2Y2 = 2
                }
                //responsive
                window.addEventListener('resize', () => {
                    bottleImg.scaleX=1;
                    bottleImg.displayWidth=gameScale.width*BOTTLE_CARD_IMG_WIDTHSCALE; 
                    bottleImg.scaleY=bottleImg.scaleX
                    bottleImg.setPosition(gameScale.width*BOTTLE_CARD_IMG_XSCALE + gameScale.width*BOTTLE_CARD_IMG_GAP_Y_BETWEEN*(j-1) - gameScale.width*bottleGapXSecondRow, gameScale.height*BOTTLE_CARD_IMG_YSCALE*(i+1) + gameScale.height*BOTTLE_CARD_IMG_YSCALEAFTER*i + (gameScale.height*BOTTLE_CARD_IMG_YSCALEAFTER/BOTTLE_CARD_IMG_YSCALEAFTER_HEIGHT)*(j-1))
                });
                //pour la prochaine boucle
                posX = gameScale.width*BOTTLE_CARD_IMG_XSCALE + gameScale.width*BOTTLE_CARD_IMG_GAP_Y_BETWEEN*j - gameScale.width*bottleGapXSecondRow;
                posY = gameScale.height*BOTTLE_CARD_IMG_YSCALE*(i+1) + gameScale.height*BOTTLE_CARD_IMG_YSCALEAFTER*i + (gameScale.height*BOTTLE_CARD_IMG_YSCALEAFTER/BOTTLE_CARD_IMG_YSCALEAFTER_HEIGHT)*j;
                k +=1;
                if(k==maxK){
                    return;
                }
            }
            //pour la prochaine rangée
            posY = gameScale.height*BOTTLE_CARD_IMG_YSCALE*2 + gameScale.height*BOTTLE_CARD_IMG_YSCALEAFTER;
            posX = gameScale.width*BOTTLE_CARD_IMG_XSCALE - gameScale.width*BOTTLE_CARD_IMG_GAP_X_SECOND_ROW;
        }
    }

    drawCocktailFinal(){
        let cocktailKey = this.currentCustomer.drink;
        let imgKeyCocktail = this.cocktailImgKeys.find(image => image == `cocktail`+cocktailKey.id);
        let posX = gameScale.width*0.75
        let posY = gameScale.height*0.5
        let imgCocktail = this.add.image(posX, posY, imgKeyCocktail)
        imgCocktail.scaleX=1;
        imgCocktail.displayWidth=gameScale.width*0.5; 
        imgCocktail.scaleY=imgCocktail.scaleX
    }

    drawShaker(){
        let shakerService = this.add.image(gameScale.width*0.32, gameScale.height*0.83, 'shaker-service');
        shakerService.setScale(0.1);
        shakerService.displayWidth = gameScale.width * 0.17;
        shakerService.scaleY = shakerService.scaleX
        // shaker responsive
        window.addEventListener('resize', () => {
            shakerService.displayWidth = gameScale.width * 0.17;
            shakerService.scaleY = shakerService.scaleX
            shakerService.setPosition(gameScale.width*0.32, gameScale.height*0.83)
        });
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

        const emotion = this.emotions[Math.floor(Math.random() * this.game.registry.get('emotions').length)];
        const cocktail = this.cocktails[Math.floor(Math.random() * this.game.registry.get('cocktails').length)];

        this.dataCustomer = [emotion.id, cocktail.id, randomImageKey];

        //this.currentCustomer = new Customer(this, 300, 300, emotion, cocktail, randomImageKey);
    }

    getBottleImg(cocktailBottleId){
        let allBottles = this.game.registry.get('ingredients');
        if(cocktailBottleId==666){
            return allBottles[0]
        }
        return allBottles.find(bottle => bottle.id == cocktailBottleId)
    }

    goldBottle(){
        let allIdBottleCocktail = this.currentCustomer.drink.ingredients
        let GoldBottleId = Phaser.Math.RND.pick(allIdBottleCocktail)
        return GoldBottleId.alcoholId
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

                console.log("Je dois écrire la lettre '"+ displayedDialogue + "'")
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