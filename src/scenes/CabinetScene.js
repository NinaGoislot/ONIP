import Phaser from 'phaser';
import {
  gameScale,
  socket
} from '../main.js';

const 
  GRID_NBR_ROW = 3,
  GRID_NBR_COL = 7,
  BOTTLE_GAP_Y_BEGINNING = 0.22,
  BOTTLE_GAP_Y_BETWEEN = 0.225,
  BOTTLE_GAP_X = 0.125,
  BOTTLE_IMG_TAILLE = 0.122;
const POSITION_BOTTLE = [
  [-3, 1],
  [-2, 1],
  [-1, 1],
  [0, 1],
  [1, 1],
  [2, 1],
  [3, 1],
  [-3, 0],
  [-2, 0],
  [-1, 0],
  [1, 0],
  [2, 0],
  [3, 0],
  [-3, -1],
  [-2, -1],
  [-1, -1],
  [0, -1],
  [1, -1],
  [2, -1],
  [3, -1]
]

class CabinetScene extends Phaser.Scene {
  constructor() {
    super({
      key: 'CabinetScene'
    });
  }

  preload() {
    // this.load.image('armoireBouteilles', './media/img/armoire-deco.webp');
    // this.load.image('curseur', 'media/img/curseur/curseur.webp');

    // this.bottlesData = this.game.registry.get('ingredients');
    // this.bottleImgKeys = [];
    // this.load.path = URL_BOTTLES;
    // for (let i = 1; i <= this.bottlesData.length; i++) {
    //   this.load.image(`bouteille${i}`, `bouteille${i}.webp`);
    //   this.bottleImgKeys.push(`bouteille${i}`);
    // }

    // this.load.path = URL_CURSOR_REFUS;
    // for (let i = 0; i < LENGTH_CURSOR_REFUS; i++) {
    //   this.load.image(`curseur-refus${i}`, `curseur-refus_${i}.png`);
    // }
    // this.load.path = URL_CURSOR_MOVE;
    // for (let i = 0; i < LENGTH_CURSOR_MOVE; i++) {
    //   this.load.image(`move${i}`, `deplacement_${i}.png`);
    // }
    // this.load.path = URL_TRANSITION_VERSE;
    // for (let i = 0; i < LENGTH_TRANSI_VERSE; i++) {
    //     this.load.image(`transi-verse${i}`, `Transi-armoire-verse_${i}.png`);
    // }
  }

