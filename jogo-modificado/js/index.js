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

        let tipoId = Math.floor(Math.random() * 3) + 1;
        let tipo = tiposOrcs.find(x => x.id == tipoId);
        enimies.push(new Enemy(caminho_pontos[0].x - xOffset, caminho_pontos[0].y, tipo))
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
const deads = [];
let vidas = 0;
let moedas = 0;
let ondas = 0;
const torres = [];
const explosoes = [];
let velocidadeGlobal = 1;
let som = true;

const menuDeCompra = new Menu(
    canvas.width / 2 - 250,
    canvas.height - 125,
    tiposTorre.map((item, i) => {
        return new ItemMenu(`assets/tower${i + 1}/1.png`, item.niveis[0].valor, item)
    }),
    (item, valor) => {
        let espacaSelecionado = espacos.find(x => x.selecionado);
        if (moedas >= valor && espacaSelecionado != null) {
            atualizaMoedas(-valor);

            let tipo = tiposTorre.find(x => x.id == item.id);
            torres.push(new Torre(espacaSelecionado.x, espacaSelecionado.y, tipo, espacaSelecionado));
            torres.sort((a, b) => a.y - b.y); //ordena pelo y para não deixar sobrepostos

            espacaSelecionado.vazio = false;
            espacaSelecionado.selecionado = false;
            menuDeCompra.aberto = false;
        }
    }
);

const menuDeUpgrade = new Menu(
    canvas.width / 2 - 125,
    canvas.height - 125,
    [
        new ItemMenu(`assets/upgrade.png`, 0, 'upgrade', -1),
        new ItemMenu(`assets/demolir.png`, 0, 'demolir', -1, false)
    ],
    (option, valor) => {
        let torreSelecionada = torres.find(x => x.selecionada);
        if (torreSelecionada != null) {
            if (moedas >= valor && option == 'upgrade') {
                atualizaMoedas(-valor);
                torreSelecionada.upgrade();
                torreSelecionada.selecionada = false;
                menuDeUpgrade.aberto = false;
            }
            else if (option == 'demolir') {
                atualizaMoedas(+valor);
                torreSelecionada.espacoConstruido.vazio = true;
                let indexTorre = torres.findIndex(x => x.selecionada);
                torres.splice(indexTorre, 1);
                menuDeUpgrade.aberto = false;
            }
        }
    }
);

const menuDemolir = new Menu(
    canvas.width / 2 - 125,
    canvas.height - 125,
    [
        new ItemMenu(`assets/demolir.png`, 0, 'demolir', -1, false)
    ],
    (option, valor) => {
        let torreSelecionada = torres.find(x => x.selecionada);
        if (torreSelecionada != null) {
            atualizaMoedas(+valor);
            torreSelecionada.espacoConstruido.vazio = true;
            let indexTorre = torres.findIndex(x => x.selecionada);
            torres.splice(indexTorre, 1);

            menuDemolir.aberto = false;
        }
    }
);

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

    for (let i = deads.length - 1; i >= 0; i--) {
        let dead = deads[i];

        dead.update();

        if (dead.frames.current >= dead.frames.max - 1)
            deads.splice(i, 1);
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

    if (menuDeCompra.aberto)
        menuDeCompra.draw();

    if (menuDeUpgrade.aberto || menuDemolir.aberto) {
        torres.filter(x => !x.selecionada).forEach(item => item.update());
        let torreSelecionada = torres.find(x => x.selecionada);
        if (torreSelecionada != null) {
            //fundo esmaecido
            ctx.fillStyle = 'rgba(0,0,0,0.5)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            torreSelecionada.update();
        }

        if (menuDeUpgrade.aberto)
            menuDeUpgrade.draw();
        else
            menuDemolir.draw();
    }
    else
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

const btnSom = document.querySelector('#som');
btnSom.addEventListener('click', (e) => {
    som = !som;
    if (som)
        btnSom.src = 'assets/sound.svg';
    else
        btnSom.src = 'assets/mute.svg';
});

const btnVelocidade = document.querySelector('#velocidade');
btnVelocidade.addEventListener('click', (e) => {
    if (velocidadeGlobal == 1) {
        velocidadeGlobal = 2;
        btnVelocidade.src = 'assets/speed2.svg';
    }
    else {
        velocidadeGlobal = 1;
        btnVelocidade.src = 'assets/speed.svg';
    }
});

canvas.addEventListener('click', (e) => {

    if (menuDeCompra.aberto && menuDeCompra.isMouseOver())
        menuDeCompra.click()
    else {
        let espacaSelecionado = espacos.find(item => item.selecionado);
        if (espacaSelecionado != null)
            espacaSelecionado.selecionado = false;
        menuDeCompra.aberto = false;
    }

    if ((menuDeUpgrade.aberto && menuDeUpgrade.isMouseOver()) ||
        (menuDemolir.aberto && menuDemolir.isMouseOver())) {
        if (menuDeUpgrade.aberto)
            menuDeUpgrade.click();
        else
            menuDemolir.click();
    }
    else {
        let torreSelecionada = torres.find(x => x.selecionada);
        if (torreSelecionada != null)
            torreSelecionada.selecionada = false;
        menuDeUpgrade.aberto = false;
        menuDemolir.aberto = false;
    }

    let torre = torres.find(item => item.isMouseOver());
    if (torre != null)
        torre.click();

    let espaco = espacos.find(item => item.isMouseOver() && item.vazio);
    if (espaco != null)
        espaco.click();
})
