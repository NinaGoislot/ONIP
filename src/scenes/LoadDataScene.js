import 'phaser';
import {socket} from '../main.js';

const
    //Chemins vers les dossiers d'images du jeu
    //GameScene
    URL_BOTTLES_CARTE = "./media/img/bouteilles-carte/normal/",
    URL_BOTTLES_CARTE_GOLD = "./media/img/bouteilles-carte/luxe/",
    URL_BOTTLES_CARTE_TAKEN = "./media/img/bouteilles-carte/normal-prise/",
    URL_BOTTLES_CARTE_GOLD_TAKEN = "./media/img/bouteilles-carte/luxe-prise/",
    URL_BOTTLES_CARTE_GOLD_STOLEN = "./media/img/bouteilles-carte/luxe-vole/",
    URL_BOTTLES_CARTE_GOLD_STOLEN_TAKEN = "./media/img/bouteilles-carte/luxe-vole-prise/",
    URL_COCKTAIL = "./media/img/cocktails-verre/",
    URL_MOVES = "./media/img/moves/",
    NB_MOVEMENTS = 8,
    BOTTLESDATA_LENGTH = 20,
    COCKTAILSDATA_LENGTH = 10,
    //CabinetScene
    URL_BOTTLES = "./media/img/bouteilles/",
    URL_CURSOR_MOVE = "./media/img/curseur/curseur_deplacement/",
    URL_CURSOR_REFUS = "./media/img/curseur/curseur_refus/",
    LENGTH_CURSOR_MOVE = 9,
    LENGTH_CURSOR_REFUS = 15,
    //TRANSI
    URL_TRANSITION_VERSE = "./media/img/transitions/armoire-verse/",
    URL_TRANSITION_ARMOIRE = "./media/img/transitions/verse-armoire/",
    URL_TRANSITION_GAMESHAKE = "./media/img/transitions/verse-shake/",
    URL_TRANSITION_START = "./media/img/transitions/start/",
    URL_TRANSITION_SWIPE_DROITE = "./media/img/transitions/carte-armoire/droite-gauche/",
    URL_TRANSITION_SWIPE_GAUCHE = "./media/img/transitions/carte-armoire/gauche-droite/",
    URL_TRANSITION_CARTE = "./media/img/transitions/start-carte/",
    LENGTH_TRANSI = 30
    ;

