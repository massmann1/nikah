import { deflateSync } from 'zlib';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const outDir = join(process.cwd(), 'public');
mkdirSync(outDir, { recursive: true });

const crcTable = (() => {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i += 1) {
    let c = i;
    for (let k = 0; k < 8; k += 1) {
      c = (c & 1) ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[i] = c >>> 0;
  }
  return table;
})();

function crc32(buffer) {
  let crc = 0xffffffff;
  for (let i = 0; i < buffer.length; i += 1) {
    crc = crcTable[(crc ^ buffer[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const typeBuffer = Buffer.from(type, 'ascii');
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);

  const crcBuffer = Buffer.alloc(4);
  const crcValue = crc32(Buffer.concat([typeBuffer, data]));
  crcBuffer.writeUInt32BE(crcValue, 0);

  return Buffer.concat([length, typeBuffer, data, crcBuffer]);
}

function lerp(a, b, t) {
  return Math.round(a + (b - a) * t);
}

function drawIcon(size) {
  const data = Buffer.alloc((size * 4 + 1) * size);

  const bgTop = [17, 24, 39];
  const bgBottom = [34, 44, 70];
  const glow = [255, 122, 89];
  const aqua = [93, 173, 226];

  const dotRadius = size * 0.075;
  const dotX = size * 0.32;
  const dotY = size * 0.32;

  const shapeLeft = size * 0.22;
  const shapeTop = size * 0.3;
  const shapeRight = size * 0.78;
  const shapeBottom = size * 0.78;
  const corner = size * 0.14;

  for (let y = 0; y < size; y += 1) {
    const rowOffset = y * (size * 4 + 1);
    data[rowOffset] = 0;

    for (let x = 0; x < size; x += 1) {
      const idx = rowOffset + 1 + x * 4;
      const t = y / (size - 1);

      let r = lerp(bgTop[0], bgBottom[0], t);
      let g = lerp(bgTop[1], bgBottom[1], t);
      let b = lerp(bgTop[2], bgBottom[2], t);

      const glowDx = x - size * 0.82;
      const glowDy = y - size * 0.15;
      const glowDist = Math.sqrt(glowDx * glowDx + glowDy * glowDy);
      const glowIntensity = Math.max(0, 1 - glowDist / (size * 0.7));
      r = lerp(r, glow[0], glowIntensity * 0.24);
      g = lerp(g, glow[1], glowIntensity * 0.24);
      b = lerp(b, glow[2], glowIntensity * 0.24);

      const inBody = x >= shapeLeft && y >= shapeTop && x <= shapeRight && y <= shapeBottom;
      if (inBody) {
        const cornerCheck = [
          [shapeLeft + corner, shapeTop + corner],
          [shapeRight - corner, shapeTop + corner],
          [shapeLeft + corner, shapeBottom - corner],
          [shapeRight - corner, shapeBottom - corner]
        ];

        let insideRounded = true;

        if (x < shapeLeft + corner && y < shapeTop + corner) {
          const dx = x - cornerCheck[0][0];
          const dy = y - cornerCheck[0][1];
          insideRounded = dx * dx + dy * dy <= corner * corner;
        } else if (x > shapeRight - corner && y < shapeTop + corner) {
          const dx = x - cornerCheck[1][0];
          const dy = y - cornerCheck[1][1];
          insideRounded = dx * dx + dy * dy <= corner * corner;
        } else if (x < shapeLeft + corner && y > shapeBottom - corner) {
          const dx = x - cornerCheck[2][0];
          const dy = y - cornerCheck[2][1];
          insideRounded = dx * dx + dy * dy <= corner * corner;
        } else if (x > shapeRight - corner && y > shapeBottom - corner) {
          const dx = x - cornerCheck[3][0];
          const dy = y - cornerCheck[3][1];
          insideRounded = dx * dx + dy * dy <= corner * corner;
        }

        if (insideRounded) {
          const localT = (x - shapeLeft) / (shapeRight - shapeLeft);
          r = lerp(aqua[0], glow[0], localT);
          g = lerp(aqua[1], glow[1], localT * 0.85);
          b = lerp(aqua[2], glow[2], localT * 0.55);
        }
      }

      const dxd = x - dotX;
      const dyd = y - dotY;
      if (dxd * dxd + dyd * dyd <= dotRadius * dotRadius) {
        r = 244;
        g = 248;
        b = 252;
      }

      data[idx] = r;
      data[idx + 1] = g;
      data[idx + 2] = b;
      data[idx + 3] = 255;
    }
  }

  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const compressed = deflateSync(data, { level: 9 });

  return Buffer.concat([signature, chunk('IHDR', ihdr), chunk('IDAT', compressed), chunk('IEND', Buffer.alloc(0))]);
}

const assets = [
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'icon-192.png', size: 192 },
  { name: 'icon-512.png', size: 512 },
  { name: 'icon-maskable-512.png', size: 512 }
];

for (const asset of assets) {
  writeFileSync(join(outDir, asset.name), drawIcon(asset.size));
}

console.log('Icons generated in public/');
