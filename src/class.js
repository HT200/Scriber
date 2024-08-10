class Button extends PIXI.Sprite{
    constructor (x, y, texture, value){
        super(texture);
        this.anchor.set(0.5);
        this.x = x;
        this.y = y;
        this.buttonMode = true;
        this.interactive = true;
        this.value = value;
    }
}