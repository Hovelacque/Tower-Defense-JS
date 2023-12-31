class Torre extends Sprite {
    constructor(x, y) {
        super(
            x, y,
            'assets/tower.png', 19,
            {
                x: 80,
                y: 0
            })
        this.x = x;
        this.y = y;
        this.width = 128;
        this.height = 64;
        this.raioAtaque = 250;
        this.center = {
            x: this.x + this.width / 2,
            y: this.y + this.height / 2
        }
        this.alvo = undefined;
        this.tiros = [];
        // this.frame = 0;
    }

    draw() {
        super.draw();

        ctx.beginPath();
        ctx.arc(this.center.x, this.center.y, this.raioAtaque, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0,0,255,0.1)'
        ctx.fill();
    }

    update() {
        this.draw();

        if (this.alvo || (!this.alvo && this.frames.current !== 0))
            super.update();

        let validEnemy = enimies.filter(enemy => {
            const yDiferenca = enemy.y - this.center.y;
            const xDiferenca = enemy.x - this.center.x;
            const distancia = Math.hypot(xDiferenca, yDiferenca);
            return distancia < enemy.tamanho + this.raioAtaque;
        });
        this.alvo = validEnemy[0];

        for (let i = this.tiros.length - 1; i >= 0; i--) {
            let tiro = this.tiros[i];

            tiro.update();

            //verifica colição do tiro com alvo
            const yDiferenca = tiro.enemy.y - tiro.y;
            const xDiferenca = tiro.enemy.x - tiro.x;
            const distancia = Math.hypot(xDiferenca, yDiferenca);
            if (distancia < tiro.enemy.tamanho + tiro.tamanho) {
                tiro.enemy.vida -= 10;
                if (tiro.enemy.vida <= 0) {
                    let enemyIndex = enimies.findIndex(x => tiro.enemy === x);
                    if (enemyIndex > -1) {
                        atualizaMoedas(+100);
                        enimies.splice(enemyIndex, 1);
                    }
                }

                this.tiros.splice(i, 1);
            }
        }

        if (this.alvo &&
            this.frames.current == 6 && //frame exato do lançamento na animação 
            this.frames.elapsed % this.frames.hold == 0)
            this.atirar();

        // this.frame++;
    }


    atirar() {
        this.tiros.push(
            new Tiro(
                this.x + this.width / 2 + 10, //+10 para pedra sair do lugar certo
                this.y + this.height / 2 - 85, //-85 para pedra sair do lugar certo
                this.alvo
            ));
    }
}
