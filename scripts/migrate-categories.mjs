/**
 * migrate-categories.mjs
 * ──────────────────────
 * Prerequisite: Run this SQL in Supabase dashboard first:
 *   ALTER TABLE categories ADD COLUMN IF NOT EXISTS parent_id INTEGER REFERENCES categories(id) ON DELETE SET NULL;
 *
 * This script:
 * 1. Upserts 3 top-level topics: Electronics, AI, Robotics
 * 2. Upserts 11 subtopics linked via parent_id
 * 3. Remaps all existing articles to the correct subtopic
 *
 * Run: node scripts/migrate-categories.mjs
 */

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
    'https://isrzdxfbtgzkcypdmawa.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlzcnpkeGZidGd6a2N5cGRtYXdhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI1NDMzNDgsImV4cCI6MjA4ODExOTM0OH0.ctqmJAkTP4fF9qhjtiSbupaglmPZl58IBUs0H-AcxLc'
)

// ── Step 1: Upsert top-level parent topics ──────────────────────────────
console.log('\n🌐 Step 1: Upserting top-level topics...')

const now = new Date().toISOString()

const topLevel = [
    { name: 'Electronics', slug: 'electronics', color: '#3B82F6', icon: 'cpu', description: 'Hardware design, semiconductors, PCB, power, and materials.', created_at: now, updated_at: now },
    { name: 'AI', slug: 'ai', color: '#8B5CF6', icon: 'brain', description: 'Machine learning, AI hardware, and neuromorphic computing.', created_at: now, updated_at: now },
    { name: 'Robotics', slug: 'robotics', color: '#EF4444', icon: 'bot', description: 'Embedded systems, sensing, edge computing, and automation.', created_at: now, updated_at: now },
]

const { error: topErr } = await supabase
    .from('categories')
    .upsert(topLevel, { onConflict: 'slug' })

if (topErr) { console.error('❌ Top-level error:', topErr.message); process.exit(1) }

// Fetch all cats to build slug→id map
const { data: allCats } = await supabase.from('categories').select('id, name, slug')
const catMap = Object.fromEntries(allCats.map(c => [c.slug, c.id]))
console.log('  ✅ Top topics:', Object.keys(catMap).filter(s => ['electronics', 'ai', 'robotics'].includes(s)).map(s => `${s}(${catMap[s]})`).join(', '))

// ── Step 2: Upsert subtopics with parent_id ─────────────────────────────
console.log('\n📂 Step 2: Upserting subtopics...')

const subTopics = [
    // Under Electronics
    { name: 'Semiconductors', slug: 'semiconductors', color: '#3B82F6', icon: 'chip', parent_id: catMap['electronics'], description: 'Chip design, foundries, process nodes, and semiconductor supply chains.', created_at: now, updated_at: now },
    { name: 'PCB Design', slug: 'pcb-design', color: '#06B6D4', icon: 'circuit', parent_id: catMap['electronics'], description: 'PCB layout, signal integrity, EDA tools, and manufacturing.', created_at: now, updated_at: now },
    { name: 'Power Electronics', slug: 'power-electronics', color: '#F59E0B', icon: 'zap', parent_id: catMap['electronics'], description: 'GaN, SiC, power management ICs, and energy conversion.', created_at: now, updated_at: now },
    { name: 'Materials', slug: 'materials', color: '#10B981', icon: 'atom', parent_id: catMap['electronics'], description: 'Advanced materials — graphene, 2D materials, and novel substrates.', created_at: now, updated_at: now },
    { name: 'Sensors', slug: 'sensors', color: '#06B6D4', icon: 'radar', parent_id: catMap['electronics'], description: 'MEMS, radar, lidar, and sensing technologies.', created_at: now, updated_at: now },
    // Under AI
    { name: 'AI Hardware', slug: 'ai-hardware', color: '#8B5CF6', icon: 'gpu', parent_id: catMap['ai'], description: 'AI accelerators, NPUs, GPU architecture, and HBM memory.', created_at: now, updated_at: now },
    { name: 'Neuromorphic', slug: 'neuromorphic', color: '#A78BFA', icon: 'network', parent_id: catMap['ai'], description: 'Brain-inspired computing, spiking neural networks, silicon brains.', created_at: now, updated_at: now },
    { name: 'Machine Learning', slug: 'ml', color: '#7C3AED', icon: 'sparkle', parent_id: catMap['ai'], description: 'ML algorithms, frameworks, and their hardware implications.', created_at: now, updated_at: now },
    // Under Robotics
    { name: 'Embedded Systems', slug: 'embedded', color: '#EF4444', icon: 'cpu', parent_id: catMap['robotics'], description: 'RTOS, embedded Linux, microcontrollers, and firmware.', created_at: now, updated_at: now },
    { name: 'Edge Computing', slug: 'edge-computing', color: '#F97316', icon: 'server', parent_id: catMap['robotics'], description: 'Edge inference, tinyML, and distributed compute at the device.', created_at: now, updated_at: now },
    { name: 'Communication', slug: 'communication', color: '#EC4899', icon: 'signal', parent_id: catMap['robotics'], description: '5G, mmWave, antenna design, wireless connectivity.', created_at: now, updated_at: now },
]

