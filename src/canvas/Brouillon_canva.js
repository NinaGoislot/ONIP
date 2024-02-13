import Phaser from 'phaser';
import {
    gameScale,
    socket
} from '../main.js';

//Responsive values
const BOTTLE_CARD_IMG_YSCALE = 0.25,
    BOTTLE_CARD_IMG_YSCALEAFTER = 0.03,
    BOTTLE_CARD_IMG_YSCALEAFTER_HEIGHT = 6,
    BOTTLE_CARD_IMG_XSCALE = 0.665,
    BOTTLE_CARD_GRID_NBR_ROW = 2,
    BOTTLE_CARD_GRID_NBR_COL_PLUS_1 = 4,
    BOTTLE_CARD_IMG_WIDTHSCALE = 0.095,
    BOTTLE_CARD_IMG_ANGLE = 2.27,
    BOTTLE_CARD_IMG_GAP_Y_BETWEEN = 0.11,
    BOTTLE_CARD_IMG_GAP_X_SECOND_ROW = 0.01 * 0.333;

class GameCanva extends Phaser.GameObjects.Graphics {
    constructor(scene, customer = {}, score = "0", assets, bottlesData, cocktailsData) {
        super(scene);
        scene.add.existing(this);

        // ATTRIBUTS
        this.customer = customer;
        this.scene = scene;
        this.score = score;
        this.bottlesData = bottlesData;
        this.cocktailsData = cocktailsData;

        this.asset_background = assets[0];
        this.asset_barCounter = assets[1];
        this.asset_card = assets[2];
        this.asset_shaker = assets[3];
        this.assets_bottles = assets[4];
        this.assets_goldenBottles = assets[5];
        this.assets_cocktails = assets[6];

        // this.isTalking = false;
        this.isTalking = "null"
        this.draw();
    }

    //------------------------------------ Fonctions principales ------------------------------------
    draw() {
        this.drawBg();
        if (this.customer != {}) {
           this.drawCustomer();
           //this.createAnimation();
           this.drawBubbleDialogue();
        }
        this.drawBarCounter();
        this.drawShaker();

         this.addEventResponsive();

        this.displayScore = this.scene.add.text(20, 20, this.score, {
            fontSize: '16px',
            fill: '#fff'
        });
    }

    //------------------------------------ Fonction draw each item ------------------------------------

    drawBarCounter() {
        this.barCounter =  this.scene.add.image(gameScale.width / 2, gameScale.height / 2, this.asset_barCounter);
        this.barCounter.displayWidth = gameScale.width;
        this.barCounter.displayHeight = gameScale.width / this.barCounter.width * this.barCounter.height;
    }

    drawBg() {
        this.background =  this.scene.add.image(gameScale.width / 2, gameScale.height / 2, this.asset_background);
        this.background.displayWidth = gameScale.width;
        this.background.displayHeight = gameScale.width / this.background.width * this.background.height;
    }

    drawBubbleDialogue() {
        let fontSize = gameScale.width * 0.02
        let bubbleWrap = gameScale.width * 0.25
        this.bubble = this.scene.add.text(gameScale.width * 0.25, gameScale.height * 0.2, "", {
            fontSize: fontSize + 'px',
            fill: '#fff',
            wordWrap: {
                width: bubbleWrap
            },
            lineSpacing: 10
        });
    }

    drawCard() {
        this.backgroundCard =  this.scene.add.image(gameScale.width, 0, this.asset_card).setOrigin(1, 0);
        this.backgroundCard.displayHeight = gameScale.height;
        this.backgroundCard.displayWidth = gameScale.height / this.backgroundCard.height * this.backgroundCard.width;
    }

    drawCustomer() {
        this.clientImage = this.scene.add.sprite(gameScale.width * 0.15, gameScale.height, this.customer.picture).setOrigin(0.5, 1);
        this.clientImage.displayWidth = gameScale.width * 0.3;
        this.clientImage.scaleY = this.clientImage.scaleX;
    }

    drawShaker() {
        this.shakerService =  this.scene.add.image(gameScale.width * 0.425, gameScale.height * 0.8, this.asset_shaker);
        this.shakerService.setScale(0.1);
        this.shakerService.displayWidth = gameScale.width * 0.1;
        this.shakerService.scaleY = this.shakerService.scaleX
    }

    //------------------------------------ Fonctions utilitaires ------------------------------------