  create() {
    this.partie = this.game.registry.get('partie');
    this.currentCustomer = this.game.registry.get('customerData');
    this.drinkBottles = this.currentCustomer.drink.ingredients;
    this.bottlesData = this.game.registry.get('ingredients');
    this.canMove = true;
    // this.bottleImgKeys = this.game.registry.get('bottleImgKeys');
    this.cursorHaut = this.sound.add('cursorHaut');
    this.cursorGauche = this.sound.add('cursorGauche');
    this.cursorBas = this.sound.add('cursorBas');
    this.cursorDroite = this.sound.add('cursorDroite');
    this.bottlePOP = this.sound.add('bottlePOP');
    this.bottleDePOP = this.sound.add('bottleDePOP');
    this.beep = this.sound.add('beep');
    this.scoreBottle = this.sound.add('scoreBottle');
    this.scoreBottleGold = this.sound.add('scoreBottleGold');

    // add background to scene
    let background = this.add.image(gameScale.width / 2, gameScale.height / 2, 'armoireBouteilles');
    background.displayWidth = gameScale.width;
    background.displayHeight = gameScale.width / background.width * background.height;
    window.addEventListener('resize', () => {
      background.displayWidth = gameScale.width;
      background.displayHeight = gameScale.width / background.width * background.height;
      background.setPosition(gameScale.width / 2, gameScale.height / 2)
    });

    // Utiliser la fonction pour obtenir le tableau d'indices aléatoires
    this.randomIndices = this.partie.tabBottles;
    this.createBoxBottle(GRID_NBR_ROW, GRID_NBR_COL);
    this.aJuiceTaken = false;

    this.curseur = this.add.image(gameScale.width * 0.5, gameScale.height * 0.4475, 'curseur');
    // this.curseur.displayWidth = gameScale.width * 0.244;
    this.curseur.displayWidth = gameScale.width * 0.22;
    this.curseur.scaleY = this.curseur.scaleX;
    window.addEventListener('resize', () => {
      this.curseur.displayWidth = gameScale.width * 0.22;
      this.curseur.scaleY = this.curseur.scaleX;
      this.curseur.setPosition(gameScale.width * 0.5 + gameScale.width * BOTTLE_GAP_X * this.curseurX, gameScale.height * 0.4475 + gameScale.height * BOTTLE_GAP_Y_BETWEEN * this.curseurY);
    });
    this.curseurX = 0;
    this.curseurY = 0;

    this.animeAllCursorMove();
    this.animeCursorRefus();

    let rectangle = this.add.rectangle(gameScale.width * 0.9, gameScale.height * 0.9, 100, 100, 0x6666ff, 0);
    rectangle.setInteractive({
      cursor: 'pointer'
    });
    rectangle.on('pointerdown', () => this.openFictiveScene());


    this.cameras.main.on('camerashakestart', function () {
      console.log("debut")
      for (let i = 0; i < this.tabBottle.length; i++) {
        this.tabBottle[i][0].disableInteractive();
        // this.canMove = false;
      }
    }.bind(this));

    this.cameras.main.on('camerashakecomplete', function () {
      console.log("fini")
      for (let i = 0; i < this.tabBottle.length; i++) {
        this.tabBottle[i][0].setInteractive();
        // this.canMove = true;
      }
    }.bind(this));


    // ***************************************** SOCKET *****************************************
    socket.on("MOVE_CURSOR", (cursor) => {
      console.log("Je reçois le déplacement : " + cursor);
      if (this.canMove) {
        switch (cursor) {
          case "UP":
            this.haut();
            break;
          case "DOWN":
            this.bas();
            break;
          case "LEFT":
            this.gauche();
            break;
          case "RIGHT":
            this.droite()
            break;
          case "CLICK":
            this.getSelectBottle()
            break;
          default:
            console.log("CABINET_SCENE ► Aucun mouvement reconnu")
            break;
        }
      }
    });

    socket.on("GAME_PAUSED", (secondPaused) => {
      this.canva.startPause(this.scene, this, secondPaused);
    });

    socket.on("NOMORE_CLIENT", (peutPlus) => {
      console.log('NOMORE_CLIENT cabinetScene')
      this.partie.addCustomer = peutPlus;
      this.game.registry.set('partie', this.partie);
    });

    // fonctionnalité du multijoueur avec la bouteille prise 
    socket.on('JUICE_TAKEN', (bottleId, bottlesData) => {
      if (!(this.partie.mode === "solo") && !this.aJuiceTaken) {
        // let takenBottleImg = this.getBottleByFrameIndex(bottleId);
        for (const [image, position] of this.tabBottle) {
          // Obtenez le nom de la frame de l'image
          const frameName = image.frame.name;
          
          // Comparez le nom de la frame avec l'ID recherché
          if (parseInt(frameName) === bottleId-1) {
              // Si les IDs correspondent, image correspond à la bouteille recherchée
              console.log("Bouteille trouvée :", image);
              // Faites ce que vous voulez avec l'image ici
              // Par exemple, désactivez l'interaction avec l'image
              image.disableInteractive();
              // Rendez l'image invisible
              image.setVisible(false);
              // Sortez de la boucle car vous avez trouvé l'image correspondante
              break;
          }
      }
        // takenBottleImg[0].disableInteractive();
        // takenBottleImg[0].setVisible(false);
        this.game.registry.set('ingredients', bottlesData);
        this.bottlesData = this.game.registry.get('ingredients');
        socket.emit('A_JUICE_IS_TAKEN', this.aJuiceTaken, this.partie.roomId);
        console.log("on t'a pris un jus");
      }
    });

    socket.on('A_JUICE_IS_RETURNED', (bottlesData, bottleChoosed) => {
      this.game.registry.set('ingredients', bottlesData);
      this.bottlesData = this.game.registry.get('ingredients');
      // let returnBottleImg = this.getBottleImg(bottleChoosed.id);
      // returnBottleImg[0].setInteractive();
      // returnBottleImg[0].setVisible(true);
      for (const [image, position] of this.tabBottle) {
        // Obtenez le nom de la frame de l'image
        const frameName = image.frame.name;
        
        // Comparez le nom de la frame avec l'ID recherché
        if (parseInt(frameName) === bottleChoosed.id-1) {
            // Si les IDs correspondent, image correspond à la bouteille recherchée
            console.log("Bouteille trouvée :", image);
            // Faites ce que vous voulez avec l'image ici
            // Par exemple, désactivez l'interaction avec l'image
            image.setInteractive();
            // Rendez l'image invisible
            image.setVisible(true);
            // Sortez de la boucle car vous avez trouvé l'image correspondante
            break;
        }
    }
    });


    //pour éviter de redéclencher la fonction de disparition de bouteille
    socket.on('A_JUICE_TAKEN', (isAJuiceTaken) => {
      console.log("est-ce que ça sert ?????????????")
      this.aJuiceTaken = isAJuiceTaken;
    });

    socket.on("A_GOLD_BOTTLE_IS_TAKEN", () => {
      console.log("A_GOLD_BOTTLE_IS_TAKEN cabinetScene");
      this.partie.goldBottleStatus = true;
      this.game.registry.set('partie', this.partie);
    });

    socket.once("NAVIGATE_FICTIVESCENE", (sens) => {
      this.openFictiveScene(sens);
    });

    socket.on("A_PLAYER_READY", () => {
      console.log('Sur Cabinet, je bacsule à GameScene pour nouveau client');
      socket.emit("CHANGE_TO_NEXT_CUSTOMER", this.partie.roomId, this.partie.player.numeroPlayer);
      this.partie.tooLateToServe = true;
      this.game.registry.set('partie', this.partie);
      this.removeSocket();
      this.scene.stop("CabinetScene");
      this.scene.stop("PourInShakerScene");
      this.scene.run("GameScene");
    });
  }