const { error: subErr } = await supabase
    .from('categories')
    .upsert(subTopics, { onConflict: 'slug' })

if (subErr) { console.error('❌ Subtopic error:', subErr.message); process.exit(1) }

// Refresh map after insert
const { data: allCats2 } = await supabase.from('categories').select('id, name, slug')
const catMap2 = Object.fromEntries(allCats2.map(c => [c.slug, c.id]))
console.log('  ✅ Subtopics done:', subTopics.map(s => `${s.name}(${catMap2[s.slug]})`).join(', '))

// ── Step 3: Remap articles → new subtopic category IDs ─────────────────
console.log('\n📰 Step 3: Remapping articles to new subtopics...')

// Map article IDs → the new subtopic slug
// Based on actual article titles from the database
const articleRemap = [
    // --- AI Hardware ---
    { id: 20, slug: 'ai-hardware' },    // AI Chip Market Growth
    { id: 35, slug: 'ai-hardware' },    // Chiplet Architecture
    { id: 26, slug: 'ai-hardware' },    // HBM3 Memory Wars
    // --- Neuromorphic ---
    { id: 23, slug: 'neuromorphic' },   // The Silicon Brain: Neuromorphic Computing
    // --- Machine Learning ---
    { id: 27, slug: 'ml' },             // Quantum Computing
    // --- Semiconductors ---
    { id: 22, slug: 'semiconductors' }, // Semiconductor Supply Chain
    { id: 32, slug: 'semiconductors' }, // 3nm Node Race: TSMC vs Samsung
    // --- Power Electronics ---
    { id: 25, slug: 'power-electronics' }, // GaN and SiC Take Over
    { id: 34, slug: 'power-electronics' }, // Power Management IC Design
    // --- PCB Design ---
    { id: 28, slug: 'pcb-design' },     // PCB Design: Signal Integrity
    { id: 29, slug: 'pcb-design' },     // KiCad Revolution
    { id: 37, slug: 'pcb-design' },     // Open Hardware Movement
    // --- Materials ---
    { id: 24, slug: 'materials' },      // Graphene for Flexible Electronics
    { id: 30, slug: 'materials' },      // EV Battery: Solid-State vs Li-Ion
    // --- Sensors ---
    { id: 33, slug: 'sensors' },        // MEMS Sensors
    { id: 31, slug: 'sensors' },        // Radar on a Chip: mmWave
    // --- Embedded Systems ---
    { id: 39, slug: 'embedded' },       // Embedded Linux vs RTOS
    { id: 38, slug: 'embedded' },       // Thermal Management
    // --- Edge Computing ---
    { id: 21, slug: 'edge-computing' }, // RISC-V vs ARM: Edge Dominance
    // --- Communication ---
    { id: 36, slug: 'communication' },  // Antenna Design for 5G mmWave
]

let ok = 0, fail = 0
for (const { id, slug } of articleRemap) {
    const newId = catMap2[slug]
    if (!newId) { console.warn(`  ⚠️  Unknown slug "${slug}" — skipping article ${id}`); fail++; continue }
    const { error } = await supabase.from('articles').update({ category_id: newId }).eq('id', id)
    if (error) { console.warn(`  ⚠️  Article ${id}: ${error.message}`); fail++ }
    else { ok++ }
}
console.log(`  ✅ ${ok} remapped, ${fail} skipped/failed`)

// ── Done ──────────────────────────────────────────────────────────────────
console.log('\n🎉 All done! Final category tree:')
const { data: tree } = await supabase
    .from('categories')
    .select('id, name, slug, parent_id')
    .order('parent_id', { ascending: true, nullsFirst: true })

tree?.forEach(c => console.log(`  ${c.parent_id ? '  └─ ' : ''}[${c.id}] ${c.name} (${c.slug})${c.parent_id ? ` → parent:${c.parent_id}` : ''}`))
