import Phaser from 'phaser';
import Customer from '@/class/Customer'
import GameCanva from '@/canvas/GameCanva'
import TimerScene from '@/scenes/TimerScene'
import {
    gameScale,
    socket
} from '../main.js';

const
    //Chemins vers les dossiers d'images du jeu
    URL_BOTTLES_CARTE = "./media/img/bouteilles-carte/normal/",
    URL_BOTTLES_CARTE_GOLD = "./media/img/bouteilles-carte/luxe/",
    URL_COCKTAIL = "./media/img/cocktails-verre/",
    URL_MOVES = "./media/img/moves/",
    NB_MOVEMENTS = 8,

    //Responsive values
    BOTTLE_CARD_IMG_YSCALE = 0.25,
    BOTTLE_CARD_IMG_YSCALEAFTER = 0.02,
    BOTTLE_CARD_IMG_YSCALEAFTER_HEIGHT = 2,
    BOTTLE_CARD_IMG_XSCALE = 0.65,
    BOTTLE_CARD_GRID_NBR_ROW = 2,
    BOTTLE_CARD_GRID_NBR_COL_PLUS_1 = 4,
    BOTTLE_CARD_IMG_WIDTHSCALE = 0.085,
    BOTTLE_CARD_IMG_ANGLE = 2.5,
    BOTTLE_CARD_IMG_GAP_Y_BETWEEN = 0.11,
    BOTTLE_CARD_IMG_GAP_X_SECOND_ROW = 0.01 * 0.55;

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
        this.movementsImgKeys = [];
        this.currentCustomer = this.game.registry.get('customerData') || null;
        this.bottlesData = this.game.registry.get('ingredients');
        this.cocktailsData = this.game.registry.get('cocktails');
        this.movementsData = this.game.registry.get('movements');

        this.load.image('bg-service', './media/img/ecran-service/bg-service.webp');
        this.load.image('bar-service', './media/img/ecran-service/bar-service.webp');
        this.load.image('carte-service', './media/img/ecran-service/carte.webp');
        this.load.image('shaker-service', './media/img/shaker/shaker-service.webp');
        //spritesheet clients
        this.load.spritesheet('client-1', './media/img/clients/gaetan.webp', {
            frameWidth: 590,
            frameHeight: 900,
            startFrame: 0,
            endFrame: 8
        });
        this.load.spritesheet('client-2', './media/img/clients/line.webp', {
            frameWidth: 540,
            frameHeight: 900,
            startFrame: 0,
            endFrame: 8
        });
        this.imageClientKey.push(`client-1`);
        this.imageClientKey.push(`client-2`);

        //mouvements "prépare toi"
        this.load.spritesheet('prepare-toi', './media/img/mouvements/preparez-vous.webp', {
            frameWidth: 480,
            frameHeight: 270,
            startFrame: 0,
            endFrame: 21
        });

        //Chargement des images du jeu    
        this.load.path = URL_BOTTLES_CARTE;
        for (let i = 1; i <= this.bottlesData.length; i++) {
            this.load.image(`carte-bouteille${i}`, `carte-bouteille${i}.webp`);
            this.bottleImgKeys.push(`carte-bouteille${i}`);
        }
        this.game.registry.set('bottleImgKeys', this.bottleImgKeys);
        this.load.path = URL_BOTTLES_CARTE_GOLD;
        for (let i = 1; i <= this.bottlesData.length; i++) {
            this.load.image(`carte-luxe-bouteille${i}`, `carte-luxe-bouteille${i}.webp`);
            this.bottleGoldImgKeys.push(`carte-luxe-bouteille${i}`);
        }
        this.game.registry.set('bottleGoldImgKeys', this.bottleGoldImgKeys);
        this.load.path = URL_COCKTAIL;
        for (let i = 1; i <= this.cocktailsData.length; i++) {
            this.load.image(`cocktail${i}`, `cocktail${i}.webp`);
            this.cocktailImgKeys.push(`cocktail${i}`);
        }
        this.load.path = URL_MOVES;
        for (let i = 1; i <= NB_MOVEMENTS; i++) {
            this.load.image(`BOD${i}`, `BOD${i}.png`);
            this.movementsImgKeys.push(`BOD${i}`);
        }

        // Écouter l'événement de chargement complet
        this.load.on('complete', () => {
            console.log('Chargement des images complet');
        });
    }

    create() {
        this.rolePlayer = this.game.registry.get('rolePlayer');
        this.partie = this.game.registry.get('partie');
        this.emotionsData = this.game.registry.get('emotions');
        this.score = this.game.registry.get('score');
        // this.bottlesData = this.game.registry.get('ingredients');
        this.resizeListeners = [];
        this.dataCustomer = [];
        this.isSolo = this.partie.mode == "solo";
        this.aReadyText = false;

        if (this.currentCustomer === null) {

            // Création du canva 
            this.canva = new GameCanva(this, this.game.registry.get('score'));
            // this.drawGame();
            // this.canva.menuPauseButton(this.scene, this);
            //préparation affichage compte à rebours
            this.drawBackground();
            this.drawBarCounter();
            this.drawShaker();
            this.cameras.main.fadeIn(1000);
            this.shade = this.add.rectangle(gameScale.width / 2, gameScale.height / 2, gameScale.width, gameScale.height, 0x252422, 0.8).setOrigin(0.5, 0.5);
            //COMPTE A REBOURS
            this.rebours = this.add.text(gameScale.width * 0.5, gameScale.height * 0.5, "", {
                fill: '#EFECEA',
                fontFamily: 'alpino',
                fontSize: gameScale.width * 0.1 + 'px'
            }).setOrigin(0.5, 0.5);

            const resizeListener = () => {
                this.shade.setPosition(gameScale.width / 2, gameScale.height / 2);
                this.shade.displayWidth = gameScale.width;
                this.shade.displayHeight = gameScale.height;
                this.rebours.setFontSize(gameScale.width*0.1);
                this.rebours.setPosition(gameScale.width * 0.5, gameScale.height * 0.5);
            };
            window.addEventListener('resize', resizeListener);
            this.resizeListeners.push(resizeListener);


            //afficher compte à rebours
            const countdownPromise = new Promise((resolve) => {
                this.compteARebours(resolve);
            });



            // Exécuter les autres fonctions une fois que la promesse est résolue
            countdownPromise.then(() => {
                console.log("Le compte à rebours est terminé !", this.partie.player.pseudo, this.rolePlayer);
                //Set un nombre de client pour la partie
                this.game.registry.set('nbrCustomers', 5);
                // Ajout de TimerScene en tant que scène persistante
                // this.scene.add('TimerScene', TimerScene, true);
                // Création du client
                if (this.rolePlayer == 1) {
                    this.generateNewClient().then(() => {
                        console.log("J'ai créé un client : ", this.dataCustomer)
                        socket.emit("CREATE_FIRST_CUSTOMER", {
                            currentCustomer: this.dataCustomer,
                            idRoom: this.partie.roomId,
                        });
                    });
                }
            });

            socket.on("RECEIVE_FIRST_CUSTOMER", (currentCustomer) => {
                console.log("Je rentre dans le emit du client")
                console.log(this.partie.player.pseudo, this.rolePlayer);
                if (this.rolePlayer == 2) {
                    console.log("J2 reçoit bient l'info du socket");
                }

                this.currentCustomer = new Customer(this, 300, 300, this.findObjectById(this.emotionsData, currentCustomer[0]), this.findObjectById(this.cocktailsData, currentCustomer[1]), currentCustomer[2]);

                this.canva.customer = this.currentCustomer;

                this.partie.goldBottleId = currentCustomer[4];
                this.partie.tabBottles = currentCustomer[3];
                this.partie.liquids = [];
                this.goldBottleStatus = false;
                this.partie.tabBottlesChoosed = [];
                this.partie.tooLateToServe = false;
                this.game.registry.set('partie', this.partie);

                this.drawGame();
                this.resetPickedJuices();

                // Fonction asynchrone pour afficher les dialogues successifs et ce qui se passe après
                this.showNextDialogue(this.currentCustomer.firstDialogues).then(() => {
                    this.showCabinetButton();
                });

                this.game.registry.set('nbrCustomers', this.game.registry.get('nbrCustomers') - 1);
                // Stocker les données du client et de la scène principale dans le registre global du jeu
                this.game.registry.set('customerData', this.currentCustomer);

            });

        } else {
            this.stopMovement = false;
            this.canva = new GameCanva(this, this.currentCustomer, this.score);
            this.canva.menuPauseButton(this.scene);
            this.drawGame();
            this.removeShaker();
            console.log('this.partie.tooLateToServe', this.partie.tooLateToServe);
            if(!this.partie.tooLateToServe){
                this.showNextDialogue(this.currentCustomer.secondaryDialogues).then(() => {
                    console.log("Les dialogues du client sont terminés.")
                });
                //Demander de faire le premier mouvement
                this.indexMove = 0;
            } else {
                console.log("SET_PLAYER_READY si this.partie.tooLateToServe")
                socket.emit("SET_PLAYER_READY", {
                    playerId: this.partie.player.playerId,
                    roomId: this.partie.roomId
                });
            }

            // this.infoMovement = this.add.text(350, 350, "Mouvement attendu : n° " + this.currentCustomer.drink.movements[this.indexMove], {
            //     fontSize: '20px',
            //     fill: '#fff'
            // });
            // let button = this.add.text(gameScale.width * 0.1, gameScale.height * 0.48, 'Démarrer les mouvements', {
            //         fontSize: '24px',
            //         fill: '#fff'
            //     })
            //     .setInteractive({
            //         cursor: 'pointer'
            //     })
            //     .on('pointerdown', () => this.startMouvement())
            //     .on('pointerover', () => button.setTint(0x90ee90))
            //     .on('pointerout', () => button.setTint(0xffffff));

            //this.startMouvement();


            // ************************************* SOCKET ************************************************
            socket.on("MOBILE_READY", () => {
                console.log("Id à envoyer : ", this.currentCustomer.drink.movements[this.indexMove]);
                this.drawMovement(this.currentCustomer.drink.movements[0]);
                socket.emit("MOVEMENT_TO_DO", this.currentCustomer.drink.movements[0], this.partie.roomId, this.partie.player.numeroPlayer); //Premier mouvement
                this.startMouvement();
            });

            //Demander de faire les mouvements du cocktail
            socket.on("MOVEMENT_DONE", (score) => {
                console.log("Je rentre dans 'MOUVEMENT_DONE'");
                if(!this.stopMovement){
                    console.log("Je fais 'MOUVEMENT_DONE'");
                    this.score = this.score + score;
                    this.score = this.game.registry.set('score', this.score);

                    this.removeMovement();

                    this.indexMove++;
                    if (this.indexMove < this.currentCustomer.drink.movements.length) {
                        //this.infoMovement.setText("Nouveau mouvement attendu : n°  " + this.currentCustomer.drink.movements[this.indexMove]);
                        console.log("Id à envoyer : ", this.currentCustomer.drink.movements[this.indexMove]);
                        this.drawMovement(this.currentCustomer.drink.movements[this.indexMove]);
                        socket.emit("MOVEMENT_TO_DO", this.currentCustomer.drink.movements[this.indexMove], this.partie.roomId, this.partie.player.numeroPlayer);
                    } else {
                        console.log("les mouvements sont finis ?")
                        socket.emit("MOVEMENTS_FINISHED", this.partie.roomId, this.partie.player.numeroPlayer);
                    }
                }
            })

            socket.on("START_MOVEMENT", (movement, roomId, numeroPlayer) => {
                console.log("PHASER ► J'ai reçu le mouvement : ", movement);
            });

            //Tous les joueurs ont cliqués sur "Servir le client"
            socket.on("ALL_PLAYERS_READY_TO_SERVE", () => {
                console.log("ALL_PLAYERS_READY_TO_SERVE")
                if (this.aReadyText) {
                    this.aReadyText = false;
                }
                if(this.waitText){
                    console.log('this.waitText', this.waitText)
                    this.waitText.setVisible(false);
                }
                // this.showFinalDialogue().then(() => {
                    if (this.game.registry.get('nbrCustomers') > 0 && this.partie.addCustomer == true) {
                        this.canva.remove();
                        this.removeCocktailFinal();
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
                        console.log('en multi why endgame this.partie.addCustomer', this.partie.addCustomer)
                        this.endGame();
                    }
                // })
            });

            socket.on("RECEIVE_NEXT_CUSTOMER", (currentCustomer) => {
                console.log("Je rentre dans le emit du client n°2");

                this.currentCustomer = new Customer(this, 300, 300, this.findObjectById(this.emotionsData, currentCustomer[0]), this.findObjectById(this.cocktailsData, currentCustomer[1]), currentCustomer[2]);
                this.canva.customer = this.currentCustomer;

                this.partie.goldBottleId = currentCustomer[4];
                this.partie.tabBottles = currentCustomer[3];
                this.partie.liquids = [];
                this.goldBottleStatus = false;
                this.partie.tabBottlesChoosed = [];
                this.partie.tooLateToServe = false;
                this.game.registry.set('partie', this.partie);

                setTimeout(() => {
                    console.log("Voici le client : ", this.currentCustomer);
                    console.log("Voici les dialogues que j'envoie : ", this.currentCustomer.firstDialogues);

                    this.drawGame();
                    this.resetPickedJuices();
                    this.showNextDialogue(this.currentCustomer.firstDialogues).then(() => {
                        this.showCabinetButton();
                    });

                    this.game.registry.set('nbrCustomers', this.game.registry.get('nbrCustomers') - 1);
                    this.game.registry.set('customerData', this.currentCustomer);
                }, 2000);
            });

            socket.on("SERVE_CUSTOMER", () => {
                console.log("SERVE_CUSTOMER");
                if(this.aReadyText){
                    console.log("SERVE_CUSTOMER après un joueur + this.reboursFinal", this.reboursFinal);
                    this.reboursFinal.text = "";
                    this.reboursFinal.setVisible(false);
                    this.updateScoreFinal(this.dureeFinal);
                }
                this.drawCocktailFinal();
                this.serveCustomer();
            });
        }

        socket.on("SWIPE_CABINET", () => {
            this.openCabinet();
        });

        socket.on('JUICE_TAKEN', (bottleId, bottlesData) => {
            this.game.registry.set('ingredients', bottlesData);
            this.bottlesData = this.game.registry.get('ingredients');
        });

        socket.on('A_JUICE_IS_RETURNED', (bottlesData) => {
            this.game.registry.set('ingredients', bottlesData);
            this.bottlesData = this.game.registry.get('ingredients');
        });

        socket.on("GAME_PAUSED", (secondPaused) => {
            this.canva.startPause(this.scene, this, secondPaused);
        });

        socket.on("NOMORE_CLIENT", (peutPlus) => {
            this.partie.addCustomer = peutPlus;
            this.game.registry.set('partie', this.partie);
        });

        socket.on("FIRST_TO_SERVE", () => {
            if(!this.aReadyText){
                console.log('premier à servir +1000');
                this.partie.player.score += 1000;
                this.game.registry.set('partie', this.partie);
            }
        });

        socket.on("A_PLAYER_READY", () => {
            console.log('Sur GameScene, décompte de 5 secondes');
            this.reboursFinal = this.add.text(gameScale.width * 0.5, gameScale.height * 0.1, "", {
                fill: '#EFECEA',
                fontFamily: 'alpino',
                fontSize: gameScale.width * 0.03 + 'px'
            });
            this.aReadyText = true;
            this.dureeFinal = 0;
        });

        socket.on("COUNTDOWN_TO_SERVE", (duree)=>{
            if(this.aReadyText){
                if(duree == 1){
                    this.reboursFinal.text = "Il te reste " + duree + " seconde";
                } else{
                    this.reboursFinal.text = "Il te reste " + duree + " secondes";
                }
                this.dureeFinal = duree;
            }
        });

        socket.once("COUNTDOWN_TO_SERVE_FINISHED", ()=>{
            console.log('countdwon finished this.aReadyText', this.aReadyText)
            if(this.aReadyText){
                console.log("countdown finished + SET_PLAYER_READY");
                this.reboursFinal.text = "";
                this.reboursFinal.setVisible(false);
                socket.emit("SET_PLAYER_READY", {
                    playerId: this.partie.player.playerId,
                    roomId: this.partie.roomId
                });
                socket.emit("STOP_MOVEMENT", this.partie.roomId, this.partie.player.numeroPlayer);
                this.stopMovement = true;
                this.aReadyText = false;
            }
        });
    }

    // ************************************* FONCTIONS ************************************************

    compteARebours = (resolve) => {
        var duree = 5;
        var intervalId = setInterval(() => {
            this.rebours.text = duree - 2;
            if (duree <= 0) {
                clearInterval(intervalId);
                this.rebours.setVisible(false);
                this.rebours.text = "";
                resolve();
                return;
            }
            if (duree == 1) {
                this.rebours.text = "";
            }
            if (duree == 2) {
                this.tweens.add({
                    targets: this.shade,
                    alpha: 0,
                    duration: 2000,
                    onComplete: function () {
                        this.shade.destroy();
                    }.bind(this),
                    onCompleteScope: this
                });
                this.rebours.text = "";
            }
            duree--;
        }, 1000);
    }

    endGame() {
        console.log("fin du jeu");
        socket.emit("GAME_OVER");
        this.game.registry.remove('customerData');
        this.game.registry.remove('nbrCustomers');
        this.scene.start('EndScene');
    }

    findObjectById(objects, id) {
        const foundObject = objects.find(object => object.id == id);
        return foundObject;
    }

    generateNewClient = async () => {
        // Choisir une image aléatoire du tableau
        const randomImageKey = Phaser.Math.RND.pick(this.imageClientKey);

        const emotion = this.emotionsData[Math.floor(Math.random() * this.emotionsData.length)];
        const cocktail = this.cocktailsData[Math.floor(Math.random() * this.cocktailsData.length)];

        const currentCocktail = this.findObjectById(this.cocktailsData, cocktail.id)
        const goldBottle = this.goldBottle(currentCocktail);

        const indicesTabBottle = this.generateRandomIndices(this.bottlesData.length);

        this.dataCustomer = [emotion.id, cocktail.id, randomImageKey, indicesTabBottle, goldBottle];

        //this.currentCustomer = new Customer(this, 300, 300, emotion, cocktail, randomImageKey);
    }

    generateRandomIndices(tabLength) {
        var indices = Array.from({
            length: tabLength
        }, (_, index) => index + 1);
        // Mélanger le tableau de manière aléatoire
        for (var i = indices.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            [indices[i], indices[j]] = [indices[j], indices[i]];
        }
        return indices;
    }

    getBottleImg(cocktailBottleId) {
        if (cocktailBottleId == 666) {
            return this.bottlesData[0]
        }
        return this.bottlesData.find(bottle => bottle.id == cocktailBottleId)
    }

    goldBottle(currentCocktail) {
        let allIdBottleCocktail = currentCocktail.ingredients
        let goldBottleId = Phaser.Math.RND.pick(allIdBottleCocktail)
        return goldBottleId.alcoholId
    }

    openCabinet() {
        // Changement de scène vers la sélection des jus
        this.canva.removeResizeListeners();
        this.removeResizeListeners();
        console.log(this.scene.getStatus('GameScene'), this.scene.isActive('GameScene'))
        console.log(this.scene.getStatus('CabinetScene'), this.scene.isActive('CabinetScene'))
        this.removeSocket();
        this.scene.stop('GameScene');
        this.scene.run('CabinetScene');
    }

    playerChoiceCorrect() {
        const isCorrect = this.currentCustomer.drink.name === this.game.registry.get('playerJuiceChoice');
        if (isCorrect) {
            this.canva.updateScore(this.canva.score + 10)
        };
        this.game.registry.set('score', this.canva.score);
        return isCorrect;
    }

    removeResizeListeners() {
        this.resizeListeners.forEach(listener => {
            window.removeEventListener('resize', listener);
        });
    }

    removeSocket() {
        socket.removeAllListeners("RECEIVE_FIRST_CUSTOMER");
        socket.removeAllListeners("MOBILE_READY");
        socket.removeAllListeners("MOVEMENT_DONE");
        socket.removeAllListeners("START_MOVEMENT");
        socket.removeAllListeners("ALL_PLAYERS_READY_TO_SERVE");
        socket.removeAllListeners("RECEIVE_NEXT_CUSTOMER");
        socket.removeAllListeners("SERVE_CUSTOMER");
        socket.removeAllListeners("SWIPE_CABINET");
        socket.removeAllListeners("JUICE_TAKEN");
        socket.removeAllListeners("A_JUICE_IS_RETURNED");
        socket.removeAllListeners("GAME_PAUSED");
        socket.removeAllListeners("NOMORE_CLIENT");
        socket.removeAllListeners("FIRST_TO_SERVE");
        socket.removeAllListeners("A_PLAYER_READY");
        socket.removeAllListeners("COUNTDOWN_TO_SERVE");
        socket.removeAllListeners("COUNTDOWN_TO_SERVE_FINISHED");
    }

    resetPickedJuices() {
        for (let i = 0; i < this.bottlesData.length; i++) {
            this.bottlesData[i].picked = false
        }
        this.game.registry.set('ingredients', this.bottlesData);
    }

    serveCustomer() {
        // this.currentCustomer.succeed = this.playerChoiceCorrect();
        this.currentCustomer.succeed = true;
        console.log("Fonction serveCustomer(), la valeur de succeed est a ", this.currentCustomer.succeed);
        if (!this.isSolo) {
            // console.log("clique pour servir", this.partie.player.playerId, this.partie.roomId);
            console.log("le joueur attend l'autre avec SET_PLAYER_READY")
            socket.emit("SET_PLAYER_READY", {
                playerId: this.partie.player.playerId,
                roomId: this.partie.roomId
            });
            this.showFinalDialogue().then(() => {
                if(!this.aReadyText){
                    this.waitText = this.add.text(gameScale.width * 0.5, gameScale.height * 0.1, "En attente de l'autre joueur", {
                        fill: '#EFECEA',
                        fontFamily: 'alpino',
                        fontSize: gameScale.width * 0.03 + 'px'
                    });
                }

            });
        } else {
            this.showFinalDialogue().then(() => {
                if (this.game.registry.get('nbrCustomers') > 0 && this.partie.addCustomer == true) {
                    this.canva.remove();
                    this.removeCocktailFinal();
                    if (this.rolePlayer == 1) {
                        this.generateNewClient().then(() => {
                            this.currentCustomer = new Customer(this, 300, 300, this.findObjectById(this.emotionsData, this.dataCustomer[0]), this.findObjectById(this.cocktailsData, this.dataCustomer[1]), this.dataCustomer[2]);
                            this.canva.customer = this.currentCustomer;

                            this.partie.goldBottleId = this.dataCustomer[4];
                            this.partie.tabBottles = this.dataCustomer[3];
                            console.log('test tabbottle', this.partie.tabBottles, this.partie.goldBottleId);
                            this.partie.liquids = [];
                            this.goldBottleStatus = false;
                            this.partie.tabBottlesChoosed = [];
                            this.partie.tooLateToServe = false;
                            this.game.registry.set('partie', this.partie);

                            setTimeout(() => {
                                console.log("Voici le client : ", this.currentCustomer);
                                console.log("Voici les dialogues que j'envoie : ", this.currentCustomer.firstDialogues);

                                this.drawGame();
                                this.resetPickedJuices();
                                this.showNextDialogue(this.currentCustomer.firstDialogues).then(() => {
                                    this.showCabinetButton();
                                });

                                this.game.registry.set('nbrCustomers', this.game.registry.get('nbrCustomers') - 1);
                                this.game.registry.set('customerData', this.currentCustomer);
                            }, 2000);
                        });
                    }


                } else {
                    this.endGame();
                }
            })
        }
    }

    showCabinetButton() {
        // Affichage du bouton pour ouvrir l'armoire à jus / alcool

        // const openCabinetButton = this.add.text(400, 400, 'Ouvrir l\'armoire à jus', {
        //     fontSize: '20px',
        //     fill: '#fff'
        // });
        // openCabinetButton.setInteractive();
        // openCabinetButton.on('pointerdown', () => this.openCabinet());

        //afficher les boissons nécessaires
        this.drawcard();
        this.drawBottleCocktail();
        console.log("Je dois faire l'emit du cabinet bouton");

        socket.emit("CABINET_SWIPE_ON", this.partie.roomId, this.partie.player.numeroPlayer);
    }

    showNextDialogue = async (dialogue) => {
        for (let i = 0; i < dialogue.length; i++) {
            let currentDialogue = dialogue[i];
            this.canva.isTalking = "talk"
            for (let j = 0; j < currentDialogue.length; j++) {
                if (dialogue === this.currentCustomer.firstDialogues && currentDialogue == dialogue[dialogue.length - 1]) {
                    console.log("Je dois écrire le nom de la boisson à la fin de ce dialogue")
                    currentDialogue += this.currentCustomer.drink.name; // Ajouter le nom de la commande
                }
                let displayedDialogue = currentDialogue.substring(0, j + 1);
                // console.log("Je dois écrire la lettre '"+ displayedDialogue + "'")
                this.canva.updateDialogue(displayedDialogue); // Afficher les dialogues lettre par lettre
                // Attendre un court laps de temps avant d'afficher la prochaine lettre
                await new Promise(resolve => this.time.delayedCall(30, resolve));
            }
            this.canva.isTalking = "stop"
            this.canva.animClientTalk(this.canva.isTalking)
            // Attendre 3 secondes après l'affichage complet du dialogue
            await new Promise(resolve => this.time.delayedCall(3000, resolve));
        }
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

    startMouvement() {
        console.log("Je rentre dans le start du mouvement");
        socket.emit("MOVEMENT_TO_DO", this.currentCustomer.drink.movements[0], this.partie.roomId, this.partie.player.numeroPlayer); //Premier mouvement
    }

    updateScoreFinal(duree){
        console.log('duree score', duree, this.partie.player.score);
        if(duree == 5){
            this.partie.player.score += 800;
        } else if(duree == 4){
            this.partie.player.score += 700;
        } else if(duree == 3){
            this.partie.player.score += 600;
        } else if(duree == 2){
            this.partie.player.score += 400;
        } else if(duree == 1){
            this.partie.player.score += 200;
        } else if(duree == 0){
            this.partie.player.score -= 100;
        }
        console.log('score', this.partie.player.score);
        this.game.registry.set('partie', this.partie);
    }

    wait = async (amount) => {
        await new Promise(resolve => this.time.delayedCall(amount, resolve));
    }


    // ************************************* DRAW ************************************************
    // ---- Dessine tous les visuels du jeu
    drawGame() {
        this.drawBackground();
        this.canva.draw();
        this.drawBarCounter();
        this.drawShaker();
    }
    // ------------------------------------

    drawBackground() {
        this.background = this.add.image(gameScale.width / 2, gameScale.height / 2, 'bg-service');
        this.background.displayWidth = gameScale.width;
        this.background.displayHeight = gameScale.width / this.background.width * this.background.height;

        window.addEventListener('resize', () => {
            this.background.displayWidth = gameScale.width;
            this.background.displayHeight = gameScale.width / this.background.width * this.background.height;
            this.background.setPosition(gameScale.width / 2, gameScale.height / 2);
        });
    }

    drawBarCounter() {
        this.backgroundBar = this.add.image(gameScale.width / 2, gameScale.height / 2, 'bar-service');
        this.backgroundBar.displayWidth = gameScale.width;
        this.backgroundBar.displayHeight = gameScale.width / this.backgroundBar.width * this.backgroundBar.height;

        window.addEventListener('resize', () => {
            this.backgroundBar.displayWidth = gameScale.width;
            this.backgroundBar.displayHeight = gameScale.width / this.backgroundBar.width * this.backgroundBar.height;
            this.backgroundBar.setPosition(gameScale.width / 2, gameScale.height / 2);
        });
    }

    drawcard() {
        this.backgroundCard = this.add.image(gameScale.width, 0, 'carte-service').setOrigin(1, 0);
        this.backgroundCard.displayHeight = gameScale.height;
        this.backgroundCard.displayWidth = gameScale.height / this.backgroundCard.height * this.backgroundCard.width;

        window.addEventListener('resize', () => {
            this.backgroundCard.displayHeight = gameScale.height;
            this.backgroundCard.displayWidth = gameScale.height / this.backgroundCard.height * this.backgroundCard.width;
            this.backgroundCard.setPosition(gameScale.width, 0);
        });
    }

    drawShaker() {
        this.shakerService = this.add.image(gameScale.width * 0.32, gameScale.height * 0.83, 'shaker-service');
        this.shakerService.setScale(0.1);
        this.shakerService.displayWidth = gameScale.width * 0.17;
        this.shakerService.scaleY = this.shakerService.scaleX;
        window.addEventListener('resize', () => {
            this.shakerService.displayWidth = gameScale.width * 0.17;
            this.shakerService.scaleY = this.shakerService.scaleX;
            this.shakerService.setPosition(gameScale.width * 0.32, gameScale.height * 0.83);
        });
    }

    removeShaker() {
        this.shakerService.setVisible(false);
    }

    drawBottleCocktail() {
        let goldenBottle = this.partie.goldBottleId;
        let posY = gameScale.height * BOTTLE_CARD_IMG_YSCALE;
        let posX = gameScale.width * BOTTLE_CARD_IMG_XSCALE;
        let k = 0; //index
        let maxK = this.currentCustomer.drink.ingredients.length //Nombre de bouteilles dans le cocktail

        for (let i = 0; i < BOTTLE_CARD_GRID_NBR_ROW; i++) {
            for (let j = 1; j < BOTTLE_CARD_GRID_NBR_COL_PLUS_1; j++) {
                let imageKey;
                let cocktailBottleImg = this.getBottleImg(this.currentCustomer.drink.ingredients[k].alcoholId)
                cocktailBottleImg.id == goldenBottle ? imageKey = this.bottleGoldImgKeys.find(image => image == `carte-luxe-bouteille` + goldenBottle) : imageKey = this.bottleImgKeys.find(image => image == `carte-bouteille` + cocktailBottleImg.id);

                let bottleImg = this.add.image(posX, posY, imageKey)
                bottleImg.scaleX = 1;
                bottleImg.displayWidth = gameScale.width * BOTTLE_CARD_IMG_WIDTHSCALE;
                bottleImg.scaleY = bottleImg.scaleX
                bottleImg.angle = BOTTLE_CARD_IMG_ANGLE;

                //pour le responsive et la suite des boucles
                let bottleGapXSecondRow = 0;
                let bottlePosition2Y2 = 0;
                if (i == 1) {
                    bottleGapXSecondRow = BOTTLE_CARD_IMG_GAP_X_SECOND_ROW;
                    bottlePosition2Y2 = 2;
                }

                window.addEventListener('resize', () => {
                    bottleImg.scaleX = 1;
                    bottleImg.displayWidth = gameScale.width * BOTTLE_CARD_IMG_WIDTHSCALE;
                    bottleImg.scaleY = bottleImg.scaleX
                    bottleImg.setPosition(gameScale.width * BOTTLE_CARD_IMG_XSCALE + gameScale.width * BOTTLE_CARD_IMG_GAP_Y_BETWEEN * (j - 1) - gameScale.width * bottleGapXSecondRow, gameScale.height * BOTTLE_CARD_IMG_YSCALE * (i + 1) + gameScale.height * BOTTLE_CARD_IMG_YSCALEAFTER * i + (gameScale.height * BOTTLE_CARD_IMG_YSCALEAFTER / BOTTLE_CARD_IMG_YSCALEAFTER_HEIGHT) * (j - 1))
                });

                //pour la prochaine boucle
                posX = gameScale.width * BOTTLE_CARD_IMG_XSCALE + gameScale.width * BOTTLE_CARD_IMG_GAP_Y_BETWEEN * j - gameScale.width * bottleGapXSecondRow;
                posY = gameScale.height * BOTTLE_CARD_IMG_YSCALE * (i + 1) + gameScale.height * BOTTLE_CARD_IMG_YSCALEAFTER * i + (gameScale.height * BOTTLE_CARD_IMG_YSCALEAFTER / BOTTLE_CARD_IMG_YSCALEAFTER_HEIGHT) * j;
                k += 1;
                if (k == maxK) {
                    return;
                }
            }
            //pour la prochaine rangée
            posY = gameScale.height * BOTTLE_CARD_IMG_YSCALE * 2 + gameScale.height * BOTTLE_CARD_IMG_YSCALEAFTER;
            posX = gameScale.width * BOTTLE_CARD_IMG_XSCALE - gameScale.width * BOTTLE_CARD_IMG_GAP_X_SECOND_ROW;
        }
    }

    drawCocktailFinal() {
        let cocktailKey = this.currentCustomer.drink;
        let imgKeyCocktail = this.cocktailImgKeys.find(image => image == `cocktail` + cocktailKey.id);
        this.imgCocktail = this.add.image(gameScale.width * 0.32, gameScale.height * 0.8, imgKeyCocktail)
        this.imgCocktail.scaleX = 1;
        this.imgCocktail.displayWidth = gameScale.width * 0.13;
        this.imgCocktail.scaleY = this.imgCocktail.scaleX

        window.addEventListener('resize', () => {
            this.imgCocktail.scaleX = 1;
            this.imgCocktail.displayWidth = gameScale.width * 0.13;
            this.imgCocktail.scaleY = this.imgCocktail.scaleX
            this.imgCocktail.setPosition(gameScale.width * 0.32, gameScale.height * 0.8);
        });
    }

    drawMovement(movementId) {
        var screenWidth = this.cameras.main.width;
        var screenHeight = this.cameras.main.height;

        const imgMovementKey = this.movementsImgKeys.find(image => image == `BOD` + movementId[movementId.length - 1]);
        console.log("imgMovementKey : ", imgMovementKey);
        // Ajout de l'image en spécifiant sa position à droite de l'écran
        this.currentMovement = this.add.image(screenWidth - 200, screenHeight / 2, imgMovementKey); // Ajustez 200 à la largeur de votre image
        this.currentMovement.setScale(2); // Ajustez la taille de l'image selon vos besoins
        this.currentMovement.setOrigin(0.5);

        const movementObject = this.movementsData.find(movement => movement.id == movementId);
        console.log("Tableau des mouvements : ", this.movementsData);
        console.log("Id que j'ai : ", movementId);
        console.log("movement qui correspond : ", movementObject);

        // Affichage de la description avec une animation
        this.text = this.add.text(screenWidth / 2, screenHeight / 2, movementObject.description, {
                fontSize: '24px',
                fill: '#fff',
                backgroundColor: 'rgba(0, 0, 0, 0.5)'
            })
            .setOrigin(0.5)
            .setScale(0.1); // Définir l'échelle initiale à 0.1 pour l'animation d'apparition

        this.tweens.add({
            targets: this.text,
            scale: 1,
            duration: 500,
            ease: 'Power2',
            onComplete: () => {
                //Mouvement en continu
                this.tweens.add({
                    targets: this.text,
                    scaleX: 1.2,
                    scaleY: 1.2,
                    duration: 1000,
                    yoyo: true,
                    repeat: -1,
                    ease: 'Power1',
                });
            }
        });

    }

    removeCocktailFinal() {
        if(this.imgCocktail){
            this.imgCocktail.setVisible(false);
        }
    }

    removeMovement() {
        let text = this.text;
        this.tweens.add({
            targets: text,
            scaleX: 0,
            scaleY: 0,
            duration: 1000,
            ease: 'Power2',
            onComplete: () => {
                text.destroy(); // Supprimer le texte une fois l'animation terminée
            }
        });
        console.log("this.text → ", this.text);
        this.text.setVisible(false);
        text.setVisible(false);
        this.currentMovement.setVisible(false);
    }

    //pour le premier spriteSheet de préparez vous / prépare toi
    mouvementFirst() {
        this.getReady = this.add.sprite(gameScale.width * 0.5, gameScale.height * 0.5, "prepare-toi").setOrigin(0.5, 0.5);
        this.getReady.displayWidth = gameScale.width * 0.3;
        this.getReady.scaleY = this.getReady.scaleX;
        this.getReady.anims.create({
            key: 'getReady',
            frames: [{
                    key: "prepare-toi",
                    frame: 0,
                },
                {
                    key: "prepare-toi",
                    frame: 0,
                },
                {
                    key: "prepare-toi",
                    frame: 0,
                },
                {
                    key: "prepare-toi",
                    frame: 0,
                },
                {
                    key: "prepare-toi",
                    frame: 0,
                },
                {
                    key: "prepare-toi",
                    frame: 0,
                },
                {
                    key: "prepare-toi",
                    frame: 0,
                },
                {
                    key: "prepare-toi",
                    frame: 0,
                },
                {
                    key: "prepare-toi",
                    frame: 0,
                },
                {
                    key: "prepare-toi",
                    frame: 1,
                },
                {
                    key: "prepare-toi",
                    frame: 2,
                },
                {
                    key: "prepare-toi",
                    frame: 3,
                },
                {
                    key: "prepare-toi",
                    frame: 4,
                },
                {
                    key: "prepare-toi",
                    frame: 5,
                },
                {
                    key: "prepare-toi",
                    frame: 6,
                },
                {
                    key: "prepare-toi",
                    frame: 7,
                },
                {
                    key: "prepare-toi",
                    frame: 8,
                },
                {
                    key: "prepare-toi",
                    frame: 9,
                },
                {
                    key: "prepare-toi",
                    frame: 10,
                },
                {
                    key: "prepare-toi",
                    frame: 11,
                },
                {
                    key: "prepare-toi",
                    frame: 12,
                },
                {
                    key: "prepare-toi",
                    frame: 13,
                },
                {
                    key: "prepare-toi",
                    frame: 14,
                },
                {
                    key: "prepare-toi",
                    frame: 15,
                },
                {
                    key: "prepare-toi",
                    frame: 16,
                },
                {
                    key: "prepare-toi",
                    frame: 17,
                },
                {
                    key: "prepare-toi",
                    frame: 18,
                },
                {
                    key: "prepare-toi",
                    frame: 19,
                },
                {
                    key: "prepare-toi",
                    frame: 20,
                },
                {
                    key: "prepare-toi",
                    frame: 21,
                },
            ],
            frameRate: 30,
            repeat: -1
        })
        this.getReady.play('getReady');
    }
}
export default GameScene;