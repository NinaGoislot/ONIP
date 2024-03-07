import 'phaser';
import {socket} from '../main.js';

const
    //Chemins vers les dossiers d'images du jeu
    //GameScene
    BOTTLESSPRITE_LENGTH = 19,
    COCKTAILSSPRITE_LENGTH = 9,
    //CabinetScene
    LENGTH_CURSOR_MOVE = 8,
    LENGTH_CURSOR_REFUS = 15,
    //TRANSI
    LENGTH_TRANSI = 30,
    //Interruptions
    LENGTH_INTERRUP = 75,
    //MOUVEMNTS
    LENGTH_MOV_INTRO = 29,
    LENGTH_MOV_HAND = 29,
    LENGTH_MOV_BOD1 = 49,
    LENGTH_MOV_BOD2 = 59,
    LENGTH_MOV_BOD3 = 56,
    LENGTH_MOV_BOD4 = 30,
    LENGTH_MOV_BOD5 = 49,
    LENGTH_MOV_BOD6 = 49,
    LENGTH_MOV_BOD7 = 69,
    LENGTH_MOV_BOD8 = 49,
    LENGTH_MOV_STOP = 8
    ;

class LoadDataScene extends Phaser.Scene {
    preload() {
        this.load.on('fileerror', ()=>{
            console.log('IL Y A EU UNE ERREUR');
            window.location.reload();
        });
        this.load.on('complete', ()=>{
            console.log('TOUT EST CHARGE');
        });
        window.onerror = function(message, source, lineno, colno, error) {
            console.error('Une erreur s\'est produite : ', message);
            console.error('Source : ', source);
            console.error('Ligne : ', lineno);
            console.error('Colonne : ', colno);
            console.error('Erreur : ', error);
            
            // Recharger la page en cas d'erreur
            // window.location.reload();
            // this.scene.stop();
        };
        
    
        this.load.json('globalGameData', './data/data.json');
        // this.load.audio('theme', './media/audio/BE-song.mp3');
        // socket.on("CONNECTED", () => {
        //     console.log("je suis connectée")
        //     this.game.registry.set('connected', true);
        // });
        this.loadFont("soria", "./media/font/soria-font.ttf");
        this.loadFont("alpino", "./media/font/alpino-variable.ttf");
        this.loadFont("alpinoBold", "./media/font/alpino-bold.ttf");
        this.loadFont("alpinoMedium", "./media/font/alpino-medium.ttf");

        // Load All Media
        // ******************* MenuScene *******************
        this.load.image('background', './media/img/background.png');
        this.load.image('fleche', './media/img/fleche.webp');
        this.load.image('fullscreen', './media/img/fullscreen.webp');
        this.load.image('fullscreen-exit', './media/img/fullscreen-exit.webp');
        this.load.image('chrono', './media/img/asset-chrono.webp');

        // ******************* AUDIO *******************
        this.load.audio('themeGame', './media/audio/Jeu.mp3');
        this.load.audio('menu', './media/audio/Menu.mp3');
        //MenuScene
        this.load.audio('PingPong', './media/audio/menu/PingPong.wav');
        this.load.audio('PingPongPaddle', './media/audio/menu/PingPongPaddle.wav');
        this.load.audio('Toc', './media/audio/menu/Toc.mp3');
        this.load.audio('PasTransi', './media/audio/menu/PasTransi.wav');
        this.load.audio('musicJ2Join', './media/audio/decide.mp3');
        //CabinetScene
        this.load.audio('cursorHaut', './media/audio/armoire/Whip01.wav');
        this.load.audio('cursorGauche', './media/audio/armoire/Whip02.wav');
        this.load.audio('bottlePOP', './media/audio/armoire/Whip03.wav');
        this.load.audio('bottleDePOP', './media/audio/armoire/error-3.mp3');
        this.load.audio('cursorBas', './media/audio/armoire/Whip04.wav');
        this.load.audio('cursorDroite', './media/audio/armoire/Whip05.wav');
        this.load.audio('beep', './media/audio/armoire/Beep.mp3');
        this.load.audio('scoreBottle', './media/audio/armoire/cartoon_wink.mp3');
        this.load.audio('scoreBottleGold', './media/audio/armoire/short-success.mp3');
        //PourInShakerScene
        this.load.audio('pourDrink', './media/audio/shaker/Liquid3.wav');
        this.load.audio('beepDrink', './media/audio/shaker/beep-warning.mp3');
        //GameScene
        this.load.audio('lastClient', './media/audio/service/bell.mp3');
        this.load.audio('clientPOP', './media/audio/service/service-bell.mp3');
        this.load.audio('clientDePOP', './media/audio/clientDePOP.mp3');
        this.load.audio('cartePOP', './media/audio/cartePOP.wav');
        this.load.audio('decompte', './media/audio/decompte.mp3');
        this.load.audio('blabla', './media/audio/blah-blah.mp3');
        this.load.audio('transiGameScene', './media/audio/service/swipe.wav');
        this.load.audio('moveTicTac', './media/audio/dance-party/tic-tac.mp3');
        this.load.audio('moveValid', './media/audio/dance-party/interface.mp3');
        this.load.audio('transiFast', './media/audio/TransiFast.wav');
        this.load.audio('transiRound', './media/audio/TransiRound.wav');
        this.load.audio('transiSwipe2', './media/audio/TransiSwipe2.wav');

        //Leaderboard
        this.load.audio('win', './media/audio/leaderboard/drum-roll.mp3');
        this.load.audio('lose', './media/audio/leaderboard/fiasco.mp3');


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
        // this.load.image('shaker-texture', './media/img/shaker/texture2.webp');
        this.load.html('shakerCanvas', './html/shakerCanvas.html');

        // ******************* EndScene *******************
        this.load.image('ecran-victoire', './media/img/score/score-victoire.webp');
        this.load.image('ecran-defaite', './media/img/score/score-défaite.webp');

        // ******************* CabinetScene chemin normal *******************    
        this.load.image('armoireBouteilles', './media/img/armoire-deco.webp');
        this.load.image('curseur', 'media/img/curseur/curseur.webp');
        this.load.spritesheet('curseur-refus', './media/img/curseur/curseur_refus.png', {
            frameWidth: 540,
            frameHeight: 540,
            startFrame: 0,
            endFrame: LENGTH_CURSOR_REFUS
        });
        this.load.spritesheet('curseur-move', './media/img/curseur/curseur_move.png', {
            frameWidth: 540,
            frameHeight: 540,
            startFrame: 0,
            endFrame: LENGTH_CURSOR_MOVE
        });

        // // ******************* GameScene *******************
        this.load.image('bg-service', './media/img/ecran-service/bg-service.webp');
        this.load.image('bar-service', './media/img/ecran-service/bar-service.webp');
        this.load.image('carte-service', './media/img/ecran-service/carte.webp');
        this.load.image('shaker-service', './media/img/shaker/shaker-service.webp');
        //spritesheet clients
        this.imageClientKey = [];
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

        //spritesheets cocktails
        this.load.spritesheet('cocktailsSprite', './media/img/cocktails-verre/cocktails.webp', {
            frameWidth: 540,
            frameHeight: 540,
            startFrame: 0,
            endFrame: COCKTAILSSPRITE_LENGTH
        }); 

        //spritesheets bouteilles
        this.load.spritesheet('bouteillesSprite', './media/img/bouteilles/bouteilles.webp', {
            frameWidth: 540,
            frameHeight: 540,
            startFrame: 0,
            endFrame: BOTTLESSPRITE_LENGTH
        }); 
        this.load.spritesheet('carte-luxe-sprite', './media/img/bouteilles-carte/carte-luxe-bouteilles.webp', {
            frameWidth: 358,
            frameHeight: 490,
            startFrame: 0,
            endFrame: BOTTLESSPRITE_LENGTH
        }); 
        this.load.spritesheet('carte-luxe-prise-sprite', './media/img/bouteilles-carte/carte-luxe-prise.webp', {
            frameWidth: 358,
            frameHeight: 490,
            startFrame: 0,
            endFrame: BOTTLESSPRITE_LENGTH
        }); 
        this.load.spritesheet('carte-luxe-vole-sprite', './media/img/bouteilles-carte/carte-luxe-vole.webp', {
            frameWidth: 358,
            frameHeight: 490,
            startFrame: 0,
            endFrame: BOTTLESSPRITE_LENGTH
        }); 
        this.load.spritesheet('carte-luxe-vole-prise-sprite', './media/img/bouteilles-carte/carte-luxe-vole-prise.webp', {
            frameWidth: 358,
            frameHeight: 490,
            startFrame: 0,
            endFrame: BOTTLESSPRITE_LENGTH
        }); 
        this.load.spritesheet('carte-normal-sprite', './media/img/bouteilles-carte/carte-normal-bouteilles.webp', {
            frameWidth: 360,
            frameHeight: 492,
            startFrame: 0,
            endFrame: BOTTLESSPRITE_LENGTH
        }); 
        this.load.spritesheet('carte-normal-prise-sprite', './media/img/bouteilles-carte/carte-normal-prise.webp', {
            frameWidth: 360,
            frameHeight: 492,
            startFrame: 0,
            endFrame: BOTTLESSPRITE_LENGTH
        });

        // ******************* TRANSITIONS ******************* 
        this.load.spritesheet('transi-start', './media/img/transitions/Transi-start.png', {
            frameWidth: 1920,
            frameHeight: 1080,
            startFrame: 0,
            endFrame: LENGTH_TRANSI
        });
        this.load.spritesheet('transi-verse', './media/img/transitions/Transi-armoire-verse.png', {
            frameWidth: 1920,
            frameHeight: 1080,
            startFrame: 0,
            endFrame: LENGTH_TRANSI
        });
        this.load.spritesheet('transi-armoire', './media/img/transitions/Transi-verticale-verse-armoire.png', {
            frameWidth: 1920,
            frameHeight: 1080,
            startFrame: 0,
            endFrame: LENGTH_TRANSI
        });
        this.load.spritesheet('transi-verse-game', './media/img/transitions/Transi-verticale-verse-shake.png', {
            frameWidth: 1920,
            frameHeight: 1080,
            startFrame: 0,
            endFrame: LENGTH_TRANSI
        });
        this.load.spritesheet('transi-swipe-droite', './media/img/transitions/Transi-carte-armoire-droite.png', {
            frameWidth: 1920,
            frameHeight: 1080,
            startFrame: 0,
            endFrame: LENGTH_TRANSI
        });
        this.load.spritesheet('transi-swipe-gauche', './media/img/transitions/Transi-carte-armoire-gauche.png', {
            frameWidth: 1920,
            frameHeight: 1080,
            startFrame: 0,
            endFrame: LENGTH_TRANSI
        });
        this.load.spritesheet('transi-carte', './media/img/transitions/Transi-armoire-start-carte.png', {
            frameWidth: 1920,
            frameHeight: 1080,
            startFrame: 0,
            endFrame: LENGTH_TRANSI
        });
        this.load.spritesheet('transi-end', './media/img/transitions/Transi-end.png', {
            frameWidth: 1920,
            frameHeight: 1080,
            startFrame: 0,
            endFrame: LENGTH_TRANSI
        });

        // ******************* INTERRUPTIONS ******************* 
        this.load.spritesheet('interr_advers', './media/img/interruptions/adversaire.png', {
            frameWidth: 1920,
            frameHeight: 1080,
            startFrame: 0,
            endFrame: LENGTH_INTERRUP
        });
        this.tabAdvers = {name : 'interr_advers', lengthInterr:LENGTH_INTERRUP};
        this.load.spritesheet('interr_depeche', './media/img/interruptions/depeche-toi.png', {
            frameWidth: 1920,
            frameHeight: 1080,
            startFrame: 0,
            endFrame: LENGTH_INTERRUP
        });
        this.tabDepeche = {name : 'interr_depeche', lengthInterr:LENGTH_INTERRUP};
        this.interr = [this.tabAdvers,this.tabDepeche]
        this.game.registry.set('interr', this.interr);

        // ******************* MOUVEMENTS ******************* 
        //BOD1
        this.load.spritesheet('BOD1-INTRO', './media/img/mouvements/Corps_1/corps1_intro.webp', {
            frameWidth: 960,
            frameHeight: 540,
            startFrame: 0,
            endFrame: LENGTH_MOV_INTRO
        }); 
        this.load.spritesheet('BOD1-MOV', './media/img/mouvements/Corps_1/corps1_mov.webp', {
            frameWidth: 960,
            frameHeight: 540,
            startFrame: 0,
            endFrame: LENGTH_MOV_BOD1
        }); 
        this.tabBOD1 = {intro : 'BOD1-INTRO', mov : 'BOD1-MOV', lengthIntro:LENGTH_MOV_INTRO, lengthMov:LENGTH_MOV_BOD1};
        //BOD2
        this.load.spritesheet('BOD2-INTRO', './media/img/mouvements/Corps_2/corps2_intro.webp', {
            frameWidth: 960,
            frameHeight: 540,
            startFrame: 0,
            endFrame: LENGTH_MOV_INTRO
        }); 
        this.load.spritesheet('BOD2-MOV', './media/img/mouvements/Corps_2/corps2_mov.webp', {
            frameWidth: 960,
            frameHeight: 540,
            startFrame: 0,
            endFrame: LENGTH_MOV_BOD2
        }); 
        this.tabBOD2 = {intro : 'BOD2-INTRO', mov : 'BOD2-MOV', lengthIntro:LENGTH_MOV_INTRO, lengthMov:LENGTH_MOV_BOD2};
        //BOD3
        this.load.spritesheet('BOD3-INTRO', './media/img/mouvements/Corps_3/corps3_intro.webp', {
            frameWidth: 960,
            frameHeight: 540,
            startFrame: 0,
            endFrame: LENGTH_MOV_INTRO
        }); 
        this.load.spritesheet('BOD3-MOV', './media/img/mouvements/Corps_3/corps3_mov.webp', {
            frameWidth: 960,
            frameHeight: 540,
            startFrame: 0,
            endFrame: LENGTH_MOV_BOD3
        }); 
        this.tabBOD3 = {intro : 'BOD3-INTRO', mov : 'BOD3-MOV', lengthIntro:LENGTH_MOV_INTRO, lengthMov:LENGTH_MOV_BOD3};
        //BOD4
        this.load.spritesheet('BOD4-INTRO', './media/img/mouvements/Corps_4/corps4_intro.webp', {
            frameWidth: 960,
            frameHeight: 540,
            startFrame: 0,
            endFrame: LENGTH_MOV_INTRO
        }); 
        this.load.spritesheet('BOD4-MOV', './media/img/mouvements/Corps_4/corps4_mov.webp', {
            frameWidth: 960,
            frameHeight: 540,
            startFrame: 0,
            endFrame: LENGTH_MOV_BOD4
        }); 
        this.tabBOD4 = {intro : 'BOD4-INTRO', mov : 'BOD4-MOV', lengthIntro:LENGTH_MOV_INTRO, lengthMov:LENGTH_MOV_BOD4};
        //BOD5
        this.load.spritesheet('BOD5-INTRO', './media/img/mouvements/Corps_5/corps5_intro.webp', {
            frameWidth: 960,
            frameHeight: 540,
            startFrame: 0,
            endFrame: LENGTH_MOV_INTRO
        }); 
        this.load.spritesheet('BOD5-MOV', './media/img/mouvements/Corps_5/corps5_mov.webp', {
            frameWidth: 960,
            frameHeight: 540,
            startFrame: 0,
            endFrame: LENGTH_MOV_BOD5
        }); 
        this.tabBOD5 = {intro : 'BOD5-INTRO', mov : 'BOD5-MOV', lengthIntro:LENGTH_MOV_INTRO, lengthMov:LENGTH_MOV_BOD5};
        //BOD6
        this.load.spritesheet('BOD6-INTRO', './media/img/mouvements/Corps_6/corps6_intro.webp', {
            frameWidth: 960,
            frameHeight: 540,
            startFrame: 0,
            endFrame: LENGTH_MOV_INTRO
        }); 
        this.load.spritesheet('BOD6-MOV', './media/img/mouvements/Corps_6/corps6_mov.webp', {
            frameWidth: 960,
            frameHeight: 540,
            startFrame: 0,
            endFrame: LENGTH_MOV_BOD6
        }); 
        this.tabBOD6 = {intro : 'BOD6-INTRO', mov : 'BOD6-MOV', lengthIntro:LENGTH_MOV_INTRO, lengthMov:LENGTH_MOV_BOD6};
        //BOD7
        this.load.spritesheet('BOD7-INTRO', './media/img/mouvements/Corps_7/corps7_intro.webp', {
            frameWidth: 960,
            frameHeight: 540,
            startFrame: 0,
            endFrame: LENGTH_MOV_INTRO
        }); 
        this.load.spritesheet('BOD7-MOV', './media/img/mouvements/Corps_7/corps7_mov.webp', {
            frameWidth: 960,
            frameHeight: 540,
            startFrame: 0,
            endFrame: LENGTH_MOV_BOD7
        }); 
        this.tabBOD7 = {intro : 'BOD7-INTRO', mov : 'BOD7-MOV', lengthIntro:LENGTH_MOV_INTRO, lengthMov:LENGTH_MOV_BOD7};
        //BOD8
        this.load.spritesheet('BOD8-INTRO', './media/img/mouvements/Corps_8/corps8_intro.webp', {
            frameWidth: 960,
            frameHeight: 540,
            startFrame: 0,
            endFrame: LENGTH_MOV_INTRO
        }); 
        this.load.spritesheet('BOD8-MOV', './media/img/mouvements/Corps_8/corps8_mov.webp', {
            frameWidth: 960,
            frameHeight: 540,
            startFrame: 0,
            endFrame: LENGTH_MOV_BOD8
        }); 
        this.tabBOD8 = {intro : 'BOD8-INTRO', mov : 'BOD8-MOV', lengthIntro:LENGTH_MOV_INTRO, lengthMov:LENGTH_MOV_BOD8};
        //HAN1
        this.load.spritesheet('HAN1-INTRO', './media/img/mouvements/Main_1/main1_intro.webp', {
            frameWidth: 960,
            frameHeight: 540,
            startFrame: 0,
            endFrame: LENGTH_MOV_INTRO
        }); 
        this.load.spritesheet('HAN1-MOV', './media/img/mouvements/Main_1/main1_mov.webp', {
            frameWidth: 960,
            frameHeight: 540,
            startFrame: 0,
            endFrame: LENGTH_MOV_HAND
        }); 
        this.tabHAN1 = {intro : 'HAN1-INTRO', mov : 'HAN1-MOV', lengthIntro:LENGTH_MOV_INTRO, lengthMov:LENGTH_MOV_HAND};
        //HAN2
        this.load.spritesheet('HAN2-INTRO', './media/img/mouvements/Main_2/main2_intro.webp', {
            frameWidth: 960,
            frameHeight: 540,
            startFrame: 0,
            endFrame: LENGTH_MOV_INTRO
        }); 
        this.load.spritesheet('HAN2-MOV', './media/img/mouvements/Main_2/main2_mov.webp', {
            frameWidth: 960,
            frameHeight: 540,
            startFrame: 0,
            endFrame: LENGTH_MOV_HAND
        }); 
        this.tabHAN2 = {intro : 'HAN2-INTRO', mov : 'HAN2-MOV', lengthIntro:LENGTH_MOV_INTRO, lengthMov:LENGTH_MOV_HAND};
        //HAN3
        this.load.spritesheet('HAN3-INTRO', './media/img/mouvements/Main_3/main3_intro.webp', {
            frameWidth: 960,
            frameHeight: 540,
            startFrame: 0,
            endFrame: LENGTH_MOV_INTRO
        }); 
        this.load.spritesheet('HAN3-MOV', './media/img/mouvements/Main_3/main3_mov.webp', {
            frameWidth: 960,
            frameHeight: 540,
            startFrame: 0,
            endFrame: LENGTH_MOV_HAND
        }); 
        this.tabHAN3 = {intro : 'HAN3-INTRO', mov : 'HAN3-MOV', lengthIntro:LENGTH_MOV_INTRO, lengthMov:LENGTH_MOV_HAND};
        //HAN4
        this.load.spritesheet('HAN4-INTRO', './media/img/mouvements/Main_4/main4_intro.webp', {
            frameWidth: 960,
            frameHeight: 540,
            startFrame: 0,
            endFrame: LENGTH_MOV_INTRO
        }); 
        this.load.spritesheet('HAN4-MOV', './media/img/mouvements/Main_4/main4_mov.webp', {
            frameWidth: 960,
            frameHeight: 540,
            startFrame: 0,
            endFrame: LENGTH_MOV_HAND
        }); 
        this.tabHAN4 = {intro : 'HAN4-INTRO', mov : 'HAN4-MOV', lengthIntro:LENGTH_MOV_INTRO, lengthMov:LENGTH_MOV_HAND};
        //HAN5
        this.load.spritesheet('HAN5-INTRO', './media/img/mouvements/Main_5/main5_intro.webp', {
            frameWidth: 960,
            frameHeight: 540,
            startFrame: 0,
            endFrame: LENGTH_MOV_INTRO
        }); 
        this.load.spritesheet('HAN4-MOV', './media/img/mouvements/Main_5/main5_mov.webp', {
            frameWidth: 960,
            frameHeight: 540,
            startFrame: 0,
            endFrame: LENGTH_MOV_HAND
        }); 
        this.tabHAN5 = {intro : 'HAN5-INTRO', mov : 'HAN5-MOV', lengthIntro:LENGTH_MOV_INTRO, lengthMov:LENGTH_MOV_HAND};

        this.tabMovAll = {
            'BOD1' : this.tabBOD1,
            'BOD2' : this.tabBOD2,
            'BOD3' : this.tabBOD3,
            'BOD4' : this.tabBOD4,
            'BOD5' : this.tabBOD5,
            'BOD6' : this.tabBOD6,
            'BOD7' : this.tabBOD7,
            'BOD8' : this.tabBOD8,
            'HAN1' : this.tabHAN1,
            'HAN2' : this.tabHAN2,
            'HAN3' : this.tabHAN3,
            'HAN4' : this.tabHAN4,
            'HAN5' : this.tabHAN5,
        };
        this.game.registry.set('tabMovAll', this.tabMovAll);

        //STOP
        this.load.spritesheet('mov-stop-start', './media/img/mouvements/start.webp', {
            frameWidth: 960,
            frameHeight: 540,
            startFrame: 0,
            endFrame: LENGTH_MOV_STOP
        }); 
        this.load.spritesheet('mov-stop-end', './media/img/mouvements/end.webp', {
            frameWidth: 960,
            frameHeight: 540,
            startFrame: 0,
            endFrame: LENGTH_MOV_STOP
        }); 
        this.movStop = {intro : 'mov-stop-start', mov : 'mov-stop-end', lengthIntro:LENGTH_MOV_STOP, lengthMov:LENGTH_MOV_STOP};
        this.game.registry.set('tabMovStop', this.movStop);

        socket.on("CONNECTED", () => {
            console.log("je suis connectée")
            this.game.registry.set('connected', true);
        });
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
        this.music = this.sound.add('themeGame', {loop:true});
        // this.music.pause();
        this.game.registry.set('music', this.music);
        this.menuMusic = this.sound.add('menu', {loop:true});
        this.menuMusic.play();
        this.game.registry.set('musicMenu', this.menuMusic);
        cconsole.log('musicMenu load', this.menuMusic)

        // Lancer la scène suivante
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
