import Phaser from 'phaser';
import {
    gameScale,
    socket
} from '../main.js';

class GameCanva extends Phaser.GameObjects.Graphics {
    constructor(scene, customer, score) {
        super(scene);
        scene.add.existing(this);

        // ATTRIBUTS
        this.customer = customer;
        this.scene = scene;
        this.score = score;
        // this.isTalking = false;
        this.isTalking = "null"
        this.draw();
    }

    // FONCTIONS

    draw() {
        // Créer l'image du client à la place du point bleu
        this.clientImage = this.scene.add.sprite(gameScale.width * 0.15, gameScale.height, this.customer.picture).setOrigin(0.5, 1);
        // this.clientImage.setScale(0.1);
        // this.clientImage.setVisible(true);
        this.clientImage.displayWidth = gameScale.width * 0.3;
        this.clientImage.scaleY = this.clientImage.scaleX
        //responsive client
        window.addEventListener('resize', () => {
            this.clientImage.displayWidth = gameScale.width * 0.3;
            this.clientImage.scaleY = this.clientImage.scaleX
            this.clientImage.setPosition(gameScale.width * 0.15, gameScale.height)
        });
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
            frames: [
                { key: this.customer.picture, frame: 6, },
                { key: this.customer.picture, frame: 6, },
                { key: this.customer.picture, frame: 6, },
                { key: this.customer.picture, frame: 6, },
                { key: this.customer.picture, frame: 7, },
                { key: this.customer.picture, frame: 8, },
                { key: this.customer.picture, frame: 8, },
                { key: this.customer.picture, frame: 8, },
                { key: this.customer.picture, frame: 8, },
                { key: this.customer.picture, frame: 8, },
                { key: this.customer.picture, frame: 8, }
            ],
            frameRate: 6,
            repeat: -1
        })

        // Afficher la bulle de dialogue
        let fontSize = gameScale.width * 0.02
        let bubbleWrap = gameScale.width*0.25
        this.bubble = this.scene.add.text(gameScale.width * 0.25, gameScale.height*0.2, "", {
            fontSize: fontSize + 'px',
            fill: '#fff',
            wordWrap: { width: bubbleWrap },
            lineSpacing: 10
        });
        //responsive text
        window.addEventListener('resize', () => {
            fontSize = gameScale.width * 0.02
            bubbleWrap = gameScale.width*0.25
            this.bubble.setFontSize(fontSize);
            this.bubble.setWordWrapWidth(bubbleWrap)
            this.bubble.wordWrap = { width: gameScale.width * 0.25 };
            this.bubble.setPosition(gameScale.width * 0.25, gameScale.height*0.2)
        });

        this.displayScore = this.scene.add.text(20, 20, this.score, {
            fontSize: '16px',
            fill: '#fff'
        });
    }

    remove() {
        this.clientImage.setVisible(false);
        this.bubble.setVisible(false);
        this.displayScore.setVisible(false);
    }

    updateDialogue(dialogue) {
        this.customer.currentDialogue = dialogue; // Afficher le dialogue progressivement
        this.writeDialogue(this.customer.currentDialogue);
        this.animClientTalk(this.isTalking)
    }

    animClientTalk(isTalking) {
        if (isTalking == "talk") {
            this.clientImage.play('clientTalk')
            this.isTalking = "isTalking"
        } else if (isTalking == "stop") {
            this.clientImage.anims.restart();
            this.clientImage.stop('clientTalk')
            this.clientImage.play('blink');
        }
    }

    updateScore(score) {
        this.score = score;
        this.displayScore.setText(this.score)
    }

    finalDialogue() {
        if (this.customer.succeed != null) {
            if (this.customer.succeed) {
                this.writeDialogue(this.customer.successText);
            } else {
                this.writeDialogue(this.customer.failureText);
            }
        }
    }

    writeDialogue(dialogue) {
        this.bubble.setText(dialogue);
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
}

export default GameCanva;