  // ***************************************** FONCTIONS *****************************************
  animeCursorRefus(){
    // this.anims.create({
    //   key: 'cursor_refus',
    //   frames: [
    //     {key: 'curseur-refus0'},
    //     {key: 'curseur-refus1'},
    //     {key: 'curseur-refus2'},
    //     {key: 'curseur-refus3'},
    //     {key: 'curseur-refus4'},
    //     {key: 'curseur-refus5'},
    //     {key: 'curseur-refus6'},
    //     {key: 'curseur-refus7'},
    //     {key: 'curseur-refus8'},
    //     {key: 'curseur-refus9'},
    //     {key: 'curseur-refus10'},
    //     {key: 'curseur-refus11'},
    //     {key: 'curseur-refus12'},
    //     {key: 'curseur-refus13'},
    //     {key: 'curseur-refus14'}
    //   ],
    //   frameRate: 30,
    //   repeat: 3
    // });
    this.anims.create({
      key: 'curseur-refus',
      frames: this.anims.generateFrameNumbers('curseur-refus', {
          start: 0,
          end: 14
      }),
      frameRate: 30,
      repeat: 3
    });
  }

  animCursorRefusPlay(){
    this.cursorRefus = this.add.sprite(this.curseur.x, this.curseur.y, 'curseur-refus');
    this.cursorRefus.displayWidth = gameScale.width * 0.22;
    this.cursorRefus.scaleY = this.cursorRefus.scaleX;
    this.curseur.setVisible(false);
    this.canMove = false;
    this.cursorRefus.anims.play('curseur-refus');

    this.cursorRefus.on('animationcomplete', function (animation) {          
      // Si l'animation est celle que vous surveillez, détruisez le sprite
      if (animation.key === 'curseur-refus') {
          this.cursorRefus.destroy();
          this.curseur.setVisible(true);
          this.canMove = true;
      };
    }, this);
  }

