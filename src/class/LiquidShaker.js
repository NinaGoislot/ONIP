import Phaser from 'phaser';
import Player from './Player';

class LiquidShaker extends Phaser.Scene {
    constructor(scene, fillPercentage, fillSpeed, isFilling, fillColor, fillGoal) {
        super(scene);

        // ATTRIBUTS
        this.fillPercentage = fillPercentage;
        this.fillSpeed = fillSpeed;
        this.isFilling = isFilling;
        this.fillColor = fillColor;
        this.fillGoal = fillGoal;
        

    }
}

export default LiquidShaker;