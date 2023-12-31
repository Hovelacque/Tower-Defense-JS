class Enemy {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        // this.height = 100;
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
        // ctx.fillStyle = 'red';
        // ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.tamanho, 0, Math.PI * 2);
        ctx.fillStyle = 'red';
        ctx.fill();

        ctx.beginPath();
        ctx.arc(this.x, this.y, 5, 0, Math.PI * 2);
        ctx.fillStyle = 'yellow';
        ctx.fill();

        //barra de vida
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x - this.tamanho, this.y - this.tamanho - 15, this.tamanho * 2, 10);
        ctx.fillStyle = 'green';
        ctx.fillRect(this.x - this.tamanho, this.y - this.tamanho - 15, this.tamanho * 2 * (this.vida / 100), 10);
    }

    update() {
        this.draw();

        const pontoDestino = caminho_pontos[this.proximoDestinoIndex];
        const yDistancia = pontoDestino.y - this.y;
        const xDistancia = pontoDestino.x - this.x;
        const angulo = Math.atan2(yDistancia, xDistancia);

        this.direcao = {
            x: Math.cos(angulo) * this.aceleracao,
            y: Math.sin(angulo) * this.aceleracao
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