    addEventResponsive() {
        window.addEventListener('resize', () => {
            //Background
            this.background.displayWidth = gameScale.width;
            this.background.displayHeight = gameScale.width / this.background.width * this.background.height;
            this.background.setPosition(gameScale.width / 2, gameScale.height / 2);

            //Client
            this.clientImage.displayWidth = gameScale.width * 0.3;
            this.clientImage.scaleY = this.clientImage.scaleX
            this.clientImage.setPosition(gameScale.width * 0.15, gameScale.height);

            //Comptoir du bar
            this.barCounter.displayWidth = gameScale.width;
            this.barCounter.displayHeight = gameScale.width / this.barCounter.width * this.barCounter.height;
            this.barCounter.setPosition(gameScale.width / 2, gameScale.height / 2);

            //Carte menu
            this.backgroundCard.displayHeight = gameScale.height;
            this.backgroundCard.displayWidth = gameScale.height / this.backgroundCard.height * this.backgroundCard.width;
            this.backgroundCard.setPosition(gameScale.width, 0);

            //Shaker
            this.shakerService.displayWidth = gameScale.width * 0.1;
            this.shakerService.scaleY = this.shakerService.scaleX
            this.shakerService.setPosition(gameScale.width * 0.425, gameScale.height * 0.8);

            //Bulle dialogue
            fontSize = gameScale.width * 0.02
            bubbleWrap = gameScale.width * 0.25
            this.bubble.setFontSize(fontSize);
            this.bubble.setWordWrapWidth(bubbleWrap)
            this.bubble.wordWrap = {
                width: gameScale.width * 0.25
            };
            this.bubble.setPosition(gameScale.width * 0.25, gameScale.height * 0.2)
        });
    }

    /*createAnimation() {
        //animation talk et blink client
        this.scene.anims.create({
            key: 'clientTalk',
            frames: this.scene.anims.generateFrameNumbers(this.customer.picture, {
                start: 0,
                end: 5
            }),
            frameRate: 6,
            repeat: -1
        })
        this.scene.anims.create({
            key: 'blink',
            frames: [{
                    key: this.customer.picture,
                    frame: 6,
                },
                {
                    key: this.customer.picture,
                    frame: 6,
                },
                {
                    key: this.customer.picture,
                    frame: 6,
                },
                {
                    key: this.customer.picture,
                    frame: 6,
                },
                {
                    key: this.customer.picture,
                    frame: 7,
                },
                {
                    key: this.customer.picture,
                    frame: 8,
                },
                {
                    key: this.customer.picture,
                    frame: 8,
                },
                {
                    key: this.customer.picture,
                    frame: 8,
                },
                {
                    key: this.customer.picture,
                    frame: 8,
                },
                {
                    key: this.customer.picture,
                    frame: 8,
                },
                {
                    key: this.customer.picture,
                    frame: 8,
                }
            ],
            frameRate: 6,
            repeat: -1
        })
    }*/

