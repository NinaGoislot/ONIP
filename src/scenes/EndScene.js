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

    // preload() {
    //     this.load.image('ecran-victoire', './media/img/score/score-victoire.webp');
    //     this.load.image('ecran-defaite', './media/img/score/score-défaite.webp');
    // }

    create() {
        this.partie = this.game.registry.get('partie');
        console.log(this.partie.mode);
        this.scene.stop('TimerScene');

        if (this.partie.mode === "solo") {
            this.background = this.add.image(gameScale.width / 2, gameScale.height / 2, 'ecran-victoire');
            this.drawScene();
            this.winMusic = this.sound.add('win');
            this.winMusic.play();
        }
        if (this.partie.mode == "multi") {
            socket.emit("SCORE", this.partie.player.playerId, this.partie.player.score);
            socket.on("SCORE_PLAYER", (playerWin) => {
                if (playerWin == "V") {
                    console.log("victoire")
                    this.background = this.add.image(gameScale.width / 2, gameScale.height / 2, 'ecran-victoire');
                    this.drawScene();
                    this.winMusic = this.sound.add('win');
                    this.winMusic.play();
                }
                if (playerWin == "D") {
                    console.log("défaite")
                    this.background = this.add.image(gameScale.width / 2, gameScale.height / 2, 'ecran-defaite');
                    this.drawScene();
                    this.loseMusic = this.sound.add('lose');
                    this.loseMusic.play();
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
        console.log("retour au MenuScene");
        this.scene.start('MenuScene');
        // this.scene.run('MenuScene');
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

        let scoreText = this.add.text(gameScale.width * 0.211, gameScale.height * 0.305, 0, {
            fill: '#FFF4E3',
            fontFamily: 'soria',
            fontSize: gameScale.width * 0.07 + 'px',
            align: 'center'
        }).setOrigin(0.5, 0.5);

        let currentScore = 0;
        let newScore = this.partie.player.score;
        this.tweens.addCounter({
            from: currentScore,
            to: newScore,
            duration: 2000,
            ease: 'linear',
            onUpdate: tween =>
            {
                const value = Math.round(tween.getValue() / 50) * 50; // Augmente de 50 en 50
                // const value = Math.round(tween.getValue());
                scoreText.setText(`${value}`);
            }
        });

        // this.menuMusicAH = this.game.registry.get('musicMenu');
        // console.log("musique2", this.menuMusicAH)
        // this.menuMusicAH.play();
        // this.menuMusicAH = this.game.registry.set('musicMenu',this.menuMusicAH);
        this.gameMusic = this.game.registry.get('music');
        console.log("musique", this.gameMusic,this.gameMusic.isPlaying)
        if(this.gameMusic.isPlaying){
            console.log("oui gameMusic is playing")
            this.gameMusic.stop();
            this.gameMusic = this.game.registry.set('music',this.gameMusic);
        }
        console.log("après if");
        this.menuMusic = this.sound.add('menu', {loop:true});
        this.menuMusic.play();
        this.game.registry.set('musicMenu', this.menuMusic);
        console.log("après if menuMusic", this.menuMusic);
        


        let pseudoPlayer = this.add.text(gameScale.width * 0.515, gameScale.height * 0.865, this.partie.player.pseudo, {
            fill: '#252422',
            fontFamily: 'alpino',
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