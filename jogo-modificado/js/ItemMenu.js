class ItemMenu {

    constructor(image, valor, item) {
        this.x = 0;
        this.y = 0
        this.item = item;
        this.fundo = new Image();
        this.fundo.src = 'assets/menu.png';

        this.imagemDoItem = new Image();
        this.imagemDoItem.src = image;

        this.valor = valor;

        this.width = 125;
        this.height = 110;
    }

    draw() {
        //fundo de madeira
        ctx.drawImage(this.fundo, this.x, this.y);

        //valor
        if (moedas >= this.valor)
            ctx.fillStyle = "#ff9c01";
        else
            ctx.fillStyle = "#d01d1d";

        ctx.font = "30px Changa One";
        let xOffset = 55;
        xOffset -= (this.valor.toString().length - 1) * 10;
        ctx.fillText(this.valor, this.x + xOffset, this.y + this.fundo.height - 12);

        //imagem do item
        const cropWidth = this.imagemDoItem.width / 19
        const crop = {
            x: cropWidth * 4,
            y: 0,
            width: cropWidth,
            height: this.imagemDoItem.height
        }

        let xImagemDoItem = (this.x - crop.width / 2) + 100;
        let yImagemDoItem = (this.y - crop.height / 2) + 80;

        ctx.drawImage(this.imagemDoItem,
            crop.x, crop.y, crop.width, crop.height,
            xImagemDoItem, yImagemDoItem,
            55, 55);
    }

    isMouseOver() {
        if (mouse.x > this.x && mouse.x < this.x + this.width &&
            mouse.y > this.y && mouse.y < this.y + this.height)
            return true;
        else
            return false;
    }
}