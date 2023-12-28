const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 1280;
canvas.height = 768;

class Enemy {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        // this.width = 100;
        // this.height = 100;
        this.proximoDestinoIndex = 0;
        this.tamanho = 50;
    }

    draw() {
        // ctx.fillStyle = 'red';
        // ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.tamanho, 0, Math.PI * 2);
        ctx.fillStyle = 'red';
        ctx.fill();
    }

    update() {
        this.draw();

        const pontoDestino = caminho_pontos[this.proximoDestinoIndex];
        const yDistancia = pontoDestino.y - this.y;
        const xDistancia = pontoDestino.x - this.x;
        const angulo = Math.atan2(yDistancia, xDistancia);
        this.x += Math.cos(angulo);
        this.y += Math.sin(angulo);

        if (Math.round(pontoDestino.x) == Math.round(this.x) &&
            Math.round(pontoDestino.y) == Math.round(this.y) &&
            this.proximoDestinoIndex < caminho_pontos.length - 1)
            this.proximoDestinoIndex++;
    }
}

class EspacoParaConstrucao {
    static size = 64;
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.cor = 'rgba(255,255,255,0.1)';
        this.vazio = true;
    }

    draw() {
        ctx.fillStyle = this.cor;
        ctx.fillRect(this.x, this.y, EspacoParaConstrucao.size, EspacoParaConstrucao.size)
    }

    isMouseOver() {
        if (mouse.x > this.x && mouse.x < this.x + EspacoParaConstrucao.size &&
            mouse.y > this.y && mouse.y < this.y + EspacoParaConstrucao.size)
            return true;
        else
            return false;
    }

    update(mouse) {
        this.draw();

        if (this.isMouseOver())
            this.cor = 'white';
        else
            this.cor = 'rgba(255,255,255,0.1)';
    }
}

class Tiro {
    constructor(x, y, enemy) {
        this.x = x;
        this.y = y;
        this.velocidade = {
            x: 0,
            y: 0
        };
        this.tamanho = 10;
        this.enemy = enemy;
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
        this.velocidade = {
            x: Math.cos(angulo),
            y: Math.sin(angulo)
        };
        this.x += this.velocidade.x;
        this.y += this.velocidade.y;

    }
}

class Torre {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 128;
        this.height = 64;
        this.tiros = [
            new Tiro(
                this.x + this.width / 2,
                this.y + this.height / 2,
                enimies[0]
            )
        ]
    }

    draw() {
        ctx.fillStyle = 'blue';
        ctx.fillRect(this.x, this.y, this.width, this.height)
    }

    update() {
        this.draw();

        this.tiros.forEach((item, i) => {
            item.update()

            //verifica colição com alvo
            const yDiferenca = item.enemy.y - item.y;
            const xDiferenca = item.enemy.x - item.x;
            const distancia = Math.hypot(xDiferenca, yDiferenca);
            if (distancia < item.enemy.tamanho + item.tamanho)
                this.tiros.splice(i, 1);
        })
    }
}

const enimies = [];
for (let i = 1; i < 10; i++) {
    let xOffset = i * 150;
    enimies.push(new Enemy(caminho_pontos[0].x - xOffset, caminho_pontos[0].y))
}

const espacos2d = [];
for (let i = 0; i < espacos_para_torres.length; i += 20) {
    espacos2d.push(espacos_para_torres.slice(i, i + 20));
}
const espacos = [];
espacos2d.forEach((row, i) => {
    row.forEach((item, j) => {
        if (item == 14) {
            espacos.push(new EspacoParaConstrucao(
                j * EspacoParaConstrucao.size,  //x
                i * EspacoParaConstrucao.size   //y
            ))
        }
    })
})

const torres = [];

function animate() {
    requestAnimationFrame(animate);

    ctx.drawImage(mapaImage, 0, 0);

    enimies.forEach(item => item.update());

    espacos.forEach(item => item.update(mouse));

    torres.forEach(item => item.update());
}

const mapaImage = new Image();
mapaImage.onload = () => {
    animate();
}
mapaImage.src = 'assets/mapa.png';

const mouse = {
    x: undefined,
    y: undefined
}
window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
})

canvas.addEventListener('click', (e) => {
    espacos.forEach(item => {
        if (item.isMouseOver() && item.vazio) {
            torres.push(new Torre(item.x, item.y))
            item.vazio = false;
        }
    });

    console.log(torres);
})