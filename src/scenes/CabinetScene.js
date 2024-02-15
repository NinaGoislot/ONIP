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
    this.partie = this.game.registry.get('partie');
    this.currentCustomer = this.game.registry.get('customerData');
    this.drinkBottles = this.currentCustomer.drink.ingredients;
    this.bottlesData = this.game.registry.get('ingredients');
    console.log('ingredientsData', this.bottlesData);

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
    this.randomIndices = this.partie.tabBottles;
    this.createBoxBottle(GRID_NBR_ROW, GRID_NBR_COL);
    this.aJuiceTaken = false;

    // ***************************************** SOCKET *****************************************
    socket.on("GAME_PAUSED", (secondPaused) => {
      this.canva.startPause(this.scene, this, secondPaused);
    })

    socket.on("NOMORE_CLIENT", (peutPlus) => {
      this.partie.addCustomer = peutPlus;
      this.add.text(gameScale.width * 0.8, gameScale.height * 0.1, 'Dernier client', {
          fontSize: '32px',
          fill: '#fff'
      });
    })

    // fonctionnalité du multijoueur avec la bouteille prise 
    socket.on('JUICE_TAKEN', (bottleId, bottlesData)=>{
      if(!(this.partie.mode === "solo") && !this.aJuiceTaken){
        let takenBottleImg = this.getBottleImg(bottleId);
        takenBottleImg.setInteractive(false);
        takenBottleImg.visible = false;
        this.game.registry.set('ingredients', bottlesData);
        this.bottlesData = this.game.registry.get('ingredients');
        socket.emit('A_JUICE_IS_TAKEN', this.aJuiceTaken, this.partie.roomId);
        console.log("on t'a pris un jus");
      }
    })

    socket.on('A_JUICE_IS_RETURNED', (bottlesData, bottleChoosed)=>{
      this.game.registry.set('ingredients', bottlesData);
      this.bottlesData = this.game.registry.get('ingredients');
      let returnBottleImg = this.getBottleImg(bottleChoosed.id);
      returnBottleImg.setInteractive(true);
      returnBottleImg.visible = true;
      console.log('image de la bouteille retournée',returnBottleImg)
    })


    //pour éviter de redéclencher la fonction de disparition de bouteille
    socket.on('A_JUICE_TAKEN', (isAJuiceTaken)=>{
      console.log("est-ce que ça sert ?????????????????????????")
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
          bottleImg.visible = true;
          if(this.bottlesData[bottleAssocie.id-1].picked == true){
            console.log('déjà pris', this.bottlesData[bottleAssocie.id-1].name )
            bottleImg.visible = false;
          }
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

  getBottleById(id) {
    return this.bottlesData.find(bottle => bottle.id == id);
  }

  getBottleImg(bottleId){
    return this.tabBottle.find(image => image.texture.key == `bouteille`+bottleId)
  }

  selectJuice(juiceType) {
    // console.log(`Vous avez sélectionné ${juiceType.name}.`);
    this.goodOrBad = this.goodOrBadBottle(juiceType);
    if(this.goodOrBad){
      this.juicePicked(juiceType);
      socket.emit("SELECT_JUICE", juiceType.id, this.partie.roomId, this.bottlesData);
      console.log("je prends un jus");
      if(juiceType.id == this.partie.goldBottleId){
        //************************** ICI SCORE GOLD BOTTLE ****************************** */
        // console.log("CONGRATS that's a gold bottle");
      }
      this.currentCustomer.indexNbrBottleChoosed += 1;
      // this.scene.start('GameScene');
      this.scene.start('PourInShakerScene', {
        'bottleChoosed': juiceType
    });
    } else {
      //************************** ICI FAIRE PERDRE DU TEMPS ****************************** */
      // console.log('FAIRE PERDRE DU TEMPS')
    }
  }

  goodOrBadBottle(juice) {
    const drinkBottle = this.drinkBottles.find(bottle => bottle.alcoholId == juice.id);
    if (drinkBottle) {
        const alreadyChosen = this.partie.tabBottlesChoosed.find(id => id == juice.id);
        if (alreadyChosen) {
            return false;
        }
        this.partie.tabBottlesChoosed.push(juice.id);
        return true;
    }
    return false;
  }

  juicePicked(juice){
    this.bottlesData = this.game.registry.get('ingredients');
    this.bottlesData[juice.id-1].picked = true
    console.log(this.bottlesData[juice.id-1])
    // console.log(this.bottlesData[juice.id-1].picked)
    this.game.registry.set('ingredients', this.bottlesData);
  }

}

export default CabinetScene;