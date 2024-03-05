import Phaser from 'phaser';
import GameCanva from '@/canvas/GameCanva'
import {
    gameScale,
    socket
} from '../main.js';

const
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

class FictiveGameScene extends Phaser.Scene {

    constructor() {
        super({
            key: 'FictiveGameScene'
        });
    }

    preload() {;
        this.bottlesData = this.game.registry.get('ingredients');
        this.cocktailsData = this.game.registry.get('cocktails');
        this.bottleCarteImgKeys = this.game.registry.get('bottleCarteImgKeys');
        this.bottleGoldImgKeys = this.game.registry.get('bottleGoldImgKeys');
        this.bottleCarteTakenImgKeys = this.game.registry.get('bottleCarteTakenImgKeys');
        this.bottleGoldTakenImgKeys = this.game.registry.get('bottleGoldTakenImgKeys');
        this.bottleGoldStolenImgKeys = this.game.registry.get('bottleGoldStolenImgKeys');
        this.bottleGoldStolenTakenImgKeys = this.game.registry.get('bottleGoldStolenTakenImgKeys');

    }

    create() {
        this.partie = this.game.registry.get('partie');
        this.currentCustomer = this.game.registry.get('customerData');
        this.canva = new GameCanva(this, this.currentCustomer, this.game.registry.get('score'));
        this.canva.menuPauseButton(this.scene, this);
        this.bottleCocktailImgTab = [];
        this.drawGame();

        let rectangle = this.add.rectangle(gameScale.width*0.9, gameScale.height*0.9, 100, 100, 0x6666ff, 0);
        rectangle.setInteractive({cursor: 'pointer'})
        rectangle.on('pointerdown', ()=> this.openCabinet())

        // ************************************************ SOCKET ************************************************
        socket.on('JUICE_TAKEN', (bottleId, bottlesData)=>{
            this.game.registry.set('ingredients', bottlesData);
            this.bottlesData = this.game.registry.get('ingredients');
        })

        socket.on('A_JUICE_IS_RETURNED', (bottlesData)=>{
            this.game.registry.set('ingredients', bottlesData);
            this.bottlesData = this.game.registry.get('ingredients');
        })

        socket.on("GAME_PAUSED", (secondPaused) => {
            this.canva.startPause(this.scene, this, secondPaused);
        })

        socket.on("NOMORE_CLIENT", (peutPlus) => {
            this.partie.addCustomer = peutPlus;
            this.game.registry.set('partie', this.partie);
        })

        socket.on("A_GOLD_BOTTLE_IS_TAKEN", ()=>{
            console.log("A_GOLD_BOTTLE_IS_TAKEN");
            this.partie.goldBottleStatus = true;
            this.game.registry.set('partie', this.partie);
            this.removeBottleCocktail();
            this.drawBottleCocktail();
        });

        socket.on("A_PLAYER_READY", () => {
            console.log('Sur PourInShakerScene, je bascule à GameScene pour nouveau client');
            socket.emit("CHANGE_TO_NEXT_CUSTOMER", this.partie.roomId, this.partie.player.numeroPlayer);
            this.partie.tooLateToServe = true;
            this.game.registry.set('partie', this.partie);
            this.removeSocket();
            this.scene.stop("CabinetScene");
            this.scene.stop("PourInShakerScene");
            this.scene.run("GameScene");
        });

        socket.once("NAVIGATE_CABINETSCENE", (sens) => {
            this.openCabinet(sens);
        });
    }

    // ************************************************ FONCTIONS ************************************************

    findObjectById(objects, id) {
        const foundObject = objects.find(object => object.id == id);
        return foundObject;
    }

    getBottleImg(cocktailBottleId) {
        if (cocktailBottleId == 666) {
            return this.bottlesData[0]
        }
        return this.bottlesData.find(bottle => bottle.id == cocktailBottleId)
    }

    openCabinet(sens) {
        // Changement de scène vers la sélection des jus
        this.canva.removeResizeListeners();
        this.removeSocket();
        this.scene.launch('ArmoireFictiveScene',{
            'sens': sens,
            'sceneToMove': "CabinetScene"
        });
        this.scene.bringToTop('ArmoireFictiveScene');
        // this.scene.stop('FictiveGameScene');
        // this.scene.start('CabinetScene');
    }

    removeSocket(){
        socket.removeAllListeners("NOMORE_CLIENT");
        socket.removeAllListeners("GAME_PAUSED");
        socket.removeAllListeners("A_JUICE_IS_RETURNED");
        socket.removeAllListeners("JUICE_TAKEN");
        socket.removeAllListeners("A_GOLD_BOTTLE_IS_TAKEN");
        socket.removeAllListeners("A_PLAYER_READY");
    }

    // ************************************************ DRAW ************************************************
    // ---- Dessine tous les visuels du jeu
    drawGame() {
        this.drawBackground();
        this.canva.draw();
        this.drawBarCounter();
        this.drawShaker();
        this.drawcard();
        this.drawBottleCocktail();
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

    alreadyTaken(juice){
        const alreadyChosen = this.partie.tabBottlesChoosed.find(id => id == juice.id);
        console.log(alreadyChosen, juice.id);
        return(alreadyChosen)
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
                let cocktailBottleImg = this.getBottleImg(this.currentCustomer.drink.ingredients[k].alcoholId);
                let takenOrNot = this.alreadyTaken(cocktailBottleImg);
                if (takenOrNot) {
                    console.log('status gold bottle ', this.partie.goldBottleStatus);
                    if (cocktailBottleImg.id == goldenBottle && this.partie.goldBottleStatus) {
                        imageKey = this.bottleGoldStolenTakenImgKeys.find(image => image == `carte-luxe-stolen-taken-bouteille` + goldenBottle);
                    } else {
                        cocktailBottleImg.id == goldenBottle ? imageKey = this.bottleGoldTakenImgKeys.find(image => image == `carte-luxe-taken-bouteille` + goldenBottle) : imageKey = this.bottleCarteTakenImgKeys.find(image => image == `carte-normale-taken-bouteille` + cocktailBottleImg.id);
                    }
                } else {
                    if (cocktailBottleImg.id == goldenBottle && this.partie.goldBottleStatus) {
                        imageKey = this.bottleGoldStolenImgKeys.find(image => image == `carte-luxe-stolen-bouteille` + goldenBottle);
                    } else {
                        cocktailBottleImg.id == goldenBottle ? imageKey = this.bottleGoldImgKeys.find(image => image == `carte-luxe-bouteille` + goldenBottle) : imageKey = this.bottleCarteImgKeys.find(image => image == `carte-bouteille` + cocktailBottleImg.id);
                    }
                }
                let bottleImg = this.add.image(posX, posY, imageKey)
                bottleImg.scaleX = 1;
                bottleImg.displayWidth = gameScale.width * BOTTLE_CARD_IMG_WIDTHSCALE;
                bottleImg.scaleY = bottleImg.scaleX
                bottleImg.angle = BOTTLE_CARD_IMG_ANGLE;
                this.bottleCocktailImgTab.push(bottleImg);

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

    removeBottleCocktail(){
        for(let i=0; i < this.bottleCocktailImgTab.length; i++){
            this.bottleCocktailImgTab[i].setVisible(false);
        }
        this.bottleCocktailImgTab = [];
    }
}
export default FictiveGameScene;