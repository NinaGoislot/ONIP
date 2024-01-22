import Phaser from 'phaser';

class CabinetScene extends Phaser.Scene {
  constructor() {
    super({ key: 'CabinetScene' });
  }

  create(data) {
    // Récupération des données de la demande initiale
    const initialRequest = data.initialRequest;

    // Boutons pour sélectionner son jus
    const orangeButton = this.add.text(100, 200, 'Jus d\'orange', { fontSize: '20px', fill: '#fff' });
    const vodkaButton = this.add.text(300, 200, 'Vodka', { fontSize: '20px', fill: '#fff' });
    const appleButton = this.add.text(500, 200, 'Jus de pomme', { fontSize: '20px', fill: '#fff' });

    // Association des événements de clic à chaque bouton
    orangeButton.setInteractive().on('pointerdown', () => this.selectJuice('orange'));
    vodkaButton.setInteractive().on('pointerdown', () => this.selectJuice('vodka'));
    appleButton.setInteractive().on('pointerdown', () => this.selectJuice('pomme'));
  }

  selectJuice(juiceType) {
    console.log(`Vous avez sélectionné le jus de ${juiceType}.`);
    this.scene.resume('GameScene', { juiceType });
    this.scene.stop('CabinetScene');
  }
}

export default CabinetScene;
