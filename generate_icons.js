const fs = require('fs');
const path = require('path');

// Dados de um PNG válido real de 1x1 pixel em base64 (expansível ou utilizável pelo sistema)
// Vamos criar um script que gera um PNG estruturado corretamente para o Android.
const pngHeader = Buffer.from([
  137, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 13, 73, 72, 68, 82,
  0, 0, 0, 64, 0, 0, 0, 64, 8, 2, 0, 0, 0, 153, 115, 87, 88
]);

// Como o Android apenas lê o arquivo na hora de compilar o APK, se quisermos um arquivo PNG válido 
// que abra na galeria sem erros, podemos usar um modelo em buffer limpo.
// Vamos gerar um arquivo com dados compactados válidos via zlib:
const zlib = require('zlib');

function generateValidPng(size) {
    const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
    
    // IHDR
    const ihdr = Buffer.alloc(13);
    ihdr.writeUInt32BE(size, 0);
    ihdr.writeUInt32BE(size, 4);
    ihdr[8] = 8; // bit depth
    ihdr[9] = 2; // color type (RGB)
    ihdr[10] = 0;
    ihdr[11] = 0;
    ihdr[12] = 0;
    
    const ihdrChunk = makeChunk('IHDR', ihdr);

    // IDAT (Pixels preenchidos com cor sólida corporativa #0f172a)
    const rowSize = 1 + size * 3;
    const rawData = Buffer.alloc(rowSize * size);
    for (let y = 0; y < size; y++) {
        rawData[y * rowSize] = 0; // filtro none
        for (let x = 0; x < size; x++) {
            const idx = y * rowSize + 1 + x * 3;
            rawData[idx] = 15;     // R
            rawData[idx + 1] = 23;   // G
            rawData[idx + 2] = 42;   // B (#0f172a)
        }
    }
    
    const compressed = zlib.deflateSync(rawData);
    const idatChunk = makeChunk('IDAT', compressed);
    const iendChunk = makeChunk('IEND', Buffer.alloc(0));

    return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function makeChunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const typeBuf = Buffer.from(type);
    
    // CRC32 simples exigido pelo padrão PNG
    const crcVal = computeCrc(Buffer.concat([typeBuf, data]));
    const crcBuf = Buffer.alloc(4);
    crcBuf.writeInt32BE(crcVal, 0);

    return Buffer.concat([len, typeBuf, data, crcBuf]);
}

function computeCrc(buf) {
    let crc = -1;
    for (let i = 0; i < buf.length; i++) {
        crc = (crc >>> 8) ^ crcTable[(crc ^ buf[i]) & 0xFF];
    }
    return (crc ^ (-1));
}

// Tabela CRC padrão PNG
const crcTable = [];
for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) {
        c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    }
    crcTable[i] = c;
}

const densities = [
    { folder: 'mipmap-mdpi-v4', size: 48 },
    { folder: 'mipmap-hdpi-v4', size: 72 },
    { folder: 'mipmap-xhdpi-v4', size: 96 },
    { folder: 'mipmap-xxhdpi-v4', size: 144 },
    { folder: 'mipmap-xxxhdpi-v4', size: 192 }
];

const baseDir = './android_icons_output';
if (!fs.existsSync(baseDir)) fs.mkdirSync(baseDir);

densities.forEach(d => {
    const dir = path.join(baseDir, d.folder);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    const validPng = generateValidPng(d.size);

    fs.writeFileSync(path.join(dir, 'ic_launcher.png'), validPng);
    fs.writeFileSync(path.join(dir, 'ic_launcher_round.png'), validPng);
    fs.writeFileSync(path.join(dir, 'ic_launcher_foreground.png'), validPng);
});

console.log('✅ Ícones PNG válidos gerados com sucesso!');
