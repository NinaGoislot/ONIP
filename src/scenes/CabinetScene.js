import Phaser from 'phaser';

class CabinetScene extends Phaser.Scene {
  constructor() {
    super({ key: 'CabinetScene' });
  }

  create() {
    // Récupérer les données de cocktails depuis le registre
    const cocktailsData = this.game.registry.get('cocktails');

     // Position initiale des boutons
     let buttonX = 100;
     let buttonY = 200;

     // Créer des boutons pour chaque cocktail dans les données
     for (const cocktail of cocktailsData) {
       const cocktailButton = this.add.text(buttonX, buttonY, cocktail.name, { fontSize: '20px', fill: '#fff' });

       // Associer l'événement de clic à chaque bouton
       cocktailButton.setInteractive().on('pointerdown', () => this.selectJuice(cocktail.name));

       // Ajuster la position pour le prochain bouton
       buttonX += 300;

       // Changer de ligne après chaque 3 boutons pour éviter de déborder à l'horizontale
       if (buttonX > 500) {
         buttonX = 100;
         buttonY += 50;
       }
     }
  }

  selectJuice(juiceType) {
    console.log(`Vous avez sélectionné ${juiceType}.`);
    this.game.registry.set('playerJuiceChoice', juiceType);
    this.scene.start('GameScene');
  }
}

export default CabinetScene;
