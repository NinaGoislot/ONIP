class EndScene extends Phaser.Scene {
    constructor() {
        super({ key: 'EndScene' });
    }

    create() {
        // Affiche le score et le texte "Temps écoulé!"
        const scoreText = this.add.text(200, 150, `Score: ` + this.game.registry.get('score'), { fontSize: '32px', fill: '#fff' });
        this.add.text(200, 200, 'Temps écoulé!', { fontSize: '32px', fill: '#fff' });

        // Bouton "Accueil"
        const homeButton = this.add.text(200, 250, 'Accueil', { fontSize: '24px', fill: '#fff' })
            .setInteractive()
            .on('pointerdown', () => this.goToMenu());
    }

    goToMenu() {
        // Retour au menu
        this.scene.start('MenuScene');
    }
}

export default EndScene;
