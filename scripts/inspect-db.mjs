/**
 * Script: inspect-db.mjs
 * Reads current categories + article titles/category assignments from Supabase
 * Run: node scripts/inspect-db.mjs
 */
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
    'https://isrzdxfbtgzkcypdmawa.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlzcnpkeGZidGd6a2N5cGRtYXdhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI1NDMzNDgsImV4cCI6MjA4ODExOTM0OH0.ctqmJAkTP4fF9qhjtiSbupaglmPZl58IBUs0H-AcxLc'
)

console.log('\n=== CATEGORIES ===')
const { data: cats } = await supabase.from('categories').select('*').order('name')
console.table(cats)

console.log('\n=== ARTICLES (id, title, category_id) ===')
const { data: arts } = await supabase
    .from('articles')
    .select('id, title, category_id, is_published, categories(name)')
    .order('title')
console.table(arts?.map(a => ({ id: a.id, category: a.categories?.name, title: a.title?.slice(0, 60) })))