  animeAllCursorMove(){
    // this.anims.create({
    //   key: 'cursor_move',
    //   frames: [
    //     {key: 'move0'},
    //     {key: 'move1'},
    //     {key: 'move2'},
    //     {key: 'move3'},
    //     {key: 'move4'},
    //     {key: 'move5'},
    //     {key: 'move6'},
    //     {key: 'move7'},
    //     {key: 'move8'},
    //   ],
    //   frameRate: 30,
    //   repeat: 0 
    // });
    this.anims.create({
      key: 'curseur-move',
      frames: this.anims.generateFrameNumbers('curseur-move', {
          start: 0,
          end: 8
      }),
      frameRate: 30,
      repeat: 0
    });
  }

  animCursorStopMove(){
    this.cursorMove.on('animationcomplete', function (animation) {          
      if (animation.key === 'curseur-move') {
          this.curseur.setVisible(true);
          this.cursorMove.destroy();
          this.canMove = true;
      };
    }, this);
  }

  animeCursorMove() {
    this.cursorMove = this.add.sprite(this.curseur.x, this.curseur.y, 'curseur-move');
    this.cursorMove.displayWidth = gameScale.width * 0.22;
    this.cursorMove.scaleY = this.cursorMove.scaleX;
    this.curseur.setVisible(false);
    this.animCursorStopMove();
    this.canMove = false;
    this.cursorMove.anims.play('curseur-move');
  }

  createBoxBottle(nbrRow, nbrCol) {
    console.log('create bottle');
    let posYScale = BOTTLE_GAP_Y_BEGINNING;
    let posY = gameScale.height * posYScale
    let k = 0;
    this.tabBottle = [];
    for (let i = 0; i < nbrRow; i++) {
      let posXScale = BOTTLE_GAP_X;
      let posX = gameScale.width * posXScale
      for (let j = 0; j < nbrCol; j++) {
        if (j == 3 & i == 1) {
          posXScale += BOTTLE_GAP_X
          posX = gameScale.width * posXScale;
        } else {
          let bottleAssocie = this.getBottleById(this.randomIndices[k]);
          let imageKey = bottleAssocie.id-1;
          // const imageKey = this.bottleImgKeys.find(image => image == `bouteille` + bottleAssocie.id);
          let bottleImg = this.add.image(posX, posY, "bouteillesSprite", imageKey)
          // let bottleImg = this.add.image(posX, posY, imageKey)
          bottleImg.setVisible(true);
          if (this.bottlesData[bottleAssocie.id - 1].picked == true) {
            console.log('déjà pris', this.bottlesData[bottleAssocie.id - 1].name)
            bottleImg.setVisible(false);
          }
          bottleImg.displayWidth = gameScale.width * BOTTLE_IMG_TAILLE
          bottleImg.displayHeight = gameScale.width * BOTTLE_IMG_TAILLE
          // pour le responsive
          let bottlePositionX = posXScale
          let bottlePositionY = posYScale
          window.addEventListener('resize', () => {
            bottleImg.displayWidth = gameScale.width * BOTTLE_IMG_TAILLE;
            bottleImg.displayHeight = gameScale.width * BOTTLE_IMG_TAILLE;
            bottleImg.setPosition(gameScale.width * bottlePositionX, gameScale.height * bottlePositionY)
          });
          bottleImg.setInteractive().on('pointerdown', () => this.selectJuice(bottleAssocie));
          posXScale += BOTTLE_GAP_X
          posX = gameScale.width * posXScale;
          this.tabBottle.push([bottleImg, POSITION_BOTTLE[k]]);
          k += 1;
        }
      }
      posYScale += BOTTLE_GAP_Y_BETWEEN
      posY = gameScale.height * posYScale;
    }
  }

  droite() {
    this.curseurX += 1;
    if (this.curseurX >= 4) {
      this.curseurX -= 1;
      return;
    }
    this.curseur.setPosition(this.curseur.x + gameScale.width * BOTTLE_GAP_X, this.curseur.y);
    this.animeCursorMove();
    this.cursorDroite.play();
  }

  gauche() {
    this.curseurX -= 1;
    if (this.curseurX <= -4) {
      this.curseurX += 1;
      return;
    }
    this.curseur.setPosition(this.curseur.x - gameScale.width * BOTTLE_GAP_X, this.curseur.y);
    this.animeCursorMove();
    this.cursorGauche.play();
  }