class LoadDataScene extends Phaser.Scene {
    preload() {
        this.load.json('globalGameData', './data/data.json');
        this.load.audio('theme', './media/audio/BE-song.mp3');
        socket.on("CONNECTED", () => {
            console.log("je suis connectée")
            this.game.registry.set('connected', true);
        });
        this.loadFont("soria", "./media/font/soria-font.ttf");
        this.loadFont("alpino", "./media/font/alpino-variable.ttf");

        // Load All Media
        // ******************* MenuScene *******************
        this.load.image('background', './media/img/background.png');

        // ******************* Step1_CreateJoinLobbyScene *******************
        this.load.image('bg-step1', './media/img/lancement-partie/step1.webp');

        // Step2_LobbyScene
        this.load.image('bg-step2', './media/img/lancement-partie/step2.webp');
        this.load.image('btn-copy', './media/img/lancement-partie/step2-btn-copy.webp');
        this.load.image('btn-check', './media/img/lancement-partie/step2-btn-check.webp');
        this.load.html('joinRoom', './html/joinGame.html');

        // ******************* Step3_ConnectPhoneScene *******************
        this.load.image('bg-step3', './media/img/lancement-partie/step3.webp');

        // ******************* Step4_PseudoScene *******************
        this.load.image('bg-step4-j1', './media/img/lancement-partie/step4-j1.webp');
        this.load.image('bg-step4-j2', './media/img/lancement-partie/step4-j2.webp');
        this.load.image('step4-btn-noactive', './media/img/lancement-partie/step4-btn-noactive.webp');
        this.load.image('step4-btn-active', './media/img/lancement-partie/step4-btn-active.webp');
        this.load.html('joinRoom', './html/joinGame.html');

        // ******************* PourInShakerScene *******************
        this.load.image('bg-shaker', './media/img/shaker/ecran-shaker-bg.webp');
        this.load.image('shaker-servir', './media/img/shaker/shaker-servir.webp');
        this.load.html('shakerCanvas', './html/shakerCanvas.html');

        // ******************* EndScene *******************
        this.load.image('ecran-victoire', './media/img/score/score-victoire.webp');
        this.load.image('ecran-defaite', './media/img/score/score-défaite.webp');

        // ******************* CabinetScene chemin normal *******************    
        this.load.image('armoireBouteilles', './media/img/armoire-deco.webp');
        this.load.image('curseur', 'media/img/curseur/curseur.webp');

        // ******************* GameScene *******************
        this.load.image('bg-service', './media/img/ecran-service/bg-service.webp');
        this.load.image('bar-service', './media/img/ecran-service/bar-service.webp');
        this.load.image('carte-service', './media/img/ecran-service/carte.webp');
        this.load.image('shaker-service', './media/img/shaker/shaker-service.webp');
        //spritesheet clients
        this.imageClientKey = [];
        this.bottleCarteImgKeys = [];
        this.bottleCarteTakenImgKeys = [];
        this.bottleGoldImgKeys = [];
        this.bottleGoldTakenImgKeys = [];
        this.bottleGoldStolenImgKeys = [];
        this.bottleGoldStolenTakenImgKeys = [];
        this.cocktailImgKeys = [];
        this.movementsImgKeys = [];
        this.load.spritesheet('client-1', './media/img/clients/gaetan.webp', {
            frameWidth: 590,
            frameHeight: 900,
            startFrame: 0,
            endFrame: 8
        });
        this.load.spritesheet('client-2', './media/img/clients/line.webp', {
            frameWidth: 540,
            frameHeight: 900,
            startFrame: 0,
            endFrame: 8
        });
        this.imageClientKey.push(`client-1`);
        this.imageClientKey.push(`client-2`);
        this.game.registry.set('imageClientKey', this.imageClientKey);
        //spritesheets mouvements
        this.load.spritesheet('prepare-toi', './media/img/mouvements/preparez-vous.webp', {
            frameWidth: 480,
            frameHeight: 270,
            startFrame: 0,
            endFrame: 21
        }); 
        //images bouteilles + cocktails
        this.load.path = URL_BOTTLES_CARTE;
        for (let i = 1; i <= BOTTLESDATA_LENGTH; i++) {
            this.load.image(`carte-bouteille${i}`, `carte-bouteille${i}.webp`);
            this.bottleCarteImgKeys.push(`carte-bouteille${i}`);
        }
        this.game.registry.set('bottleCarteImgKeys', this.bottleCarteImgKeys);
        this.load.path = URL_BOTTLES_CARTE_GOLD;
        for (let i = 1; i <= BOTTLESDATA_LENGTH; i++) {
            this.load.image(`carte-luxe-bouteille${i}`, `carte-luxe-bouteille${i}.webp`);
            this.bottleGoldImgKeys.push(`carte-luxe-bouteille${i}`);
        }
        this.game.registry.set('bottleGoldImgKeys', this.bottleGoldImgKeys);
        this.load.path = URL_COCKTAIL;
        for (let i = 1; i <= COCKTAILSDATA_LENGTH; i++) {
            this.load.image(`cocktail${i}`, `cocktail${i}.webp`);
            this.cocktailImgKeys.push(`cocktail${i}`);
        }
        this.game.registry.set('cocktailImgKeys', this.cocktailImgKeys);
        this.load.path = URL_MOVES;
        for (let i = 1; i <= NB_MOVEMENTS; i++) {
            this.load.image(`BOD${i}`, `BOD${i}.png`);
            this.movementsImgKeys.push(`BOD${i}`);
        }
        this.game.registry.set('movementsImgKeys', this.movementsImgKeys);

        this.load.path = URL_BOTTLES_CARTE_TAKEN;
        for (let i = 1; i <= BOTTLESDATA_LENGTH; i++) {
            this.load.image(`carte-normale-taken-bouteille${i}`, `carte-normal-bouteille${i}.webp`);
            this.bottleCarteTakenImgKeys.push(`carte-normale-taken-bouteille${i}`);
        }
        this.game.registry.set('bottleCarteTakenImgKeys', this.bottleCarteTakenImgKeys);
        this.load.path = URL_BOTTLES_CARTE_GOLD_TAKEN;
        for (let i = 1; i <= BOTTLESDATA_LENGTH; i++) {
            this.load.image(`carte-luxe-taken-bouteille${i}`, `carte-luxe-bouteille${i}.webp`);
            this.bottleGoldTakenImgKeys.push(`carte-luxe-taken-bouteille${i}`);
        }
        this.game.registry.set('bottleGoldTakenImgKeys', this.bottleGoldTakenImgKeys);
        this.load.path = URL_BOTTLES_CARTE_GOLD_STOLEN;
        for (let i = 1; i <= BOTTLESDATA_LENGTH; i++) {
            this.load.image(`carte-luxe-stolen-bouteille${i}`, `carte-luxe-bouteille${i}-prise.webp`);
            this.bottleGoldStolenImgKeys.push(`carte-luxe-stolen-bouteille${i}`);
        }
        this.game.registry.set('bottleGoldStolenImgKeys', this.bottleGoldStolenImgKeys);
        this.load.path = URL_BOTTLES_CARTE_GOLD_STOLEN_TAKEN;
        for (let i = 1; i <= BOTTLESDATA_LENGTH; i++) {
            this.load.image(`carte-luxe-stolen-taken-bouteille${i}`, `carte-luxe-prise-bouteille${i}.webp`);
            this.bottleGoldStolenTakenImgKeys.push(`carte-luxe-stolen-taken-bouteille${i}`);
        }
        this.game.registry.set('bottleGoldStolenTakenImgKeys', this.bottleGoldStolenTakenImgKeys);

        // ******************* CabinetScene chemin défini *******************    
        this.bottleImgKeys = [];
        this.load.path = URL_BOTTLES;
        for (let i = 1; i <= BOTTLESDATA_LENGTH; i++) {
            this.load.image(`bouteille${i}`, `bouteille${i}.webp`);
            this.bottleImgKeys.push(`bouteille${i}`);
        }
        this.game.registry.set('bottleImgKeys', this.bottleImgKeys);
        this.load.path = URL_CURSOR_REFUS;
        for (let i = 0; i < LENGTH_CURSOR_REFUS; i++) {
            this.load.image(`curseur-refus${i}`, `curseur-refus_${i}.png`);
        }
        this.load.path = URL_CURSOR_MOVE;
        for (let i = 0; i < LENGTH_CURSOR_MOVE; i++) {
            this.load.image(`move${i}`, `deplacement_${i}.png`);
        }

        // ******************* TRANSITIONS ******************* 
        this.load.path = URL_TRANSITION_START;
        for (let i = 0; i < LENGTH_TRANSI; i++) {
            this.load.image(`transi-start${i}`, `Transi-start_${i}.png`);
        }
        this.load.path = URL_TRANSITION_VERSE;
        for (let i = 0; i < LENGTH_TRANSI; i++) {
            this.load.image(`transi-verse${i}`, `Transi-armoire-verse_${i}.png`);
        }
        this.load.path = URL_TRANSITION_ARMOIRE;
        for (let i = 0; i < LENGTH_TRANSI; i++) {
            this.load.image(`transi-armoire${i}`, `Transi-verticale-verse-armoire_${i}.png`);
        }
        this.load.path = URL_TRANSITION_GAMESHAKE;
        for (let i = 0; i < LENGTH_TRANSI; i++) {
            this.load.image(`transi-verse-game${i}`, `Transi-verticale-verse-shake_${i}.png`);
        }
        this.load.path = URL_TRANSITION_SWIPE_DROITE;
        for (let i = 0; i < LENGTH_TRANSI; i++) {
            this.load.image(`transi-swipe-droite${i}`, `Transi-carte-armoire-droite_${i}.png`);
        }
        this.load.path = URL_TRANSITION_SWIPE_GAUCHE;
        for (let i = 0; i < LENGTH_TRANSI; i++) {
            this.load.image(`transi-swipe-gauche${i}`, `Transi-carte-armoire-gauche_${i}.png`);
        }
        this.load.path = URL_TRANSITION_CARTE;
        for (let i = 0; i < LENGTH_TRANSI; i++) {
            this.load.image(`transi-carte${i}`, `Transi-armoire-start-carte_${i}.png`);
        }

    }

    create() {
        // Accéder aux données depuis le cache
        const globalGameData = this.cache.json.get('globalGameData');

        // Stocker les données dans le registre du jeu
        this.game.registry.set('cocktails', globalGameData.cocktails);
        this.game.registry.set('ingredients', globalGameData.ingredients);
        this.game.registry.set('movements', globalGameData.movements);
        this.game.registry.set('emotions', globalGameData.emotions);
        this.game.registry.set('extras', globalGameData.extras);
        this.game.registry.set('score', 0);


        // POUR LA MUSIQUE
        // this.load.audio('theme', './media/audio/BE-song.mp3');
        this.music = this.sound.add('theme');
        this.game.registry.set('music', this.music);
        //juste pour pas que la musique dérange pendant les tests..
        this.game.registry.get('music').pause();

        // this.scale.startFullscreen();
        // Lancer la scène suivante (MenuScene dans cet exemple)
        this.scene.start('MenuScene');
    }

    loadFont(name, url) {
        var newFont = new FontFace(name, `url(${url})`);
        newFont.load().then(function (loaded) {
            document.fonts.add(loaded);
        }).catch(function (error) {
            return error;
        });
    }
}

export default LoadDataScene;
