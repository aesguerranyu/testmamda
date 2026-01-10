import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Warning: VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY missing. Skipping static generation.');
  process.exit(0);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const DIST_DIR = path.join(__dirname, '../dist');
const TEMPLATE_PATH = path.join(DIST_DIR, 'index.html');

async function generate() {
  console.log('🚀 Starting Static Site Generation...');

  if (!fs.existsSync(TEMPLATE_PATH)) {
    console.error('❌ dist/index.html not found. Build must run first.');
    process.exit(1);
  }

  const template = fs.readFileSync(TEMPLATE_PATH, 'utf-8');

  // Fetch Promises (only published ones)
  const { data: promises, error } = await supabase
    .from('promises')
    .select('url_slugs, headline, status, short_description')
    .eq('editorial_state', 'published');

  if (error) {
    console.error('Error fetching promises:', error);
  } else {
    console.log(`📄 Generating ${promises.length} promise pages...`);
    for (const p of promises) {
      const slug = p.url_slugs;
      if (!slug) continue;
      
      const url = `/promises/${slug}`;
      const title = `${p.headline} | Mamdani Tracker`;
      const desc = p.short_description || `Track the status of: ${p.headline}. Current status: ${p.status}.`;
      
      // Escape quotes for HTML attributes
      const safeTitle = title.replace(/"/g, '&quot;');
      const safeDesc = desc.replace(/"/g, '&quot;');
      
      const html = template
        .replace(/<title>.*?<\/title>/, `<title>${safeTitle}</title>`)
        .replace(/<meta name="description" content=".*?"/, `<meta name="description" content="${safeDesc}"`)
        .replace(/<meta property="og:title" content=".*?"/, `<meta property="og:title" content="${safeTitle}"`)
        .replace(/<meta property="og:description" content=".*?"/, `<meta property="og:description" content="${safeDesc}"`)
        .replace(/<meta name="twitter:title" content=".*?"/, `<meta name="twitter:title" content="${safeTitle}"`)
        .replace(/<meta name="twitter:description" content=".*?"/, `<meta name="twitter:description" content="${safeDesc}"`)
        .replace(/<link rel="canonical" href=".*?"/, `<link rel="canonical" href="https://mamdanitracker.nyc${url}"`);

      const dir = path.join(DIST_DIR, url);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(path.join(dir, 'index.html'), html);
    }
  }
  console.log('✅ Static generation complete.');
}

generate();
