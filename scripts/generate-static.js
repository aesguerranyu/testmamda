import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const DIST_DIR = path.join(__dirname, '..', 'dist');
const BASE_URL = 'https://mamdanitracker.nyc';

// Read the base HTML template from dist/index.html
function getBaseTemplate() {
  const indexPath = path.join(DIST_DIR, 'index.html');
  if (!fs.existsSync(indexPath)) {
    console.error('dist/index.html not found. Run vite build first.');
    process.exit(1);
  }
  return fs.readFileSync(indexPath, 'utf-8');
}

// Generate SEO-optimized HTML for a promise
function generatePromiseHtml(baseTemplate, promise) {
  const { url_slugs, headline, short_description, status, category } = promise;
  const canonicalUrl = `${BASE_URL}/promises/${url_slugs}`;
  const title = `${headline} | Mamdani Tracker`;
  const description = short_description || `Track the status of Mayor Zohran Mamdani's promise: ${headline}`;

  let html = baseTemplate;

  // Replace or inject title
  if (html.includes('<title>')) {
    html = html.replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(title)}</title>`);
  } else {
    html = html.replace('</head>', `  <title>${escapeHtml(title)}</title>\n</head>`);
  }

  // Remove existing meta description and canonical if present
  html = html.replace(/<meta\s+name="description"[^>]*>/gi, '');
  html = html.replace(/<link\s+rel="canonical"[^>]*>/gi, '');

  // Remove existing OG tags
  html = html.replace(/<meta\s+property="og:title"[^>]*>/gi, '');
  html = html.replace(/<meta\s+property="og:description"[^>]*>/gi, '');
  html = html.replace(/<meta\s+property="og:url"[^>]*>/gi, '');
  html = html.replace(/<meta\s+property="og:type"[^>]*>/gi, '');

  // Inject new SEO meta tags before </head>
  const seoTags = `
  <meta name="description" content="${escapeHtml(description)}">
  <link rel="canonical" href="${canonicalUrl}">
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:url" content="${canonicalUrl}">
  <meta property="og:type" content="article">
  <meta property="og:site_name" content="Mamdani Tracker">
`;

  html = html.replace('</head>', `${seoTags}</head>`);

  // Add structured data for the promise
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": headline,
    "description": description,
    "url": canonicalUrl,
    "publisher": {
      "@type": "Organization",
      "name": "Mamdani Tracker",
      "url": BASE_URL
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": canonicalUrl
    }
  };

  const structuredDataScript = `<script type="application/ld+json">${JSON.stringify(structuredData)}</script>`;
  html = html.replace('</head>', `${structuredDataScript}\n</head>`);

  return html;
}

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Create directory if it doesn't exist
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

async function generateStaticPages() {
  console.log('🚀 Starting static page generation...\n');

  const baseTemplate = getBaseTemplate();

  // Fetch all published promises
  const { data: promises, error } = await supabase
    .from('promises')
    .select('url_slugs, headline, short_description, status, category')
    .eq('editorial_state', 'published');

  if (error) {
    console.error('Error fetching promises:', error.message);
    process.exit(1);
  }

  console.log(`📦 Found ${promises.length} published promises\n`);

  // Create promises directory
  const promisesDir = path.join(DIST_DIR, 'promises');
  ensureDir(promisesDir);

  let generated = 0;
  let failed = 0;

  for (const promise of promises) {
    const slug = promise.url_slugs;
    
    if (!slug) {
      console.warn(`⚠️  Skipping promise without slug: ${promise.headline}`);
      failed++;
      continue;
    }

    try {
      // Create folder for the promise: dist/promises/[slug]/
      const promiseDir = path.join(promisesDir, slug);
      ensureDir(promiseDir);

      // Generate and write index.html inside the folder
      const html = generatePromiseHtml(baseTemplate, promise);
      const outputPath = path.join(promiseDir, 'index.html');
      fs.writeFileSync(outputPath, html);

      console.log(`✅ Generated: /promises/${slug}/`);
      generated++;
    } catch (err) {
      console.error(`❌ Failed to generate ${slug}:`, err.message);
      failed++;
    }
  }

  console.log(`\n📊 Summary:`);
  console.log(`   Generated: ${generated}`);
  console.log(`   Failed: ${failed}`);
  console.log(`   Total: ${promises.length}`);
  console.log(`\n✨ Static generation complete!`);
}

// Run the generator
generateStaticPages().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
