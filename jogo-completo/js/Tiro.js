class Tiro {
    constructor(x, y, enemy) {
        this.x = x;
        this.y = y;
        this.direcao = {
            x: 0,
            y: 0
        };
        this.tamanho = 10;
        this.enemy = enemy;
        this.aceleracao = 5;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.tamanho, 0, Math.PI * 2);
        ctx.fillStyle = 'orange';
        ctx.fill();
    }

    update() {
        this.draw();

        //movimenta
        const yDistancia = this.enemy.y - this.y;
        const xDistancia = this.enemy.x - this.x;
        const angulo = Math.atan2(yDistancia, xDistancia);
        this.direcao = {
            x: Math.cos(angulo) * this.aceleracao,
            y: Math.sin(angulo) * this.aceleracao
        };
        this.x += this.direcao.x;
        this.y += this.direcao.y;

    }
}