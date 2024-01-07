class Menu {
    constructor(x, y, itens, callback) {
        this.x = x;
        this.y = y;
        this.itens = itens;

        this.itens.forEach((item, i) => {
            item.x = this.x + (i * 125);
            item.y = this.y
        });

        this.width = 125 * this.itens.length;
        this.height = 110;
        this.aberto = false;

        this.callback = callback;
    }

    draw() {
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        this.itens.forEach(item => item.draw());
    }

    isMouseOver() {
        if (mouse.x > this.x && mouse.x < this.x + this.width &&
            mouse.y > this.y && mouse.y < this.y + this.height)
            return true;
        else
            return false;
    }

    click() {
        let itemClicado = this.itens.find(item => item.isMouseOver());
        if (itemClicado != null && this.callback)
            this.callback(itemClicado.item, itemClicado.valor)
    }
}