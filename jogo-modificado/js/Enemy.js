class Enemy extends Sprite {
    constructor(x, y) {
        let tipo = Math.floor(Math.random() * 3)
        if (tipo == 0)
            super(x, y, 'assets/orc1/walk.png', 7);
        else if (tipo == 1)
            super(x, y, 'assets/orc2/walk.png', 7);
        else if (tipo == 2)
            super(x, y, 'assets/orc3/walk.png', 7);
        this.tipo = tipo;
        this.x = x;
        this.y = y;
        this.proximoDestinoIndex = 0;
        this.width = 100;
        this.tamanho = 50;
        this.vida = 100;
        this.center = {
            x: this.x + this.tamanho,
            y: this.y + this.tamanho
        };
        this.direcao = {
            x: 0,
            y: 0
        };
        this.aceleracao = 2;
    }

    draw() {
        super.draw();

        //barra de vida
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x - this.tamanho, this.y - this.tamanho - 15, this.tamanho * 2, 10);
        ctx.fillStyle = 'green';
        ctx.fillRect(this.x - this.tamanho, this.y - this.tamanho - 15, this.tamanho * 2 * (this.vida / 100), 10);
    }

    update() {
        this.draw();
        super.update();

        const pontoDestino = caminho_pontos[this.proximoDestinoIndex];
        const yDistancia = pontoDestino.y - this.y;
        const xDistancia = pontoDestino.x - this.x;
        const angulo = Math.atan2(yDistancia, xDistancia);

        this.direcao = {
            x: Math.cos(angulo) * this.aceleracao * velocidadeGlobal,
            y: Math.sin(angulo) * this.aceleracao * velocidadeGlobal
        };
        this.x += this.direcao.x;
        this.y += this.direcao.y;

        this.center = {
            x: this.x + this.tamanho,
            y: this.y + this.tamanho
        };

        if (Math.abs(Math.round(pontoDestino.x) - Math.round(this.x)) < Math.abs(this.direcao.x) &&
            Math.abs(Math.round(pontoDestino.y) - Math.round(this.y)) < Math.abs(this.direcao.y) &&
            this.proximoDestinoIndex < caminho_pontos.length - 1)
            this.proximoDestinoIndex++;
    }
}
