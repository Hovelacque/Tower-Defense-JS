class Sprite {
    constructor(x, y, imageSrc, maxFrames = 1, frames = { elapsed: 0, hold: 5 }, offset = { x: 0, y: 0 }) {
        this.x = x;
        this.y = y;
        this.image = new Image()
        this.image.src = imageSrc;
        this.frames = {
            max: maxFrames,
            current: 0,
            elapsed: frames.elapsed,
            hold: frames.hold
        }
        this.offset = offset;
    }

    draw() {
        const cropWidth = this.image.width / this.frames.max
        const crop = {
            x: cropWidth * this.frames.current,
            y: 0,
            width: cropWidth,
            height: this.image.height
        }
        ctx.drawImage(this.image,
            crop.x, crop.y, crop.width, crop.height,
            (this.x - crop.width / 2) + this.offset.x,
            (this.y - crop.height / 2) + this.offset.y,
            crop.width, crop.height);
    }

    update() {
        this.draw();

        //animation
        this.frames.elapsed++;
        if (this.frames.elapsed % this.frames.hold == 0) {
            if (this.frames.current >= this.frames.max - 1)
                this.frames.current = 0;
            else
                this.frames.current++;
        }
    }
}