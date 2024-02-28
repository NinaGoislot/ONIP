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
        timer = this.time.addEvent({
            // delay: 5000,
            delay: 300000,
            paused: false
        });

        // this.input.on('pointerdown', function () {
        //     timer.paused = !timer.paused;
        // });

        this.text = this.add.text(gameScale.width*0.07, gameScale.height * 0.05, '', {
            fill: '#252422',
            fontFamily:'soria',
            fontSize:  gameScale.width*0.02 + 'px',
            align: 'center'
        }).setOrigin(0.5, 0.5);

        socket.on("NOMORE_CLIENT", (peutPlus) => {
            this.text.setText('Dernier client');
            this.timerFinished = !peutPlus;
            console.log(this.timerFinished);
        });
    }

    update() {
        // this.text.setFill(timer.paused ? 'red' : '#252422').setText(timer.getRemainingSeconds().toFixed(1));
        // Convertir le temps restant en minutes et secondes
        let remainingTime = timer.getRemainingSeconds();
        if(remainingTime <= 0 || this.timerFinished){
            this.text.setText('Dernier client');
        } else{
            let minutes = Math.floor(remainingTime / 60);
            let seconds = Math.floor(remainingTime % 60);
            // Formater le texte pour l'affichage
            let timerText = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
            this.text.setText(timerText);
        }
        
    }
}

export default TimerScene;