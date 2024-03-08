import {
    gameScale,
    socket
} from '../main.js';
var timer;

class TimerScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'TimerScene', active:true
        });
    }

    create() {
        console.log('TimerScene???');
        timer = this.time.addEvent({
            // delay: 5000,
            delay: 480000,
            // delay: 300000,
            paused: false
        });

        // this.input.on('pointerdown', function () {
        //     timer.paused = !timer.paused;
        // });

        this.chronoImg = this.add.image(gameScale.width*1, gameScale.height*1, 'chrono').setOrigin(1,1);
        this.chronoImg.displayWidth = gameScale.width * 0.18;
        this.chronoImg.scaleY = this.chronoImg.scaleX;
        this.textChrono = this.add.text(gameScale.width*1 - gameScale.width*0.08, gameScale.height*1 - gameScale.height * 0.07, '', {
            fill: '#252422',
            fontFamily:'alpinoMedium',
            fontSize:  gameScale.width*0.038 + 'px',
            align: 'center'
        }).setOrigin(0.5, 0.5);
        this.textLastClient = this.add.text(gameScale.width*1 - gameScale.width*0.08, gameScale.height*1 - gameScale.height * 0.06, 'Fin de service', {
            fill: '#252422',
            fontFamily:'soria',
            fontSize:  gameScale.width*0.02 + 'px',
            align: 'center'
        }).setOrigin(0.5, 0.5).setVisible(false);



        // socket.on("NOMORE_CLIENT", (peutPlus) => {
        //     this.textLastClient.setVisible(true);
        //     this.textChrono.setVisible(false);
        //     this.timerFinished = !peutPlus;
        //     console.log('TEMPS DE JEU FINI ', this.timerFinished);
        //     // this.lastClient.play();
        // });
    }

    update() {
        // Convertir le temps restant en minutes et secondes
        let remainingTime = timer.getRemainingSeconds();
        if(remainingTime <= 0 || this.timerFinished){
            this.textLastClient.setVisible(true);
            this.textChrono.setVisible(false);
            // this.lastClient = this.sound.add('lastClient');
            // this.lastClient.play();
            // this.text.setText('Fin de service');
        } else{
            let minutes = Math.floor(remainingTime / 60);
            let seconds = Math.floor(remainingTime % 60);
            // Formater le texte pour l'affichage
            let timerText = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
            this.textChrono.setText(timerText);
        }
        
    }
}

export default TimerScene;