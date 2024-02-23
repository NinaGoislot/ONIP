import Phaser from 'phaser';
import {gameScale, socket} from '../main.js';

const URL_BOTTLES = "./media/img/bouteilles/",
    GRID_NBR_ROW = 3,
    GRID_NBR_COL = 7,
    BOTTLE_GAP_Y_BEGINNING = 0.22,
    BOTTLE_GAP_Y_BETWEEN = 0.225,
    BOTTLE_GAP_X = 0.125,
    BOTTLE_IMG_TAILLE = 0.122;

class CabinetScene extends Phaser.Scene {
  constructor() {
    super({
      key: 'CabinetScene'
    });
  }

  preload(){
    this.load.image('armoireBouteilles', './media/img/armoire-deco.webp');

    this.bottlesData = this.game.registry.get('ingredients');
    this.bottleImgKeys = [];
    this.load.path = URL_BOTTLES;
    for (let i = 1; i <= this.bottlesData.length; i++) {
      this.load.image(`bouteille${i}`, `bouteille${i}.webp`);
      this.bottleImgKeys.push(`bouteille${i}`);
    }
  }

  create() {
    // add background to scene
    let background = this.add.image(gameScale.width / 2, gameScale.height / 2, 'armoireBouteilles');
    background.displayWidth = gameScale.width;
    background.displayHeight = gameScale.width / background.width * background.height;
    window.addEventListener('resize', () => {
        background.displayWidth = gameScale.width;
        background.displayHeight = gameScale.width / background.width * background.height;
        background.setPosition(gameScale.width/2, gameScale.height/2)
    });

    // Récupérer les données de bottles depuis le registre
    // Utiliser la fonction pour obtenir le tableau d'indices aléatoires
    this.randomIndices = this.generateRandomIndices(20);
    this.createBoxBottle(GRID_NBR_ROW, GRID_NBR_COL);
    this.aJuiceTaken = false;
    this.currentCustomer = this.game.registry.get('customerData');
    this.partie = this.game.registry.get('partie');

    // ***************************************** SOCKET *****************************************

    // fonctionnalité du multijoueur avec la bouteille prise 
    socket.on('JUICE_TAKEN', (bottleId)=>{
      if(!this.game.registry.get('isSolo') && !this.aJuiceTaken){
        let takenBottleImg = this.getBottleImg(bottleId);
        takenBottleImg.setInteractive(false);
        takenBottleImg.visible = false;
        let roomIdJoueur = this.game.registry.get('roomIdJoueur');
        socket.emit('A_JUICE_IS_TAKEN', this.aJuiceTaken, roomIdJoueur);
      }
    })

    //pour éviter de redéclencher la fonction de disparition de bouteille
    socket.on('A_JUICE_TAKEN', (isAJuiceTaken)=>{
      this.aJuiceTaken = isAJuiceTaken;
    })
  }

  // ***************************************** FONCTIONS *****************************************

  createBoxBottle(nbrRow,nbrCol ){
    let posYScale = BOTTLE_GAP_Y_BEGINNING;
    let posY = gameScale.height*posYScale
    let k = 0;
    this.tabBottle = [];
    for(let i = 0; i < nbrRow; i++){
      let posXScale = BOTTLE_GAP_X;
      let posX = gameScale.width*posXScale
      for(let j = 0; j < nbrCol; j++){
        if(j==3 & i==1){
          posXScale += BOTTLE_GAP_X
          posX = gameScale.width*posXScale ;
        } 
        else{
          let bottleAssocie = this.getBottleById(this.randomIndices[k]);
          const imageKey = this.bottleImgKeys.find(image => image == `bouteille`+bottleAssocie.id);
          let bottleImg = this.add.image(posX,posY, imageKey)
          bottleImg.displayWidth = gameScale.width*BOTTLE_IMG_TAILLE
          bottleImg.displayHeight = gameScale.width*BOTTLE_IMG_TAILLE
          // pour le responsive
          let bottlePositionX = posXScale
          let bottlePositionY = posYScale
          window.addEventListener('resize', () => {
            bottleImg.displayWidth = gameScale.width*BOTTLE_IMG_TAILLE;
            bottleImg.displayHeight = gameScale.width*BOTTLE_IMG_TAILLE;
            bottleImg.setPosition(gameScale.width*bottlePositionX, gameScale.height*bottlePositionY)
          });
          bottleImg.setInteractive().on('pointerdown', () => this.selectJuice(bottleAssocie));
          posXScale += BOTTLE_GAP_X
          posX = gameScale.width*posXScale;
          k += 1;
          this.tabBottle.push(bottleImg);
        }
      }
      posYScale += BOTTLE_GAP_Y_BETWEEN
      posY = gameScale.height*posYScale;
    }
  }

  generateRandomIndices(tabLength) {
    var indices = Array.from({ length: tabLength }, (_, index) => index + 1);
    // Mélanger le tableau de manière aléatoire
    for (var i = indices.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    return indices;
  }  

  getBottleById(id) {
    return this.bottlesData.find(bottle => bottle.id == id);
  }

  getBottleImg(bottleId){
    return this.tabBottle.find(image => image.texture.key == `bouteille`+bottleId)
  }

  selectJuice(juiceType) {
    console.log(`Vous avez sélectionné ${juiceType.name}.`);
    this.juicePicked(juiceType);
    this.game.registry.set('playerJuiceChoice', juiceType.name);
    let roomIdJoueur = this.game.registry.get('roomIdJoueur');
    socket.emit("SELECT_JUICE", juiceType.id, roomIdJoueur);
    this.currentCustomer.indexNbrBottleChoosed += 1;
    // this.scene.start('GameScene');
    console.log("Je dois emit au serveur GO_TO_POUR");
    socket.emit("GO_TO_POUR", this.partie.roomId, this.partie.player.numeroPlayer);
    this.scene.start('PourInShakerScene');
  }

  juicePicked(juice){
    let juices = this.game.registry.get('ingredients');
    juices[juice.id].picked = true
    this.game.registry.set('ingredients', juices);
  }

  unPickedJuices(){
    let juices = this.game.registry.get('ingredients');
    for(let i=0; i<juices.length;i++){
      juices[i].picked = false;
    }
  }


}

export default CabinetScene;