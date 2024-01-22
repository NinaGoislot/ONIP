class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    create() {
        // Afficher le menu
        this.add.text(200, 150, 'Menu', { fontSize: '32px', fill: '#fff' });
        
        // Ajouter un bouton "Mode libre"
        const btnSoloMode = this.add.text(200, 200, 'Mode libre', { fontSize: '24px', fill: '#fff' })
            .setInteractive()
            .on('pointerdown', () => this.startGame());
    }

    startGame() {
        // Lancer la scène de jeu
        this.scene.start('GameScene');
    }
}

export default MenuScene;