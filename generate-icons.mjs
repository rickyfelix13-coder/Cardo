#!/usr/bin/env node
// generate-icons.mjs
// Run: node generate-icons.mjs
// Generates /public/icons/icon-192.png and icon-512.png
// Requires: npm install canvas

import { createCanvas } from 'canvas';
import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

function generateIcon(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // Background
  ctx.fillStyle = '#080806';
  ctx.fillRect(0, 0, size, size);

  // Subtle border
  ctx.strokeStyle = '#1c1810';
  ctx.lineWidth = size * 0.02;
  ctx.strokeRect(size * 0.01, size * 0.01, size * 0.98, size * 0.98);

  // Text "C" — Bebas Neue style approximated
  const fontSize = size * 0.62;
  ctx.fillStyle = '#e8d5b0';
  ctx.font = `bold ${fontSize}px serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('C', size / 2, size / 2 + size * 0.04);

  // Accent line under
  const lineY = size * 0.78;
  const lineW = size * 0.28;
  ctx.strokeStyle = '#4a3f2a';
  ctx.lineWidth = size * 0.015;
  ctx.beginPath();
  ctx.moveTo(size / 2 - lineW / 2, lineY);
  ctx.lineTo(size / 2 + lineW / 2, lineY);
  ctx.stroke();

  return canvas.toBuffer('image/png');
}

const outDir = join(__dirname, 'public', 'icons');
mkdirSync(outDir, { recursive: true });

for (const size of [192, 512]) {
  const buf = generateIcon(size);
  writeFileSync(join(outDir, `icon-${size}.png`), buf);
  console.log(`✓ Generated icon-${size}.png`);
}

console.log('\nDone. Icons saved to /public/icons/');
