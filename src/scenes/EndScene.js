import {
    gameScale,
    socket
} from '../main.js';

class EndScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'EndScene'
        });
    }

    preload() {
        this.load.image('ecran-victoire', './media/img/score/score-victoire.webp');
        this.load.image('ecran-defaite', './media/img/score/score-défaite.webp');
    }

    create() {
        this.partie = this.game.registry.get('partie');
        console.log(this.partie.mode);

        if (this.partie.mode === "solo") {
            this.background = this.add.image(gameScale.width / 2, gameScale.height / 2, 'ecran-victoire');
            this.drawScene();
        }
        if (this.partie.mode == "multi") {
            socket.emit("SCORE", this.partie.player.playerId, this.partie.player.score);
            socket.on("SCORE_PLAYER", (playerWin) => {
                if (playerWin == "V") {
                    console.log("victoire")
                    this.background = this.add.image(gameScale.width / 2, gameScale.height / 2, 'ecran-victoire');
                    this.drawScene();
                }
                if (playerWin == "D") {
                    console.log("défaite")
                    this.background = this.add.image(gameScale.width / 2, gameScale.height / 2, 'ecran-defaite');
                    this.drawScene();
                }
            })
            // socket.on("SCORE_OTHER_PLAYER", (score) => {
            //     if (score > this.partie.player.score) {
            //         this.partie.player.win = "D";
            //     } else {
            //         this.partie.player.win = "V";
            //     }
            //     this.game.registry.set('partie', this.partie);
            //     console.log("score vs", this.partie.player.score, score, this.partie.player.win);
            // });

            // if (this.partie.player.win == "V") {
            //     console.log("victoire")
            //     this.background = this.add.image(gameScale.width / 2, gameScale.height / 2, 'ecran-victoire');
            //     this.drawScene();
            // }
            // if (this.partie.player.win == "D") {
            //     console.log("défaite")
            //     this.background = this.add.image(gameScale.width / 2, gameScale.height / 2, 'ecran-defaite');
            //     this.drawScene();
            // }
        }
    }

    goToMenu() {
        // Retour au menu
        this.scene.start('MenuScene');
    }

    rePlay() {
        console.log('not yet');
    }

    drawScene() {
        this.background.displayWidth = gameScale.width;
        this.background.displayHeight = gameScale.width / this.background.width * this.background.height;
        //resize
        window.addEventListener('resize', () => {
            this.background.displayWidth = gameScale.width;
            this.background.displayHeight = gameScale.width / this.background.width * this.background.height;
            this.background.setPosition(gameScale.width / 2, gameScale.height / 2);
        });

        let scoreText = this.add.text(gameScale.width * 0.211, gameScale.height * 0.305, this.partie.player.score, {
            fill: '#FFF4E3',
            fontFamily: 'soria',
            fontSize: gameScale.width * 0.07 + 'px',
            align: 'center'
        }).setOrigin(0.5, 0.5);

        let pseudoPlayer = this.add.text(gameScale.width * 0.515, gameScale.height * 0.865, this.partie.player.pseudo, {
            fill: '#252422',
            fontFamily: 'soria',
            fontSize: gameScale.width * 0.024 + 'px',
            align: 'center'
        }).setOrigin(0.5, 0.5);

        //boutons
        let btnRePlay = this.add.rectangle(gameScale.width * 0.89, gameScale.height * 0.745, gameScale.width * 0.14, gameScale.height * 0.09, 0x6666ff, 0).setOrigin(0.5, 0.5).setInteractive({
            cursor: 'pointer'
        }).on('pointerdown', () => this.goToMenu());

        let btnQuit = this.add.rectangle(gameScale.width * 0.89, gameScale.height * 0.86, gameScale.width * 0.14, gameScale.height * 0.09, 0x6666ff, 0).setOrigin(0.5, 0.5).setInteractive({
            cursor: 'pointer'
        }).on('pointerdown', () => this.goToMenu());
    }
}

export default EndScene;