class EspacoParaConstrucao {
    static size = 64;
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.cor = 'rgba(255,255,255,0.1)';
        this.vazio = true;
    }

    draw() {
        ctx.fillStyle = this.cor;
        ctx.fillRect(this.x, this.y, EspacoParaConstrucao.size, EspacoParaConstrucao.size)
    }

    isMouseOver() {
        if (mouse.x > this.x && mouse.x < this.x + EspacoParaConstrucao.size &&
            mouse.y > this.y && mouse.y < this.y + EspacoParaConstrucao.size)
            return true;
        else
            return false;
    }

    update(mouse) {
        this.draw();

        if (this.isMouseOver())
            this.cor = 'white';
        else
            this.cor = 'rgba(255,255,255,0.1)';
    }
}