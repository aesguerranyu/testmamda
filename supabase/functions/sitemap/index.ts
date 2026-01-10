import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const SITE_URL = 'https://mamdanitracker.nyc'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Fetch all published promises
    const { data: promises, error: promisesError } = await supabase
      .from('promises')
      .select('url_slugs, updated_at')
      .eq('editorial_state', 'published')

    if (promisesError) {
      console.error('Error fetching promises:', promisesError)
    }

    // Fetch all published indicators  
    const { data: indicators, error: indicatorsError } = await supabase
      .from('indicators')
      .select('id, updated_at')
      .eq('editorial_state', 'published')

    if (indicatorsError) {
      console.error('Error fetching indicators:', indicatorsError)
    }

    // Fetch all published first 100 days entries
    const { data: first100days, error: first100daysError } = await supabase
      .from('first100_days')
      .select('date_iso, updated_at')
      .eq('editorial_state', 'published')

    if (first100daysError) {
      console.error('Error fetching first100days:', first100daysError)
    }

    // Get the most recent update across all content
    const allDates = [
      ...(promises || []).map(p => new Date(p.updated_at)),
      ...(indicators || []).map(i => new Date(i.updated_at)),
      ...(first100days || []).map(d => new Date(d.updated_at)),
    ]
    const mostRecentDate = allDates.length > 0 
      ? new Date(Math.max(...allDates.map(d => d.getTime())))
      : new Date()

    const formatDate = (date: Date | string) => {
      const d = new Date(date)
      return d.toISOString().split('T')[0]
    }

    // Build sitemap XML
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${SITE_URL}/</loc>
    <lastmod>${formatDate(mostRecentDate)}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${SITE_URL}/promises</loc>
    <lastmod>${formatDate(mostRecentDate)}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${SITE_URL}/indicators</loc>
    <lastmod>${formatDate(mostRecentDate)}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${SITE_URL}/zohran-mamdani-first-100-days</loc>
    <lastmod>${formatDate(mostRecentDate)}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${SITE_URL}/about</loc>
    <lastmod>${formatDate(mostRecentDate)}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>${SITE_URL}/actions</loc>
    <lastmod>${formatDate(mostRecentDate)}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${SITE_URL}/appointments</loc>
    <lastmod>${formatDate(mostRecentDate)}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`

    // Add individual promise pages
    if (promises && promises.length > 0) {
      for (const promise of promises) {
        if (promise.url_slugs) {
          sitemap += `
  <url>
    <loc>${SITE_URL}/promises/${promise.url_slugs}</loc>
    <lastmod>${formatDate(promise.updated_at)}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`
        }
      }
    }

    // Add individual first 100 days detail pages
    if (first100days && first100days.length > 0) {
      for (const day of first100days) {
        if (day.date_iso) {
          const datePath = day.date_iso.replace(/-/g, '/')
          sitemap += `
  <url>
    <loc>${SITE_URL}/zohran-mamdani-first-100-days/${datePath}</loc>
    <lastmod>${formatDate(day.updated_at)}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`
        }
      }
    }

    sitemap += `
</urlset>`

    return new Response(sitemap, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600',
      },
    })
  } catch (error) {
    console.error('Error generating sitemap:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to generate sitemap' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
