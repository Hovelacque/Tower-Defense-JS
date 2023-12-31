class Tiro extends Sprite {
    constructor(x, y, enemy) {
        super(x, y, 'assets/projectile.png');
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
            x: Math.cos(angulo) * this.aceleracao,
            y: Math.sin(angulo) * this.aceleracao
        };
        this.x += this.direcao.x;
        this.y += this.direcao.y;

    }
}