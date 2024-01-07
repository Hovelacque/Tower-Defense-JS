class Torre extends Sprite {
    constructor(x, y, tipo) {
        let img = `assets/tower${tipo.id}/1.png`;
        let nivel1 = tipo.niveis[0];
        super(
            x, y,
            img, 19,
            (10 - nivel1.velocidade) * ((100 / velocidadeGlobal) / 100),
            {
                x: 80,
                y: 0
            });
        this.nivel = nivel1
        this.tipo = tipo;
        this.x = x;
        this.y = y;
        this.width = 128;
        this.height = 64;
        this.center = {
            x: this.x + this.width / 2,
            y: this.y + this.height / 2
        }
        this.alvo = undefined;
        this.tiros = [];
    }

    update() {
        this.draw();

        //ajustando 'velocidade' da torre
        this.frames.hold = (10 - this.nivel.velocidade) * ((100 / velocidadeGlobal) / 100);

        if (this.alvo || (!this.alvo && this.frames.current !== 0))
            super.update();

        let validEnemy = enimies.filter(enemy => {
            const yDiferenca = enemy.y - this.center.y;
            const xDiferenca = enemy.x - this.center.x;
            const distancia = Math.hypot(xDiferenca, yDiferenca);
            return distancia < enemy.tamanho + this.nivel.raioAtaque;
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
                tiro.enemy.hit(this.nivel.forca);

                explosoes.push(new Sprite(tiro.x, tiro.y, `assets/tower${this.tipo.id}/explosion.png`, 4));
                if (som)
                    audio.crash.play();
                this.tiros.splice(i, 1);
            }
        }

        if (this.alvo &&
            this.frames.current == 6 && //frame exato do lançamento na animação 
            Math.floor(this.frames.elapsed % this.frames.hold) == 0)
            this.atirar();
    }


    atirar() {
        this.tiros.push(
            new Tiro(
                this.x + this.width / 2 + 10, //+10 para pedra sair do lugar certo
                this.y + this.height / 2 - 85, //-85 para pedra sair do lugar certo
                this.alvo,
                `assets/tower${this.tipo.id}/projectile.png`
            ));
    }

    isMouseOver() {
        if (mouse.x > this.x && mouse.x < this.x + this.width &&
            mouse.y > this.y && mouse.y < this.y + this.height)
            return true;
        else
            return false;
    }

}
