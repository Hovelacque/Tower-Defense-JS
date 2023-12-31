class Tiro extends Sprite {
    constructor(x, y, enemy, image) {
        super(x, y, image);
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

    update() {
        this.draw();

        //movimenta
        const yDistancia = this.enemy.y - this.y;
        const xDistancia = this.enemy.x - this.x;
        const angulo = Math.atan2(yDistancia, xDistancia);
        this.direcao = {
            x: Math.cos(angulo) * this.aceleracao * velocidadeGlobal,
            y: Math.sin(angulo) * this.aceleracao * velocidadeGlobal
        };
        this.x += this.direcao.x;
        this.y += this.direcao.y;

    }
}