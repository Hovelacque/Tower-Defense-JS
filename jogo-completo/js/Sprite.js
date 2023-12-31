class Sprite {
    constructor(x, y, imageSrc) {
        this.x = x;
        this.y = y;
        this.image = new Image()
        this.image.src = imageSrc;
    }

    draw() {
        ctx.drawImage(this.image,this.x, this.y);
    }

}