import Phaser from 'phaser';

class Customer extends Phaser.GameObjects.Graphics {
    constructor(scene, x, y, emotion, drink, picture) {
        super(scene);
        scene.add.existing(this);

        // ATTRIBUTS
        this.x = x;
        this.y = y;
        this.firstDialogues = emotion.firstDialogues;
        this.secondaryDialogues = emotion.secondaryDialogues;
        this.drink = drink;
        this.picture = picture;
        this.indexNbrBottleChoosed = 0;

        this.dialogueIndex = 0;  // Index pour suivre la position actuelle dans le tableau de dialogues
        this.successDialogue = emotion.successText;
        this.failureDialogue = emotion.failureText;

        this.succeed = null ;

    }

    // ACCESSEURS
    get name() { return this._name; }
    set name(newName) { this._name = newName; }

    get presentation() { return this._presentation; }
    set presentation(newPresentation) { this._presentation = newPresentation; }

    get request() { return this._request; }
    set request(newRequest) { this._request = newRequest; }

    get drink() { return this._drink; }
    set drink(newDrink) { this._drink = newDrink; }

    get currentDialogue() { return this._currentDialogue; }
    set currentDialogue(newCurrentDialogue) { this._currentDialogue = newCurrentDialogue; }

    get succeed() { return this._succeed; }
    set succeed(succeed) { this._succeed = succeed; }
}

export default Customer;
