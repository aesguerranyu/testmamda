import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import type { Plugin } from 'vite';

const BASE_URL = 'https://mamdanitracker.nyc';

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function ensureDir(dirPath: string): void {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

interface Promise {
  url_slugs: string;
  headline: string;
  short_description: string;
  status: string;
  category: string;
  last_updated?: string;
}

function generatePromiseHtml(baseTemplate: string, promise: Promise): string {
  const { url_slugs, headline, short_description, last_updated } = promise;
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
    "dateModified": last_updated || new Date().toISOString(),
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

export function staticGenPlugin(): Plugin {
  let distDir: string;

  return {
    name: 'vite-plugin-static-gen',
    apply: 'build',
    
    configResolved(config) {
      distDir = config.build.outDir;
    },

    async closeBundle() {
      console.log('\n🚀 Starting static page generation...\n');

      // Get Supabase credentials from environment
      const supabaseUrl = process.env.VITE_SUPABASE_URL;
      const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

      if (!supabaseUrl || !supabaseKey) {
        console.warn('⚠️  Missing Supabase credentials. Skipping static generation.');
        return;
      }

      const supabase = createClient(supabaseUrl, supabaseKey);

      // Read the base HTML template
      const indexPath = path.resolve(distDir, 'index.html');
      if (!fs.existsSync(indexPath)) {
        console.error('❌ dist/index.html not found.');
        return;
      }
      const baseTemplate = fs.readFileSync(indexPath, 'utf-8');

      // Fetch all published promises
      const { data: promises, error } = await supabase
        .from('promises')
        .select('url_slugs, headline, short_description, status, category, last_updated')
        .eq('editorial_state', 'published');

      if (error) {
        console.error('❌ Error fetching promises:', error.message);
        return;
      }

      console.log(`📦 Found ${promises?.length || 0} published promises\n`);

      if (!promises || promises.length === 0) {
        console.log('No published promises to generate.');
        return;
      }

      // Create promises directory
      const promisesDir = path.resolve(distDir, 'promises');
      ensureDir(promisesDir);

      let generated = 0;
      let failed = 0;

      for (const promise of promises as Promise[]) {
        const slug = promise.url_slugs;

        if (!slug) {
          console.warn(`⚠️  Skipping promise without slug: ${promise.headline}`);
          failed++;
          continue;
        }

        try {
          // Create folder for the promise: dist/promises/[slug]/
          const promiseDir = path.resolve(promisesDir, slug);
          ensureDir(promiseDir);

          // Generate and write index.html inside the folder
          const html = generatePromiseHtml(baseTemplate, promise);
          const outputPath = path.resolve(promiseDir, 'index.html');
          fs.writeFileSync(outputPath, html);

          console.log(`✅ Generated: /promises/${slug}/`);
          generated++;
        } catch (err) {
          console.error(`❌ Failed to generate ${slug}:`, err);
          failed++;
        }
      }

      console.log(`\n📊 Summary:`);
      console.log(`   Generated: ${generated}`);
      console.log(`   Failed: ${failed}`);
      console.log(`   Total: ${promises.length}`);
      console.log(`\n✨ Static generation complete!`);
    }
  };
}
