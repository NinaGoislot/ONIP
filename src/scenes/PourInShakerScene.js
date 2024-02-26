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

    preload() {
        this.load.image('bg-shaker', './media/img/shaker/ecran-shaker-bg.webp');
        this.load.image('shaker-servir', './media/img/shaker/shaker-servir.webp');
        // this.load.image('shaker-cache', './media/img/shaker/shaker-cache.webp');
        this.load.html('shakerCanvas', './html/shakerCanvas.html');
    }

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


        // ******************************** SHAKER SERVIR ********************************
        this.pourcentBottle = this.getQuantityForSelectedBottle();
        console.log("pourcentage de la bouteille :", this.pourcentBottle)
        this.bottleChoosedData = this.getIngredientsById();

        let rectangle = this.add.rectangle(gameScale.width * 0.9, gameScale.height * 0.9, 100, 100, 0x6666ff, 0.5);
        rectangle.setInteractive({
            cursor: 'pointer'
        });

        rectangle.on('pointerdown', () => {
            this.liquid.isFilling = true;
        });

        rectangle.on('pointerup', () => {
            this.liquid.isFilling = false;
            rectangle.disableInteractive();
            this.renduScore(this.liquid.fillPercentage);
        })

        this.liquid = new LiquidShaker(this, 0, 0.05, false, this.bottleChoosedData.color, this.pourcentBottle);
        // console.log('test ligne placement :', (100-this.liquid.fillGoal)/100 * shakerService.displayHeight)
        // console.log('test ligne placement2 :', (100-this.liquid.fillGoal)/100 * shakerService.displayHeight - gameScale.height*0.12)

        if (this.partie.liquids.length > 0) {
            this.liquid.fillPercentage = this.partie.liquids[this.partie.liquids.length - 1].fillPercentage;
            console.log(this.liquid.fillPercentage)
            for (let i = this.partie.liquids.length - 1; i >= 0; i--) {
                var filledHeight = this.insideShaker.height * (this.partie.liquids[i].fillPercentage / 100);
                var emptyHeight = this.insideShaker.height - filledHeight;
                this.ctx.fillStyle = this.partie.liquids[i].fillColor;
                this.ctx.fillRect(this.insideShaker.x, this.insideShaker.y + emptyHeight, this.insideShaker.width, filledHeight);
            }
        }

        this.goal = (100 - this.liquid.fillGoal - this.liquid.fillPercentage) / 100 * (shakerService.displayHeight - gameScale.height * 0.1) - gameScale.height * 0.025
        this.shakerLigneMoy.style.top = this.goal + 'px';

        console.log(100 - this.liquid.fillGoal - this.liquid.fillPercentage);
        console.log(shakerService.displayHeight - gameScale.height * 0.1);
        console.log(gameScale.height);


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

        socket.on("GAME_PAUSED", (secondPaused) => {
            this.canva.startPause(this.scene, this, secondPaused);
        });

        socket.on("NOMORE_CLIENT", (peutPlus) => {
            this.partie.addCustomer = peutPlus;
            this.game.registry.set('partie', this.partie);
            this.add.text(gameScale.width * 0.8, gameScale.height * 0.1, 'Dernier client', {
                fill: '#EFECEA',
                fontFamily: 'soria',
                fontSize: gameScale.width * 0.03 + 'px'
            });
        });

        socket.on("POURING", (isPouring) => {
            console.log("isPouring : ", isPouring);
            if (isPouring) {
                this.liquid.isFilling = true;
            } else {
                this.liquid.isFilling = false;
                this.renduScore(this.liquid.fillPercentage);
                if (this.nbrBottleChoose == this.nbrBoucle) {
                    setTimeout(() => {
                        this.openGameScene();
                    }, 1000);
                } else {
                    setTimeout(() => {
                        this.openCabinet();
                    }, 1000);
                };
            }
        });

        if (!this.partie.addCustomer) {
            this.add.text(gameScale.width * 0.8, gameScale.height * 0.1, 'Dernier client', {
                fill: '#EFECEA',
                fontFamily: 'soria',
                fontSize: gameScale.width * 0.03 + 'px'
            });
        }
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
                this.liquid.fillPercentage = Math.min(this.liquid.fillPercentage + this.liquid.fillSpeed, this.partie.liquids[this.partie.liquids.length - 1].fillPercentage + this.liquid.fillGoal + 5);
                if (this.liquid.fillPercentage == this.partie.liquids[this.partie.liquids.length - 1].fillPercentage + this.liquid.fillGoal + 5) {
                    return (this.tooMuch())
                }
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
        this.partie.liquids.push(this.liquid);
        this.game.registry.set('partie', this.partie);
        //console.log("je push",this.liquid, this.partie.liquids)
        this.bottlesData = this.game.registry.get('ingredients');
        this.bottleChoosed.picked = false;
        this.bottlesData[this.bottleChoosed.id - 1].picked = false;
        this.game.registry.set('ingredients', this.bottlesData);
        socket.emit("JUICE_RETURNED", this.bottlesData, this.bottleChoosed, this.partie.roomId);
        //console.log("je rends le jus", this.bottlesData, this.bottleChoosed, this.partie.roomId);
        socket.emit("GO_TO_CABINET", this.partie.roomId, this.partie.player.numeroPlayer);
        this.scene.start("CabinetScene");
        // this.scene.stop('PourInShakerScene');
        // this.scene.resume('CabinetScene');
        // this.scene.wake('CabinetScene');
    }

    openGameScene() {
        this.bottlesData = this.game.registry.get('ingredients');
        this.bottleChoosed.picked = false;
        this.bottlesData[this.bottleChoosed.id - 1].picked = false;
        this.game.registry.set('ingredients', this.bottlesData);
        socket.emit("JUICE_RETURNED", this.bottlesData, this.bottleChoosed, this.partie.roomId);
        socket.emit("POURING_FINISHED", this.partie.roomId, this.partie.player.numeroPlayer);
        // const scenes = this.scene.getScenes(true);
        // // Compter le nombre d'instances de GameScene
        // let gameSceneCount = 0;
        // scenes.forEach(scene => {
        //     if (scene.scene.key === 'GameScene') {
        //         gameSceneCount++;
        //     }
        // });
        // // Si plus d'une instance de GameScene est active, les arrêter toutes
        // if (gameSceneCount > 1) {
        //     scenes.forEach(scene => {
        //         if (scene.scene.key === 'GameScene') {
        //             scene.scene.stop();
        //         }
        //     });
        // }
        // this.scene.stop('CabinetScene');
        this.scene.start("GameScene");
    }

    renduScore(pourcentFill) {
        if (!this.isTooMuch) {
            if (pourcentFill >= (this.goal - this.goal * 0.95) && pourcentFill < (this.goal + this.goal * 0.95)) {
                this.partie.player.score += 500;
                this.partie.player.perfectPourring += 1;
            } else if (pourcentFill > (this.goal - this.goal * 0.90) && pourcentFill < (this.goal - this.goal * 0.95)) {
                this.partie.player.score += 250;
            } else if (pourcentFill > (this.goal - this.goal * 0.85) && pourcentFill < (this.goal - this.goal * 0.90)) {
                this.partie.player.score += 150;
            } else if (pourcentFill < (this.goal - this.goal * 0.85)) {
                this.partie.player.score -= 150;
            }
        }

        this.game.registry.set("partie", this.partie);
    }
    tooMuch() {
        this.cameras.main.shake(1000);
        this.partie.player.score -= 200;
        this.isTooMuch = true;
    }
}

export default PourInShakerScene;