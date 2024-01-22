import './../style.css'
import Phaser from 'phaser'

const VALUES = {
  width:500,
  height:500,
  speedDown:300
}

class GameScene extends Phaser.Scene{
  constructor(){super("scene-game")}

  preload(){

  }

  create(){
    
  }

  update(){
    
  }
}

const config = {
  type:Phaser.AUTO,
  width:VALUES.width,
  height:VALUES.height,
  canvas:gameCanvas,
  physics:{
    default:"arcade",
    arcade:{
      gravity:{y:VALUES.speedDown},
      debug:true
    }
  }
}

const game = Phaser.game(config)
