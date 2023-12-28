const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 1280;
canvas.height = 768;

class Enemy {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
        this.width = 100;
        this.height = 100;
        this.proximoDestinoIndex = 0;
    }

    draw() {
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
    }

    proximoPonto() {
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

const enemy = new Enemy(caminho_pontos[0].x, caminho_pontos[0].y);
const enemy2 = new Enemy(caminho_pontos[0].x - 150, caminho_pontos[0].y);

function animate() {
    requestAnimationFrame(animate);

    ctx.drawImage(mapaImage, 0, 0);

    enemy.update();
    enemy2.update();
}

const mapaImage = new Image();
mapaImage.onload = () => {
    animate();
}
mapaImage.src = 'assets/mapa.png';