  haut() {
    this.curseurY += 1;
    if (this.curseurY >= 2) {
      this.curseurY -= 1;
      return;
    }
    this.curseur.setPosition(this.curseur.x, this.curseur.y - gameScale.height * BOTTLE_GAP_Y_BETWEEN);
    this.animeCursorMove();
    this.cursorHaut.play();
  }

  bas() {
    this.curseurY -= 1;
    if (this.curseurY <= -2) {
      this.curseurY += 1;
      return;
    }
    this.curseur.setPosition(this.curseur.x, this.curseur.y + gameScale.height * BOTTLE_GAP_Y_BETWEEN);
    this.animeCursorMove();
    this.cursorBas.play();
  }

  getBottleAtCursor() {
    const [cursorX, cursorY] = [this.curseurX, this.curseurY];
    return this.tabBottle.find(([bottleImg, [bottleX, bottleY]]) => {
      return bottleX === cursorX && bottleY === cursorY;
    });
  }

  getSelectBottle() {
    this.bottleAtCursor = this.getBottleAtCursor();
    if (this.bottleAtCursor && this.bottleAtCursor[0]) {
      // const textureKey = this.bottleAtCursor[0].texture.key;
      // this.bottleAtCursorData = this.getBottleByName(textureKey);
      // this.selectJuice(this.bottleAtCursorData)

      const bottleImgKey = this.bottleAtCursor[0];
      const frameIndex = bottleImgKey.frame.name; // Get the frame index of the sprite
      console.log("getSelectBottle", bottleImgKey, frameIndex);
      // const bottleData = this.bottlesData[frameIndex]; // Assuming frame index corresponds to the bottle id
      const bottleAtCursorData = this.getBottleByFrameIndex(frameIndex);
      console.log("bottleData", bottleAtCursorData);
      this.selectJuice(bottleAtCursorData);
    } else {
      console.log("La bouteille à la position du curseur n'est pas valide.");
    }
  }

  getBottleByFrameIndex(frameIndex) {
    // frameIndex commence à 0, donc on ajoute 1 pour correspondre à l'ID de la bouteille
    return this.bottlesData.find(bottle => bottle.id === frameIndex + 1);
  }

  getBottleByName(name) {
    return this.bottlesData.find(bottle => bottle.image.slice(0, -5) == name);
  }

  getBottleById(id) {
    return this.bottlesData.find(bottle => bottle.id == id);
  }

  getBottleImg(bottleId) {
    return this.tabBottle.find(([image, position]) => image.texture.key == `bouteille` + bottleId)
  }

  selectJuice(juiceType) {
    // console.log(`Vous avez sélectionné ${juiceType.name}.`);
    console.log("euuhuh c'est le bon hein ?", juiceType);
    this.goodOrBad = this.goodOrBadBottle(juiceType);
    if (this.goodOrBad) {
      this.juicePicked(juiceType);
      socket.emit("SELECT_JUICE", juiceType.id, this.partie.roomId, this.bottlesData);
      console.log("je prends un jus");
      if (juiceType.id == this.partie.goldBottleId && !this.partie.goldBottleStatus) {
        this.partie.player.score += 500;
        this.partie.player.nbGoldenBottles += 1;
        if(this.partie.mode === "multi"){
          socket.emit("GOLD_BOTTLE_TAKEN", this.partie.roomId, this.partie.player.numeroPlayer);
        }
        this.showScore("gold");
      } else {
        this.showScore("normal");
        this.partie.player.score += 50;
      }
      this.game.registry.set('partie', this.partie);
      this.currentCustomer.indexNbrBottleChoosed += 1;
      setTimeout(() => {
        this.removeSocket();
        this.scene.launch('ArmoireVerseScene',{
        'bottleChoosed': juiceType
        });
        this.scene.bringToTop('ArmoireVerseScene');
      }, 1000);
      
      // socket.emit("GO_TO_POUR", this.partie.roomId, this.partie.player.numeroPlayer);
      // this.scene.bringToTop('ArmoireVerseScene');
    //   setTimeout(() => {
    //     this.scene.stop('CabinetScene');
    //     this.scene.run('PourInShakerScene', {
    //       'bottleChoosed': juiceType
    //     });
    //   this.scene.bringToTop('ArmoireVerseScene');
    // }, 500);
    } else {
      this.shakeScene();
    }
  }

