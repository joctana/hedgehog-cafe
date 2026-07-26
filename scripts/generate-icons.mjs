import { writeFileSync, mkdirSync } from 'node:fs'
import { deflateSync } from 'node:zlib'

function crc32(buf) {
  let c = ~0
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i]
    for (let k = 0; k < 8; k++) c = c & 1 ? (0xedb88320 ^ (c >>> 1)) : c >>> 1
  }
  return ~c >>> 0
}

function chunk(type, data) {
  const typeBuf = Buffer.from(type)
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length)
  const crc = Buffer.alloc(4)
  const crcBuf = Buffer.concat([typeBuf, data])
  crc.writeUInt32BE(crc32(crcBuf))
  return Buffer.concat([len, typeBuf, data, crc])
}

function createPng(size) {
  const raw = Buffer.alloc((size * 4 + 1) * size)
  for (let y = 0; y < size; y++) {
    const row = y * (size * 4 + 1)
    raw[row] = 0
    for (let x = 0; x < size; x++) {
      const i = row + 1 + x * 4
      const nx = (x + 0.5) / size - 0.5
      const ny = (y + 0.5) / size - 0.5
      const dist = Math.sqrt(nx * nx + ny * ny)
      if (dist > 0.48) {
        raw[i] = 0
        raw[i + 1] = 0
        raw[i + 2] = 0
        raw[i + 3] = 0
        continue
      }

      // Warm café circle background
      const t = dist / 0.48
      raw[i] = Math.round(246 - t * 50)
      raw[i + 1] = Math.round(215 - t * 70)
      raw[i + 2] = Math.round(176 - t * 70)
      raw[i + 3] = 255

      // Body
      const bx = nx
      const by = ny - 0.05
      if (bx * bx + by * by * 1.3 < 0.08) {
        raw[i] = 92
        raw[i + 1] = 61
        raw[i + 2] = 46
      }

      // Belly
      if (bx * bx * 1.4 + (by - 0.05) * (by - 0.05) * 1.8 < 0.03) {
        raw[i] = 232
        raw[i + 1] = 184
        raw[i + 2] = 150
      }

      // Eyes
      const left = (nx + 0.08) * (nx + 0.08) + (ny + 0.02) * (ny + 0.02)
      const right = (nx - 0.08) * (nx - 0.08) + (ny + 0.02) * (ny + 0.02)
      if (left < 0.0018 || right < 0.0018) {
        raw[i] = 43
        raw[i + 1] = 26
        raw[i + 2] = 18
      }

      // Spines top
      if (ny < -0.05 && dist < 0.36 && Math.abs(nx) < 0.28) {
        const ridge = Math.sin(nx * 40) * 0.02
        if (ny < -0.12 + ridge) {
          raw[i] = 61
          raw[i + 1] = 40
          raw[i + 2] = 24
        }
      }
    }
  }

  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(size, 0)
  ihdr.writeUInt32BE(size, 4)
  ihdr[8] = 8
  ihdr[9] = 6
  ihdr[10] = 0
  ihdr[11] = 0
  ihdr[12] = 0

  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw)),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

mkdirSync(new URL('../public/icons/', import.meta.url), { recursive: true })
for (const size of [180, 192, 512]) {
  const name =
    size === 180 ? 'apple-touch-icon.png' : size === 192 ? 'icon-192.png' : 'icon-512.png'
  writeFileSync(new URL(`../public/icons/${name}`, import.meta.url), createPng(size))
  console.log('wrote', name)
}
