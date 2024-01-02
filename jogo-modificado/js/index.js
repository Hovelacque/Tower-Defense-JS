const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 1280;
canvas.height = 768;

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

function spawnEnemies() {
    ondas++;
    document.querySelector('#ondas').innerHTML = ondas;
    enemiesCount += 2;
    for (let i = 1; i <= enemiesCount; i++) {
        let xOffset = i * 150;
        enimies.push(new Enemy(caminho_pontos[0].x - xOffset, caminho_pontos[0].y))
    }
}

function atualizaMoedas(valor) {
    moedas += valor;
    document.querySelector('#moedas').innerHTML = moedas;
}

function atualizaVidas(valor) {
    vidas += valor;
    document.querySelector('#vidas').innerHTML = vidas;
}

let enemiesCount = 0;
const enimies = [];
let vidas = 0;
let moedas = 0;
let ondas = 0;
const torres = [];
const explosoes = [];
let velocidadeGlobal = 1;

function startGame() {
    atualizaMoedas(+200);
    atualizaVidas(+10);
    spawnEnemies()
    animate();
}

function animate() {
    const animationId = requestAnimationFrame(animate);

    ctx.drawImage(mapaImage, 0, 0);

    for (let i = enimies.length - 1; i >= 0; i--) {
        let enemy = enimies[i];

        enemy.update();

        if (enemy.x > canvas.width) {
            atualizaVidas(-1);
            enimies.splice(i, 1);

            if (vidas <= 0) {
                document.querySelector('.game_over').style.display = 'flex';
                cancelAnimationFrame(animationId);
            }
        }
    }

    for (let i = explosoes.length - 1; i >= 0; i--) {
        let explosao = explosoes[i];

        explosao.update();

        if (explosao.frames.current >= explosao.frames.max - 1)
            explosoes.splice(i, 1);
    }

    if (enimies.length == 0)
        spawnEnemies()

    espacos.forEach(item => item.update(mouse));

    torres.forEach(item => item.update());
}

const mapaImage = new Image();
mapaImage.onload = () => {
    ctx.drawImage(mapaImage, 0, 0);
    //tirar o load se tiver algum dia e colocar o start ...
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

const start = document.querySelector('.start');
start.addEventListener('click', (e) => {
    start.style.display = 'none';
    startGame();
});

const btnVelocidade = document.querySelector('#velocidade');
btnVelocidade.addEventListener('click', (e) => {
    if(velocidadeGlobal == 1){
        velocidadeGlobal = 2;
        btnVelocidade.src = 'assets/speed2.svg';
    }
    else{
        velocidadeGlobal = 1;
        btnVelocidade.src = 'assets/speed.svg';
    }
});

canvas.addEventListener('click', (e) => {
    espacos.forEach(item => {
        if (item.isMouseOver() && item.vazio && moedas >= 50) {
            atualizaMoedas(-50);
            torres.push(new Torre(item.x, item.y))
            item.vazio = false;
            torres.sort((a, b) => a.y - b.y); //ordena pelo y para não deixar sobrepostos
        }
    });
})
