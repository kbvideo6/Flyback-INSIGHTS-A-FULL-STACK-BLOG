/**
 * Logo optimization script
 * Converts PNGs → WebP at appropriate sizes for each use case:
 *   logo-icon.png   → logo-icon.webp  (96px  — navbar icon, favicon-like)
 *   logofull.png    → logofull.webp   (480px wide — full stacked logo if ever used large)
 * Run once: node scripts/optimize-logos.mjs
 */

import sharp from 'sharp'
import { fileURLToPath } from 'url'
import path from 'path'
import fs from 'fs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const assetsDir = path.join(__dirname, '..', 'src', 'assets')

const jobs = [
    {
        input: 'logo-icon.png',
        output: 'logo-icon.webp',
        resize: { width: 96, height: 96 },   // navbar icon @ 2x for HiDPI
        quality: 92,
    },
    {
        input: 'logofull.png',
        output: 'logofull.webp',
        resize: { width: 480 },              // full stacked logo (wide)
        quality: 88,
    },
]

for (const job of jobs) {
    const src = path.join(assetsDir, job.input)
    const dest = path.join(assetsDir, job.output)

    const originalSize = fs.statSync(src).size
    await sharp(src)
        .resize(job.resize)
        .webp({ quality: job.quality })
        .toFile(dest)

    const newSize = fs.statSync(dest).size
    console.log(
        `✅ ${job.input} → ${job.output}  ` +
        `(${(originalSize / 1024).toFixed(0)} KB → ${(newSize / 1024).toFixed(0)} KB, ` +
        `${Math.round((1 - newSize / originalSize) * 100)}% smaller)`
    )
}

console.log('\n🎉 All logos optimized!')