  goodOrBadBottle(juice) {
    console.log('this.partie.tabBottlesChoosed : ', this.partie.tabBottlesChoosed);
    const drinkBottle = this.drinkBottles.find(bottle => bottle.alcoholId == juice.id);
    if (drinkBottle) {
      const alreadyChosen = this.partie.tabBottlesChoosed.find(id => id == juice.id);
      if (alreadyChosen) {
        return false;
      }
      this.partie.tabBottlesChoosed.push(juice.id);
      this.game.registry.set('partie', this.partie);
      return true;
    }
    return false;
  }

  juicePicked(juice) {
    this.canMove = false;
    // let takenBottleImg = this.getBottleImg(juice.id);
    // console.log('test disabled pitié',juice, takenBottleImg);
    // takenBottleImg[0].disableInteractive();
    this.bottlesData = this.game.registry.get('ingredients');
    this.bottlesData[juice.id - 1].picked = true
    console.log('bouteille choisie',this.bottlesData[juice.id - 1])
    // console.log(this.bottlesData[juice.id-1].picked)
    this.game.registry.set('ingredients', this.bottlesData);
  }

  openFictiveScene(sens) {
    this.removeSocket();
    this.scene.launch('ArmoireFictiveScene',{
      'sens': sens,
      'sceneToMove': "FictiveGameScene"
    });
    this.scene.bringToTop('ArmoireFictiveScene');
    // this.scene.stop('CabinetScene');
    // this.scene.start('FictiveGameScene');
  }

  removeSocket() {
    socket.removeAllListeners("MOVE_CURSOR");
    socket.removeAllListeners("NOMORE_CLIENT");
    socket.removeAllListeners("GAME_PAUSED");
    socket.removeAllListeners("A_JUICE_IS_RETURNED");
    socket.removeAllListeners("JUICE_TAKEN");
    socket.removeAllListeners("A_JUICE_TAKEN");
    socket.removeAllListeners("SELECT_JUICE");
    socket.removeAllListeners("GO_TO_POUR");
    socket.removeAllListeners("A_GOLD_BOTTLE_IS_TAKEN");
    socket.removeAllListeners("A_PLAYER_READY");
  }


  shakeScene() {
    console.log("déclenche la fonction");
    // this.cameras.main.shake(200);
    this.animCursorRefusPlay();
    this.beep.play();
    this.partie.player.nbBadBottles += 1;
    this.game.registry.set('partie', this.partie);
  }

  showScore(status){
    if(status == "gold"){
      this.scoreText = this.add.text(this.curseur.x+gameScale.width*0.04, this.curseur.y-gameScale.height*0.08, "+500", {
        fill: '#FFA364',
        fontFamily: 'alpinoBold',
        // fontSize: gameScale.width * 0.03 + 'px',
        align: 'center',
      }).setOrigin(0.5, 0.5).setAngle(15).setStroke('#252422', 7);
      this.scoreBottleGold.play();
    } else if(status == "normal"){
      this.scoreText = this.add.text(this.curseur.x+gameScale.width*0.04, this.curseur.y-gameScale.height*0.08, "+50", {
        fill: '#EFECEA',
        fontFamily: 'alpinoBold',
        fontSize: gameScale.width * 0.03 + 'px',
        align: 'center',
      }).setOrigin(0.5, 0.5).setAngle(15).setStroke('#252422', 7);
      this.scoreBottle.play();
    }

    this.tweens.addCounter({
        from: 0,
        to: 1,
        duration: 175,
        yoyo: false,
        onUpdate: (tween) => {
            const v = tween.getValue();
            this.scoreText.setFontSize(gameScale.width*0.01 + v * gameScale.width*0.02);
        }
    });
  }
}

export default CabinetScene;