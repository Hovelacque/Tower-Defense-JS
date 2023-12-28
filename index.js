const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 1280;
canvas.height = 768;

ctx.fillStyle = 'white';
ctx.fillRect(0, 0, canvas.width, canvas.height);

const mapaImage = new Image();
mapaImage.onload = () => {
    ctx.drawImage(mapaImage, 0, 0);
}
mapaImage.src = 'assets/mapa.png';