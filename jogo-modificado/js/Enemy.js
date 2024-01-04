class Enemy extends Sprite {
    constructor(x, y, tipo) {
        super(x, y, `assets/orc${tipo.id}/walk.png`, 7);
        this.tipo = tipo;
        this.x = x;
        this.y = y;
        this.proximoDestinoIndex = 0;
        this.tamanho = 50;
        this.tamanhoBarraDeVida = 100;
        this.vida = tipo.vida;
        this.aceleracao = tipo.aceleracao;
        this.center = {
            x: this.x + this.tamanho,
            y: this.y + this.tamanho
        };
        this.direcao = {
            x: 0,
            y: 0
        };
    }

    draw() {
        super.draw();

        //barra de vida
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x - this.tamanho, this.y - this.tamanho - 15, this.tamanhoBarraDeVida, 10);
        ctx.fillStyle = 'green';
        ctx.fillRect(this.x - this.tamanho, this.y - this.tamanho - 15, this.tamanhoBarraDeVida / (this.tipo.vida / this.vida) , 10);
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


    hit(power) {
        this.vida -= power;
        if (this.vida <= 0) { //die
            let enemyIndex = enimies.findIndex(x => this === x);
            if (enemyIndex > -1) {
                atualizaMoedas(this.tipo.moedas);
                deads.push(new Sprite(this.x, this.y, `assets/orc${this.tipo.id}/die.png`, 7))
                if (som)
                    audio.orc_die.play();
                enimies.splice(enemyIndex, 1);
            }
        }
        else {
            if (som)
                audio.orc_hit.play();
        }
    }
}
