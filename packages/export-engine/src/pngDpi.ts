// Minimal PNG pHYs injector to ensure exported PNGs include a 300 DPI equivalent
// Adapted to TS from the Pattern Lab handover prototype.

export async function ensurePngDPI(blob: Blob, dpi: number) {
  const buf = await blob.arrayBuffer();
  const u8 = new Uint8Array(buf);
  const sig = [137, 80, 78, 71, 13, 10, 26, 10];
  for (let i = 0; i < 8; i++) if (u8[i] !== sig[i]) return blob; // not PNG

  let pos = 8;
  let ihdrEnd = -1;
  while (pos + 8 <= u8.length) {
    const len = readUint32(u8, pos);
    const type = readType(u8, pos + 4);
    const dataStart = pos + 8;
    const dataEnd = dataStart + len;
    const crcEnd = dataEnd + 4;
    if (type === 'IHDR') ihdrEnd = crcEnd;
    if (type === 'pHYs') {
      const out = u8.slice();
      const ppm = Math.round(dpi / 0.0254);
      writeUint32(out, dataStart + 0, ppm);
      writeUint32(out, dataStart + 4, ppm);
      out[dataStart + 8] = 1; // unit: meter
      const crc = crc32(out.subarray(pos + 4, dataEnd + 1));
      writeUint32(out, dataEnd, crc);
      return new Blob([out], { type: 'image/png' });
    }
    pos = crcEnd;
    if (type === 'IEND') break;
  }
  if (ihdrEnd < 0) return blob; // malformed

  // Build pHYs chunk to insert after IHDR
  const ppm = Math.round(dpi / 0.0254);
  const data = new Uint8Array(9);
  writeUint32(data, 0, ppm);
  writeUint32(data, 4, ppm);
  data[8] = 1; // per meter
  const typeBytes = new TextEncoder().encode('pHYs');
  const lenBytes = new Uint8Array([0, 0, 0, 9]);
  const crc = crc32(concat(typeBytes, data));
  const crcBytes = uint32be(crc);
  const chunk = concat(lenBytes, typeBytes, data, crcBytes);

  const before = u8.subarray(0, ihdrEnd);
  const after = u8.subarray(ihdrEnd);
  const out = concat(before, chunk, after);
  return new Blob([out], { type: 'image/png' });
}

function readUint32(u8: Uint8Array, off: number) {
  return (u8[off] << 24) | (u8[off + 1] << 16) | (u8[off + 2] << 8) | u8[off + 3];
}
function writeUint32(u8: Uint8Array, off: number, val: number) {
  u8[off + 0] = (val >>> 24) & 255;
  u8[off + 1] = (val >>> 16) & 255;
  u8[off + 2] = (val >>> 8) & 255;
  u8[off + 3] = (val >>> 0) & 255;
}
function readType(u8: Uint8Array, off: number) {
  return String.fromCharCode(u8[off], u8[off + 1], u8[off + 2], u8[off + 3]);
}
function uint32be(val: number) {
  return new Uint8Array([
    (val >>> 24) & 255,
    (val >>> 16) & 255,
    (val >>> 8) & 255,
    (val >>> 0) & 255
  ]);
}
function concat(...arrays: Uint8Array[]) {
  const len = arrays.reduce((a, b) => a + b.length, 0);
  const out = new Uint8Array(len);
  let p = 0;
  for (const arr of arrays) {
    out.set(arr, p);
    p += arr.length;
  }
  return out;
}

// CRC32 for PNG chunks
const CRC_TABLE = (() => {
  const tab = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    tab[n] = c >>> 0;
  }
  return tab;
})();
function crc32(u8: Uint8Array) {
  let c = 0xffffffff;
  for (let i = 0; i < u8.length; i++) c = CRC_TABLE[(c ^ u8[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

