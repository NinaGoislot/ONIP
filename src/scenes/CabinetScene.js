import Phaser from 'phaser';
import {
  gameScale,
  socket
} from '../main.js';

const URL_BOTTLES = "./media/img/bouteilles/",
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
    this.load.image('armoireBouteilles', './media/img/armoire-deco.webp');
    this.load.image('curseur', 'media/img/curseur.webp');

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

    // add background to scene
    let background = this.add.image(gameScale.width / 2, gameScale.height / 2, 'armoireBouteilles');
    background.displayWidth = gameScale.width;
    background.displayHeight = gameScale.width / background.width * background.height;
    window.addEventListener('resize', () => {
      background.displayWidth = gameScale.width;
      background.displayHeight = gameScale.width / background.width * background.height;
      background.setPosition(gameScale.width / 2, gameScale.height / 2)
    });

    this.curseur = this.add.image(gameScale.width * 0.5, gameScale.height * 0.445, 'curseur');
    this.curseur.displayWidth = gameScale.width * 0.244;
    this.curseur.scaleY = this.curseur.scaleX;
    // let droite = this.add.rectangle(gameScale.width*0.1, gameScale.height*0.1, 50, 50, 0x6666ff, 0.5).setInteractive({cursor: 'pointer'}).on('pointerdown', ()=> this.droite());
    // let gauche = this.add.rectangle(gameScale.width*0.2, gameScale.height*0.1, 50, 50, 0x6666ff, 0.5).setInteractive({cursor: 'pointer'}).on('pointerdown', ()=> this.gauche());
    // let haut = this.add.rectangle(gameScale.width*0.3, gameScale.height*0.1, 50, 50, 0x6666ff, 0.5).setInteractive({cursor: 'pointer'}).on('pointerdown', ()=> this.haut());
    // let bas = this.add.rectangle(gameScale.width*0.4, gameScale.height*0.1, 50, 50, 0x6666ff, 0.5).setInteractive({cursor: 'pointer'}).on('pointerdown', ()=> this.bas());
    // let getBottleByCurseur = this.add.rectangle(gameScale.width*0.5, gameScale.height*0.1, 50, 50, 0x6666ff, 0.5).setInteractive({cursor: 'pointer'}).on('pointerdown', ()=> this.getSelectBottle());

    this.curseurX = 0;
    this.curseurY = 0;

    // Récupérer les données de bottles depuis le registre
    // Utiliser la fonction pour obtenir le tableau d'indices aléatoires
    this.randomIndices = this.partie.tabBottles;
    this.createBoxBottle(GRID_NBR_ROW, GRID_NBR_COL);
    this.aJuiceTaken = false;

    let rectangle = this.add.rectangle(gameScale.width * 0.9, gameScale.height * 0.9, 100, 100, 0x6666ff, 0);
    rectangle.setInteractive({
      cursor: 'pointer'
    });
    rectangle.on('pointerdown', () => this.test());


    this.cameras.main.on('camerashakestart', function () {
      console.log("debut")
      for (let i = 0; i < this.tabBottle.length; i++) {
        this.tabBottle[i][0].disableInteractive();
      }
    }.bind(this));

    this.cameras.main.on('camerashakecomplete', function () {
      console.log("fini")
      for (let i = 0; i < this.tabBottle.length; i++) {
        this.tabBottle[i][0].setInteractive();
      }
    }.bind(this));


    // ***************************************** SOCKET *****************************************
    socket.on("MOVE_CURSOR", (cursor) => {
      console.log("Je reçois le déplacement : " + cursor);
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
    })

    socket.on("GAME_PAUSED", (secondPaused) => {
      this.canva.startPause(this.scene, this, secondPaused);
    })

    socket.on("NOMORE_CLIENT", (peutPlus) => {
      this.partie.addCustomer = peutPlus;
      this.game.registry.set('partie', this.partie);
      this.add.text(gameScale.width * 0.8, gameScale.height * 0.1, 'Dernier client', {
        fill: '#EFECEA',
        fontFamily: 'soria',
        fontSize: gameScale.width * 0.03 + 'px'
      });
    })

    if (!this.partie.addCustomer) {
      this.add.text(gameScale.width * 0.8, gameScale.height * 0.1, 'Dernier client', {
        fill: '#EFECEA',
        fontFamily: 'soria',
        fontSize: gameScale.width * 0.03 + 'px'
      });
    }

    // fonctionnalité du multijoueur avec la bouteille prise 
    socket.on('JUICE_TAKEN', (bottleId, bottlesData) => {
      if (!(this.partie.mode === "solo") && !this.aJuiceTaken) {
        let takenBottleImg = this.getBottleImg(bottleId);
        takenBottleImg.disableInteractive();
        takenBottleImg.visible = false;
        this.game.registry.set('ingredients', bottlesData);
        this.bottlesData = this.game.registry.get('ingredients');
        socket.emit('A_JUICE_IS_TAKEN', this.aJuiceTaken, this.partie.roomId);
        console.log("on t'a pris un jus");
      }
    })

    socket.on('A_JUICE_IS_RETURNED', (bottlesData, bottleChoosed) => {
      this.game.registry.set('ingredients', bottlesData);
      this.bottlesData = this.game.registry.get('ingredients');
      let returnBottleImg = this.getBottleImg(bottleChoosed.id);
      returnBottleImg.setInteractive();
      returnBottleImg.visible = true;
      console.log('image de la bouteille retournée', returnBottleImg)
    })


    //pour éviter de redéclencher la fonction de disparition de bouteille
    socket.on('A_JUICE_TAKEN', (isAJuiceTaken) => {
      console.log("est-ce que ça sert ?????????????????????????")
      this.aJuiceTaken = isAJuiceTaken;
    })
  }

  // ***************************************** FONCTIONS *****************************************

  createBoxBottle(nbrRow, nbrCol) {
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
          const imageKey = this.bottleImgKeys.find(image => image == `bouteille` + bottleAssocie.id);
          let bottleImg = this.add.image(posX, posY, imageKey)
          bottleImg.visible = true;
          if (this.bottlesData[bottleAssocie.id - 1].picked == true) {
            console.log('déjà pris', this.bottlesData[bottleAssocie.id - 1].name)
            bottleImg.visible = false;
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
    console.log("Je vais à droite");
    this.curseurX += 1;
    if (this.curseurX >= 4) {
      this.curseurX -= 1;
      return;
    }
    this.curseur.setPosition(this.curseur.x + gameScale.width * BOTTLE_GAP_X, this.curseur.y);
  }

  gauche() {
    console.log("Je vais à gauche");
    this.curseurX -= 1;
    if (this.curseurX <= -4) {
      this.curseurX += 1;
      return;
    }
    this.curseur.setPosition(this.curseur.x - gameScale.width * BOTTLE_GAP_X, this.curseur.y);
  }

  haut() {
    this.curseurY += 1;
    if (this.curseurY >= 2) {
      this.curseurY -= 1;
      return;
    }
    this.curseur.setPosition(this.curseur.x, this.curseur.y - gameScale.height * BOTTLE_GAP_Y_BETWEEN);
  }

  bas() {
    this.curseurY -= 1;
    if (this.curseurY <= -2) {
      this.curseurY += 1;
      return;
    }
    this.curseur.setPosition(this.curseur.x, this.curseur.y + gameScale.height * BOTTLE_GAP_Y_BETWEEN);
  }

  getBottleAtCursor() {
    const [cursorX, cursorY] = [this.curseurX, this.curseurY];
    return this.tabBottle.find(([bottleImg, [bottleX, bottleY]]) => {
      return bottleX === cursorX && bottleY === cursorY;
    });
  }

  getSelectBottle() {
    this.bottleAtCursor = this.getBottleAtCursor();
    if (this.bottleAtCursor && this.bottleAtCursor[0] && this.bottleAtCursor[0].texture) {
      const textureKey = this.bottleAtCursor[0].texture.key;
      this.bottleAtCursorData = this.getBottleByName(textureKey);
      this.selectJuice(this.bottleAtCursorData)
    } else {
      console.log("La bouteille à la position du curseur n'est pas valide.");
    }
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
    this.goodOrBad = this.goodOrBadBottle(juiceType);
    if (this.goodOrBad) {
      this.juicePicked(juiceType);
      socket.emit("SELECT_JUICE", juiceType.id, this.partie.roomId, this.bottlesData);
      console.log("je prends un jus");
      if (juiceType.id == this.partie.goldBottleId) {
        this.partie.player.score += 500;
        this.partie.player.nbGoldenBottles += 1;
        this.game.registry.set('partie', this.partie);
      }
      this.currentCustomer.indexNbrBottleChoosed += 1;
      // this.scene.start('GameScene');
      socket.emit("GO_TO_POUR", this.partie.roomId, this.partie.player.numeroPlayer);
      this.scene.sleep('CabinetScene');
      this.scene.launch('PourInShakerScene', {
        'bottleChoosed': juiceType
      });
      // this.scene.start('PourInShakerScene', {
      //   'bottleChoosed': juiceType
      // });
    } else {
      this.shakeScene();
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

  juicePicked(juice) {
    this.bottlesData = this.game.registry.get('ingredients');
    this.bottlesData[juice.id - 1].picked = true
    console.log(this.bottlesData[juice.id - 1])
    // console.log(this.bottlesData[juice.id-1].picked)
    this.game.registry.set('ingredients', this.bottlesData);
  }

  test() {
    // this.scene.sleep('CabinetScene')
    // this.scene.start('FictiveGameScene')
    this.scene.sleep('CabinetScene');
    this.scene.launch('FictiveGameScene');
  }

  shakeScene() {
    console.log("déclenche la fonction");
    this.cameras.main.shake(1250);
    //puis pas possible de bouger pdt 2 secondes --> voir PWA
    //si bouge pdt interdiction = mini shake
    this.partie.player.nbBadBottles += 1;
    this.game.registry.set('partie', this.partie);
  }
}

export default CabinetScene;