import Phaser from 'phaser';
import LiquidShaker from '../class/LiquidShaker';
import {
    gameScale,
    socket
} from '../main.js';

class PourInShakerScene extends Phaser.Scene {

    constructor() {
        super({
            key: 'PourInShakerScene'
        });
    }

    // init(startData) {
    //     if (startData.bottleChoosed) {
    //         this.bottleChoosed = startData.bottleChoosed;
    //     } else {
    //         console.log("there is an error.")
    //     }
    // }

    // preload() {
        // this.load.image('bg-shaker', './media/img/shaker/ecran-shaker-bg.webp');
        // this.load.image('shaker-servir', './media/img/shaker/shaker-servir.webp');
        // // this.load.image('shaker-cache', './media/img/shaker/shaker-cache.webp');
        // this.load.html('shakerCanvas', './html/shakerCanvas.html');
    // }

    create(startData) {
        if (startData.bottleChoosed) {
            this.bottleChoosed = startData.bottleChoosed;
        } else {
            console.log("there is an error.")
        }
        this.currentCustomer = this.game.registry.get('customerData');
        this.bottlesData = this.game.registry.get('ingredients');
        this.nbrBoucle = this.currentCustomer.drink.ingredients.length;
        this.partie = this.game.registry.get('partie');
        this.nbrBottleChoose = this.currentCustomer.indexNbrBottleChoosed;
        this.isTooMuch = false;

        // ******************************** DECORS ********************************
        let background = this.add.image(gameScale.width / 2, gameScale.height / 2, 'bg-shaker');
        background.displayWidth = gameScale.width;
        background.displayHeight = gameScale.width / background.width * background.height;

        let shakerService = this.add.image(gameScale.width * 0.3235, gameScale.height * 0.485, 'shaker-servir');
        shakerService.displayWidth = gameScale.width * 0.355;
        shakerService.scaleY = shakerService.scaleX;

        this.shakerCanvas = this.add.dom().createFromCache('shakerCanvas').setOrigin(0, 0);
        this.shakerCanvas.addListener('click');
        this.divHTML = document.getElementById("shakerHTML");
        this.divHTML.setAttribute('hidden', '');
        setTimeout(() => {
            this.divHTML.removeAttribute('hidden');
            console.log("apparition html")
        }, 400);
        this.canvas = document.getElementById("shakerCanvas");
        this.canvas.width = shakerService.displayWidth - gameScale.width * 0.022;
        this.canvas.height = shakerService.displayHeight - gameScale.height * 0.1;
        this.canvas.style.left = gameScale.width * 0.157 + 'px';
        this.canvas.style.top = gameScale.height * 0.123 + 'px';
        this.ctx = this.canvas.getContext("2d");

        this.shakerCache = document.getElementById("shakerCache");
        this.shakerCache.height = gameScale.height;
        this.shakerCache.style.height = gameScale.height;
        this.shakerCache.style.left = gameScale.width * 0.117 + 'px';
        this.shakerCache.style.top = -(gameScale.height * 0.005) + 'px';

        this.shakerDivLigne = document.getElementById("shakerDivLigne");
        this.shakerDivLigne.style.left = gameScale.width * 0.1 + 'px';

        this.shakerLigneMoy = document.getElementById("shakerLigneMoy");
        this.shakerLigneMoy.height = gameScale.height * 0.3;
        this.shakerLigneMoy.style.height = gameScale.height * 0.3;

        this.insideShaker = {
            x: 0,
            y: 0,
            width: shakerService.displayWidth - gameScale.width * 0.022,
            height: shakerService.displayHeight - gameScale.height * 0.1,
        }

        //<img src="../media/img/shaker/lignes/ligne-max.webp" id="shakerLigneMax">
        //<img src="../media/img/shaker/lignes/ligne-min.webp" id="shakerLigneMin">

        window.addEventListener('resize', () => {
            background.displayWidth = gameScale.width;
            background.displayHeight = gameScale.width / background.width * background.height;
            background.setPosition(gameScale.width / 2, gameScale.height / 2);
            shakerService.displayWidth = gameScale.width * 0.355;
            shakerService.scaleY = shakerService.scaleX;
            shakerService.setPosition(gameScale.width * 0.3235, gameScale.height * 0.485);
            this.canvas.width = shakerService.displayWidth - gameScale.width * 0.022;
            this.canvas.height = shakerService.displayHeight - gameScale.height * 0.1;
            this.canvas.style.left = gameScale.width * 0.157 + 'px';
            this.canvas.style.top = gameScale.height * 0.123 + 'px';
            this.shakerCache.height = gameScale.height;
            this.shakerCache.style.height = gameScale.height;
            this.shakerCache.style.left = gameScale.width * 0.117 + 'px';
            this.shakerCache.style.top = -(gameScale.height * 0.005) + 'px';
            this.shakerDivLigne.style.left = gameScale.width * 0.1 + 'px';
            this.shakerLigneMoy.height = gameScale.height * 0.3;
            this.shakerLigneMoy.style.height = gameScale.height * 0.3;
            this.insideShaker.width = shakerService.displayWidth - gameScale.width * 0.022;
            this.insideShaker.height = shakerService.displayHeight - gameScale.height * 0.1;
        });

        this.pourDrink = this.sound.add('pourDrink');
        this.beepDrink = this.sound.add('beepDrink');
        this.scoreGood = this.sound.add('scoreBottle');
        this.scorePerfect = this.sound.add('scoreBottleGold');


        // ******************************** SHAKER SERVIR ********************************
        this.pourcentBottle = this.getQuantityForSelectedBottle();
        console.log("pourcentage de la bouteille :", this.pourcentBottle);
        this.bottleChoosedData = this.getIngredientsById();

        // let rectangle = this.add.rectangle(gameScale.width * 0.9, gameScale.height * 0.9, 100, 100, 0x6666ff, 0.5);
        // rectangle.setInteractive({
        //     cursor: 'pointer'
        // });

        // rectangle.on('pointerdown', () => {
        //     this.liquid.isFilling = true;
        // });

        // rectangle.on('pointerup', () => {
        //     this.liquid.isFilling = false;
        //     rectangle.disableInteractive();
        //     this.renduScore(this.liquid.fillPercentage);
        // })

        this.liquid = new LiquidShaker(this, 0, 0.05, false, this.bottleChoosedData.color, this.pourcentBottle);
        // console.log('test ligne placement :', (100-this.liquid.fillGoal)/100 * shakerService.displayHeight)
        // console.log('test ligne placement2 :', (100-this.liquid.fillGoal)/100 * shakerService.displayHeight - gameScale.height*0.12)

        if (this.partie.liquids.length > 0) {
            this.liquid.fillPercentage = this.partie.liquids[this.partie.liquids.length - 1].fillPercentage;
            console.log(this.liquid.fillPercentage);
            for (let i = this.partie.liquids.length - 1; i >= 0; i--) {
                var filledHeight = this.insideShaker.height * (this.partie.liquids[i].fillPercentage / 100);
                var emptyHeight = this.insideShaker.height - filledHeight;
                this.ctx.fillStyle = this.partie.liquids[i].fillColor;
                this.ctx.fillRect(this.insideShaker.x, this.insideShaker.y + emptyHeight, this.insideShaker.width, filledHeight);
            }
        }

        this.goal = (100 - this.liquid.fillGoal - this.liquid.fillPercentage) / 100 * (shakerService.displayHeight - gameScale.height * 0.1) - gameScale.height * 0.025
        this.shakerLigneMoy.style.top = this.goal + 'px';

        // console.log(100 - this.liquid.fillGoal - this.liquid.fillPercentage);
        // console.log(shakerService.displayHeight - gameScale.height * 0.1);
        // console.log(gameScale.height);


        this.fillShaker();

        // ******************************** ADDEVENTLISTENER ********************************
        // this.btnPlaySolo = this.add.text(200, 100, "Verser la boisson", {
        //         fill: '#EFECEA',
        //         fontFamily: 'soria',
        //         fontSize: gameScale.width * 0.03 + 'px'
        //     })
        //     .setInteractive({
        //         cursor: 'pointer'
        //     })
        //     .on('pointerover', () => this.btnPlaySolo.setTint(0x90ee90))
        //     .on('pointerout', () => this.btnPlaySolo.setTint(0xffffff));

        // if (this.nbrBottleChoose == this.nbrBoucle) {
        //     this.btnPlaySolo.on('pointerdown', () => this.openGameScene())
        // } else {
        //     this.btnPlaySolo.on('pointerdown', () => this.openCabinet())
        // };
        // ******************************** SOCKET ********************************
        socket.on('JUICE_TAKEN', (bottleId, bottlesData) => {
            this.game.registry.set('ingredients', bottlesData);
            this.bottlesData = this.game.registry.get('ingredients');
        });

        socket.on('A_JUICE_IS_RETURNED', (bottlesData) => {
            this.game.registry.set('ingredients', bottlesData);
            this.bottlesData = this.game.registry.get('ingredients');
        });

        socket.on("A_GOLD_BOTTLE_IS_TAKEN", () => {
            console.log("A_GOLD_BOTTLE_IS_TAKEN, pourInShaker");
            this.partie.goldBottleStatus = true;
            this.game.registry.set('partie', this.partie);
        });

        socket.on("GAME_PAUSED", (secondPaused) => {
            this.canva.startPause(this.scene, this, secondPaused);
        });

        socket.on("NOMORE_CLIENT", (peutPlus) => {
            this.partie.addCustomer = peutPlus;
            this.game.registry.set('partie', this.partie);
        });

        // socket.on("POURING", (isPouring, pourSpeed) => {
        //     console.log("isPouring : ", isPouring);
        //     console.log("speed reçue du socket: ", pourSpeed);
        //     if (isPouring) {
        //         this.liquid.isFilling = true;
        //         this.liquid.fillSpeed = pourSpeed;
        //     } else {
        //         this.liquid.isFilling = false;
        //         this.renduScore(this.liquid.fillPercentage);
        //         console.log("Nombre de bouteilles choisies", this.nbrBottleChoose);
        //         console.log("Nombre de bouteilles attendues", this.nbrBoucle);
        //         if (this.nbrBottleChoose == this.nbrBoucle) {
        //             setTimeout(() => {
        //                 this.openGameScene();
        //             }, 1000);
        //         } else {
        //             setTimeout(() => {
        //                 console.log("Le set timeout renvoie à la CabinetScene");
        //                 this.openCabinet();
        //             }, 1000);
        //         };
        //     }
        // });

        socket.on("POURING_SPEED", (speed) => {
            if(this.liquid.isFilling) {
                // console.log("POURING_SPEED ► vitesse de versement : ", speed);
                this.liquid.fillSpeed = speed;
            }
        });

        socket.once("IS_POURING_TRUE", () => {
            console.log("IS_POURING_TRUE : true");
            this.liquid.isFilling = true;
            this.pourDrink.play();
        });

        socket.once("IS_POURING_FALSE", () => {
            console.log("IS_POURING_FALSE ► false");
            this.pourDrink.stop();
            this.liquid.isFilling = false;
            this.renduScore(this.liquid.fillPercentage);
            console.log("Nombre de bouteilles choisies", this.nbrBottleChoose);
            console.log("Nombre de bouteilles attendues", this.nbrBoucle);
            if (this.nbrBottleChoose == this.nbrBoucle) {
                setTimeout(() => {
                    this.openGameScene();
                }, 1000);
            } else {
                setTimeout(() => {
                    console.log("Le set timeout renvoie à la CabinetScene");
                    this.openCabinet();
                }, 1000);
            };
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

        /* ----- Gestion des erreurs ----- */
        socket.on("ERROR", (error) => {
            console.log('1) Le serveur à rencotrer une erreur.');
            console.log('2) ', error);
        });
    }

    // ******************************** FONCTIONS ********************************

    borderShaker() {
        var triangle1 = {
            x1: 350,
            y1: 550,
            x2: 450,
            y2: 50,
            x3: 450,
            y3: 550
        };
        this.ctx.fillStyle = 'white';
        // Dessiner le triangle
        this.ctx.beginPath();
        this.ctx.moveTo(triangle1.x1, triangle1.y1); // Déplacer le dessin au premier point
        this.ctx.lineTo(triangle1.x2, triangle1.y2); // Dessiner le segment jusqu'au deuxième point
        this.ctx.lineTo(triangle1.x3, triangle1.y3); // Dessiner le segment jusqu'au troisième point
        this.ctx.closePath();
        this.ctx.fill();
        // Dessiner les contours du triangle
        var triangle2 = {
            x1: 50,
            y1: 550,
            x2: 50,
            y2: 50,
            x3: 150,
            y3: 550
        };
        this.ctx.fillStyle = 'white';
        // Dessiner le triangle
        this.ctx.beginPath();
        this.ctx.moveTo(triangle2.x1, triangle2.y1); // Déplacer le dessin au premier point
        this.ctx.lineTo(triangle2.x2, triangle2.y2); // Dessiner le segment jusqu'au deuxième point
        this.ctx.lineTo(triangle2.x3, triangle2.y3); // Dessiner le segment jusqu'au troisième point
        this.ctx.closePath();
        this.ctx.fill();
    }

    fillShaker() {
        if (this.liquid.isFilling) {
            // Limiter fillPercentage à 100%
            if (this.partie.liquids.length > 0) {
                // console.log("liquide fill speed : ", this.liquid.fillSpeed);
                this.liquid.fillPercentage = Math.min(this.liquid.fillPercentage + this.liquid.fillSpeed, this.partie.liquids[this.partie.liquids.length - 1].fillPercentage + this.liquid.fillGoal + 5);
                // console.log("PourInShaker ► % du liquide", this.liquid.fillPercentage);
                if (this.liquid.fillPercentage == this.partie.liquids[this.partie.liquids.length - 1].fillPercentage + this.liquid.fillGoal + 5) {
                    return (this.tooMuch())
                }
                console.log('tooMuch Pourcentage : ', this.partie.liquids[this.partie.liquids.length - 1].fillPercentage + this.liquid.fillGoal + 5);
            } else {
                this.liquid.fillPercentage = Math.min(this.liquid.fillPercentage + this.liquid.fillSpeed, this.liquid.fillGoal + 5);
                if (this.liquid.fillPercentage == this.liquid.fillGoal + 5) {
                    return (this.tooMuch())
                }
            }

            // Calculer la hauteur du insideShaker en fonction du pourcentage rempli (de bas en haut)
            var filledHeight = this.insideShaker.height * (this.liquid.fillPercentage / 100);
            var emptyHeight = this.insideShaker.height - filledHeight;

            // Dessiner la partie remplie du insideShaker
            this.ctx.fillStyle = this.liquid.fillColor;
            this.ctx.fillRect(this.insideShaker.x, this.insideShaker.y + emptyHeight, this.insideShaker.width, filledHeight);

            for (let i = this.partie.liquids.length - 1; i >= 0; i--) {
                var filledHeight = this.insideShaker.height * (this.partie.liquids[i].fillPercentage / 100);
                var emptyHeight = this.insideShaker.height - filledHeight;

                // Dessiner la partie remplie du insideShaker
                this.ctx.fillStyle = this.partie.liquids[i].fillColor;
                this.ctx.fillRect(this.insideShaker.x, this.insideShaker.y + emptyHeight, this.insideShaker.width, filledHeight);
            }
            // var imageSprite = this.add.image(this.insideShaker.x, this.insideShaker.y, 'shaker-texture');
            // var imageElement = imageSprite.texture.getSourceImage();
            // this.ctx.drawImage(imageElement, this.insideShaker.x, this.insideShaker.y + emptyHeight, this.insideShaker.width, filledHeight);
            // var image = document.getElementById("texture2"); // Récupérer l'image depuis le DOM
            // this.ctx.drawImage(image, this.insideShaker.x, this.insideShaker.y + emptyHeight, this.insideShaker.width, filledHeight);
        }

        requestAnimationFrame(this.fillShaker.bind(this));

        // this.borderShaker();
    }

    getIngredientsById() {
        const ingredientsBottleChoosed = this.bottlesData.find(object => object.id == this.bottleChoosed.id);
        return ingredientsBottleChoosed;
    }

    getQuantityForSelectedBottle() {
        // Boucle à travers les ingrédients de la boisson
        for (let i = 0; i < this.currentCustomer.drink.ingredients.length; i++) {
            // Vérifie si l'alcoholId correspond à celui de la bouteille choisie
            if (this.currentCustomer.drink.ingredients[i].alcoholId === this.bottleChoosed.id) {
                // Retourne la quantité correspondante
                return this.currentCustomer.drink.ingredients[i].quantity;
            }
        }
        return null;
    }

    openCabinet() {
        console.log("openCabinet() ► je lance CabinetScene")
        this.partie.liquids.push(this.liquid);
        this.game.registry.set('partie', this.partie);
        //console.log("je push",this.liquid, this.partie.liquids)
        this.bottlesData = this.game.registry.get('ingredients');
        this.bottleChoosed.picked = false;
        this.bottlesData[this.bottleChoosed.id - 1].picked = false;
        this.game.registry.set('ingredients', this.bottlesData);
        socket.emit("JUICE_RETURNED", this.bottlesData, this.bottleChoosed, this.partie.roomId);
        //console.log("je rends le jus", this.bottlesData, this.bottleChoosed, this.partie.roomId);
        // socket.emit("GO_TO_CABINET", this.partie.roomId, this.partie.player.numeroPlayer);
        this.removeSocket();

        this.scene.launch('VerseArmoireScene');
        setTimeout(() => {
            this.divHTML.setAttribute('hidden', '');
        }, 200);
        this.scene.bringToTop('VerseArmoireScene');
        // setTimeout(() => {
        //     this.scene.stop("PourInShakerScene");
        //     this.scene.run("CabinetScene");
        //     this.scene.bringToTop('VerseArmoireScene');
        // }, 500);
    }

    openGameScene() {
        this.bottlesData = this.game.registry.get('ingredients');
        this.bottleChoosed.picked = false;
        this.bottlesData[this.bottleChoosed.id - 1].picked = false;
        this.game.registry.set('ingredients', this.bottlesData);
        socket.emit("JUICE_RETURNED", this.bottlesData, this.bottleChoosed, this.partie.roomId);
        // socket.emit("POURING_FINISHED", this.partie.roomId, this.partie.player.numeroPlayer);
        this.removeSocket();        
        this.scene.launch('VerseGameScene');
        this.scene.bringToTop('VerseGameScene');
        setTimeout(() => {
            this.divHTML.setAttribute('hidden', '');
        }, 200);
        // setTimeout(() => {
        //     this.scene.stop("CabinetScene");
        //     this.scene.stop("PourInShakerScene");
        //     this.scene.run("GameScene");
        //     this.scene.bringToTop('VerseGameScene');
        // }, 600);
        // this.scene.stop("CabinetScene");
        // this.scene.stop("PourInShakerScene");
        // this.scene.run("GameScene");
    }

    removeSocket() {
        socket.removeAllListeners("POURING");
        socket.removeAllListeners("NOMORE_CLIENT");
        socket.removeAllListeners("GAME_PAUSED");
        socket.removeAllListeners("A_JUICE_IS_RETURNED");
        socket.removeAllListeners("JUICE_TAKEN");
        socket.removeAllListeners("JUICE_RETURNED");
        socket.removeAllListeners("POURING_FINISHED");
        socket.removeAllListeners("GO_TO_CABINET");
        socket.removeAllListeners("A_GOLD_BOTTLE_IS_TAKEN");
        socket.removeAllListeners("A_PLAYER_READY");
    }

    renduScore(pourcentFill) {
        let goal = 0;
        if(this.partie.liquids.length > 0){
            goal = this.partie.liquids[this.partie.liquids.length - 1].fillPercentage + this.liquid.fillGoal;
        } else{
            goal = this.liquid.fillGoal;
        }
        console.log('poucentFill + goal', pourcentFill, goal);
        if (!this.isTooMuch) {
            if (pourcentFill >= (goal * 0.95)) {
                // if (pourcentFill >= (goal * 0.95) && pourcentFill < (goal * 1.05)) {
                console.log('cran 1 : between ', goal * 0.95,' et ', goal *  1.05);
                this.partie.player.score += 500;
                this.showScore("+500", "perfect");
                this.partie.player.perfectPourring += 1;
                this.scorePerfect.play();

            } else if (pourcentFill > (goal * 0.85) && pourcentFill < (goal * 0.95)) {
                console.log('cran 2 : between ', goal * 0.85,' et ', goal * 0.95);
                this.partie.player.score += 250;
                this.showScore("+250", "good");
                this.scoreGood.play();

            } else if (pourcentFill > (goal * 0.75) && pourcentFill < (goal * 0.85)) {
                console.log('cran 3 : between ', goal * 0.75,' et ', goal * 0.85);
                this.partie.player.score += 150;
                this.showScore("+150", "good");
                this.scoreGood.play();

            } else if (pourcentFill < (goal * 0.75)) {
                console.log('cran 4 : bellow ', goal * 0.75);
                this.partie.player.score -= 150;
                this.showScore("-150", "bad");
                this.beepDrink.play();

            }
        }
        this.game.registry.set("partie", this.partie);
    }

    showScore(score, status){
        console.log("showScore");
        this.scoreText = this.add.text(gameScale.width*0.9, gameScale.height*0.077, score, {
            fontFamily: 'alpinoBold',
            // fontSize: gameScale.width * 0.06 + 'px',
            align: 'center',
        }).setOrigin(0.5, 0.5).setStroke('#252422', 7);
        if(status === "perfect"){
            this.scoreText.setFill('#FFA364');
        } else if(status === "bad"){
            this.scoreText.setFill('#DD4075');
        } else if(status === "good"){
            this.scoreText.setFill('#EFECEA');
        }
        this.tweens.addCounter({
            from: 0,
            to: 1,
            duration: 175,
            yoyo: false,
            onUpdate: (tween) => {
                const v = tween.getValue();
                this.scoreText.setFontSize(gameScale.width*0.05 + v * gameScale.width*0.02);
            }
        });
    }

    tooMuch() {
        if(!this.isTooMuch){
            console.log("tooMuch");
            this.cameras.main.shake(200);
            this.partie.player.score -= 200;
            this.isTooMuch = true;
            this.showScore("-200", "bad");
            this.beepDrink.play();
        }
    }
}

export default PourInShakerScene;