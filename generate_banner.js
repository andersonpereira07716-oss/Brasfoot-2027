const { createCanvas } = require('canvas');
const fs = require('fs');

const width = 1024;
const height = 500;
const canvas = createCanvas(width, height);
const ctx = canvas.getContext('2d');

const gradient = ctx.createLinearGradient(0, 0, width, height);
gradient.addColorStop(0, '#0f172a');
gradient.addColorStop(0.5, '#1e293b');
gradient.addColorStop(1, '#020617');
ctx.fillStyle = gradient;
ctx.fillRect(0, 0, width, height);

const glow = ctx.createRadialGradient(width / 2, height / 2, 50, width / 2, height / 2, 400);
glow.addColorStop(0, 'rgba(34, 197, 94, 0.3)');
glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
ctx.fillStyle = glow;
ctx.fillRect(0, 0, width, height);

ctx.fillStyle = '#ffffff';
ctx.font = 'bold 64px sans-serif';
ctx.textAlign = 'center';
ctx.fillText('⚽ TOP CLUB DIRECTOR', width / 2, 210);

ctx.fillStyle = '#4ade80';
ctx.font = 'bold 26px sans-serif';
ctx.fillText('O SIMULADOR DEFINITIVO DE GESTÃO FUTEBOLÍSTICA', width / 2, 270);

ctx.fillStyle = '#94a3b8';
ctx.font = '20px sans-serif';
ctx.fillText('Gestão Financeira • Categorias de Base • Táticas Avançadas • Mercado Realista', width / 2, 340);

const buffer = canvas.toBuffer('image/png');
fs.writeFileSync('playstore_banner.png', buffer);
console.log('✅ Imagem playstore_banner.png criada!');