    drawBottleCocktail() {
        let goldenBottle = this.goldBottle()

        // pour les bouteilles de la carte
        let posY = gameScale.height * BOTTLE_CARD_IMG_YSCALE;
        let k = 0; //Index
        let maxK = this.customer.drink.ingredients.length //Nombre de bouteilles pour faire le cocktail
        let posX = gameScale.width * BOTTLE_CARD_IMG_XSCALE;
        for (let i = 0; i < BOTTLE_CARD_GRID_NBR_ROW; i++) {
            for (let j = 1; j < BOTTLE_CARD_GRID_NBR_COL_PLUS_1; j++) {
                let imageKey;
                let cocktailBottleImg = this.getBottleImg(this.currentCustomer.drink.ingredients[k].alcoholId)
                cocktailBottleImg.id == goldenBottle ? imageKey = this.assets_goldenBottles.find(image => image == `carte-luxe-bouteille` + goldenBottle) : imageKey = this.assets_bottles.find(image => image == `carte-bouteille` + cocktailBottleImg.id);

                //Position et taille de l'image
                this.bottleImg =  this.scene.add.image(posX, posY, imageKey)
                this.bottleImg.scaleX = 1;
                this.bottleImg.displayWidth = gameScale.width * BOTTLE_CARD_IMG_WIDTHSCALE;
                this.bottleImg.scaleY = this.bottleImg.scaleX
                this.bottleImg.angle = BOTTLE_CARD_IMG_ANGLE;

                //Responsive et la suite des boucles
                let bottleGapXSecondRow = 0
                let bottlePosition2Y2 = 0
                if (i == 1) {
                    bottleGapXSecondRow = BOTTLE_CARD_IMG_GAP_X_SECOND_ROW;
                    bottlePosition2Y2 = 2
                }
                //Responsive
                window.addEventListener('resize', () => {
                    this.bottleImg.scaleX = 1;
                    this.bottleImg.displayWidth = gameScale.width * BOTTLE_CARD_IMG_WIDTHSCALE;
                    this.bottleImg.scaleY = this.bottleImg.scaleX
                    this.bottleImg.setPosition(gameScale.width * BOTTLE_CARD_IMG_XSCALE + gameScale.width * BOTTLE_CARD_IMG_GAP_Y_BETWEEN * (j - 1) - gameScale.width * bottleGapXSecondRow, gameScale.height * BOTTLE_CARD_IMG_YSCALE * (i + 1) + gameScale.height * BOTTLE_CARD_IMG_YSCALEAFTER * i + (gameScale.height * BOTTLE_CARD_IMG_YSCALEAFTER / BOTTLE_CARD_IMG_YSCALEAFTER_HEIGHT) * (j - 1))
                });
                //Pour la prochaine boucle
                posX = gameScale.width * BOTTLE_CARD_IMG_XSCALE + gameScale.width * BOTTLE_CARD_IMG_GAP_Y_BETWEEN * j - gameScale.width * bottleGapXSecondRow;
                posY = gameScale.height * BOTTLE_CARD_IMG_YSCALE * (i + 1) + gameScale.height * BOTTLE_CARD_IMG_YSCALEAFTER * i + (gameScale.height * BOTTLE_CARD_IMG_YSCALEAFTER / BOTTLE_CARD_IMG_YSCALEAFTER_HEIGHT) * j;
                k += 1;
                if (k == maxK) {
                    return;
                }
            }
            //Pour la prochaine rangée
            posY = gameScale.height * BOTTLE_CARD_IMG_YSCALE * 2 + gameScale.height * BOTTLE_CARD_IMG_YSCALEAFTER;
            posX = gameScale.width * BOTTLE_CARD_IMG_XSCALE - gameScale.width * BOTTLE_CARD_IMG_GAP_X_SECOND_ROW;
        }
    }

    drawCocktailFinal() {
        let cocktailKey = this.customer.drink;
        let imgKeyCocktail = this.assets_cocktails.find(image => image == `cocktail` + cocktailKey.id);
        let posX = gameScale.width * 0.75
        let posY = gameScale.height * 0.5
        this.imgCocktail =  this.scene.add.image(posX, posY, imgKeyCocktail)
        this.imgCocktail.scaleX = 1;
        this.imgCocktail.displayWidth = gameScale.width * 0.5;
        this.imgCocktail.scaleY = this.imgCocktail.scaleX
    }

    getBottleImg(cocktailBottleId) {
        let allBottles = this.game.registry.get('ingredients');
        if (cocktailBottleId == 666) {
            return allBottles[0]
        }
        return allBottles.find(bottle => bottle.id == cocktailBottleId)
    }

    goldBottle() {
        let allIdBottleCocktail = this.customer.drink.ingredients;
        let GoldBottleId = Phaser.Math.RND.pick(allIdBottleCocktail);
        return GoldBottleId.alcoholId;
    }

    menuPauseButton(scene) {
        this.PauseButton = this.scene.add.text(0, 0, "PAUSE", {
                fontSize: '24px',
                fill: '#fff'
            })
            .setInteractive({
                cursor: 'pointer'
            })
            .on('pointerdown', () => this.startPause(scene))
            .on('pointerover', () => this.PauseButton.setTint(0x90ee90))
            .on('pointerout', () => this.PauseButton.setTint(0xffffff))
    }

    remove() {
        this.customer != {} ? this.clientImage.setVisible(false) : "";
        this.bubble.setVisible(false);
        this.displayScore.setVisible(false);
    }

    startPause(scene, secondPaused) {
        this.scene.game.currentScene = scene.key;
        let roomIdJoueur = this.scene.game.registry.get('roomIdJoueur');
        if (!secondPaused) {
            socket.emit("PAUSED", roomIdJoueur);
        }
        scene.pause()
        scene.launch('PauseScene', {
            'secondPaused': secondPaused
        });
    }

    updateDialogue(currentDialogue) {
        this.bubble.setText(currentDialogue);
        this.animClientTalk(this.isTalking);
    }

    updateScore(score) {
        this.score = score;
        this.displayScore.setText(this.score)
    }

    //Obsolète ?
    writeDialogue(dialogue) {
        this.bubble.setText(dialogue);
    }
}

export default GameCanva;