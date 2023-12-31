const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 1280;
canvas.height = 768;

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

class Torre {
    constructor(x, y) {
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
        this.frame = 0;
    }

    draw() {
        ctx.fillStyle = 'blue';
        ctx.fillRect(this.x, this.y, this.width, this.height);

        ctx.beginPath();
        ctx.arc(this.center.x, this.center.y, this.raioAtaque, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0,0,255,0.1)'
        ctx.fill();
    }

    update() {
        this.draw();

        let validEnemy = enimies.filter(enemy => {
            const yDiferenca = enemy.y - this.center.y;
            const xDiferenca = enemy.x - this.center.x;
            const distancia = Math.hypot(xDiferenca, yDiferenca);
            return distancia < enemy.tamanho + this.raioAtaque;
        });
        console.log(validEnemy);
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
                    if (enemyIndex > -1){
                        atualizaMoedas(+100);
                        enimies.splice(enemyIndex, 1);
                    }
                }

                this.tiros.splice(i, 1);
            }
        }

        if (this.frame % 100 == 0 && this.alvo)
            this.tiros.push(
                new Tiro(
                    this.x + this.width / 2,
                    this.y + this.height / 2,
                    this.alvo
                ));

        this.frame++;
    }
}

let enemiesCount = 0;
const enimies = [];

function spawnEnemies() {
    enemiesCount += 2;
    for (let i = 1; i <= enemiesCount; i++) {
        let xOffset = i * 150;
        enimies.push(new Enemy(caminho_pontos[0].x - xOffset, caminho_pontos[0].y))
    }
}
spawnEnemies()

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


let vidas = 0;
let moedas = 0;
const torres = [];

function atualizaMoedas(valor){
    moedas += valor;
    document.querySelector('#moedas').innerHTML = moedas;
}
atualizaMoedas(+200);

function atualizaVidas(valor){
    vidas += valor;
    document.querySelector('#vidas').innerHTML = vidas;
}
atualizaVidas(+10);

function animate() {
    const animationId = requestAnimationFrame(animate);

    ctx.drawImage(mapaImage, 0, 0);

    for (let i = enimies.length - 1; i >= 0; i--) {
        let enemy = enimies[i];

        enemy.update();

        if (enemy.x > canvas.width) {
            atualizaVidas(-1);
            enimies.splice(i, 1);

            if(vidas <=0){
                document.querySelector('.game_over').style.display = 'flex';
                cancelAnimationFrame(animationId);
            }
        }
    }

    if (enimies.length == 0)
        spawnEnemies()

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
        if (item.isMouseOver() && item.vazio && moedas >= 50) {
            atualizaMoedas(-50);
            torres.push(new Torre(item.x, item.y))
            item.vazio = false;
        }
    });

    console.log(torres);
})