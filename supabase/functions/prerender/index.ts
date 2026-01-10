import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const SITE_URL = 'https://mamdanitracker.nyc'
const OG_IMAGE = 'https://mamdanitracker.nyc/og-image.png'

// Generate complete HTML page with correct meta tags
function generateHTML(options: {
  title: string;
  description: string;
  url: string;
  type?: string;
  headline?: string;
  content?: string;
  dateModified?: string;
  breadcrumbs?: Array<{ name: string; url: string }>;
}) {
  const { title, description, url, type = 'website', headline, content, dateModified, breadcrumbs } = options;
  
  const breadcrumbsJson = breadcrumbs ? JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  }) : '';

  const articleJson = type === 'article' ? JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": headline || title,
    "description": description,
    "url": url,
    "dateModified": dateModified || new Date().toISOString(),
    "author": {
      "@type": "Organization",
      "name": "Mamdani Tracker",
      "url": SITE_URL
    },
    "publisher": {
      "@type": "Organization",
      "name": "Mamdani Tracker",
      "url": SITE_URL,
      "logo": {
        "@type": "ImageObject",
        "url": OG_IMAGE
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": url
    }
  }) : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  
  <!-- Canonical URL -->
  <link rel="canonical" href="${url}">
  
  <!-- Primary Meta Tags -->
  <title>${title}</title>
  <meta name="description" content="${description}">
  <meta name="author" content="Mamdani Tracker">
  <meta name="robots" content="index, follow">
  <meta name="googlebot" content="index, follow">
  
  <!-- RSS Feed -->
  <link rel="alternate" type="application/rss+xml" title="Mamdani Tracker RSS Feed" href="${SITE_URL}/rss.xml">
  
  <!-- Favicon -->
  <link rel="icon" href="/favicon.png" type="image/png">

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="${type}">
  <meta property="og:url" content="${url}">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:image" content="${OG_IMAGE}">
  <meta property="og:site_name" content="Mamdani Tracker">
  <meta property="og:locale" content="en_US">

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image" content="${OG_IMAGE}">

  ${breadcrumbsJson ? `<script type="application/ld+json">${breadcrumbsJson}</script>` : ''}
  ${articleJson ? `<script type="application/ld+json">${articleJson}</script>` : ''}
</head>
<body>
  <main>
    <article>
      <h1>${headline || title.split(' | ')[0]}</h1>
      ${content ? `<div>${content}</div>` : ''}
      <p>${description}</p>
    </article>
    <nav>
      <a href="${SITE_URL}/">Home</a>
      <a href="${SITE_URL}/promises">All Promises</a>
      <a href="${SITE_URL}/indicators">Indicators</a>
      <a href="${SITE_URL}/zohran-mamdani-first-100-days">First 100 Days</a>
    </nav>
  </main>
  <noscript>
    <p>This is a static version of the page for search engines. Please enable JavaScript for the full experience.</p>
  </noscript>
</body>
</html>`;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    const path = url.searchParams.get('path') || '/'
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Handle promise detail pages
    const promiseMatch = path.match(/^\/promises\/([^/]+)$/)
    if (promiseMatch) {
      const slug = promiseMatch[1]
      
      const { data: promise, error } = await supabase
        .from('promises')
        .select('*')
        .eq('url_slugs', slug)
        .eq('editorial_state', 'published')
        .maybeSingle()

      if (error || !promise) {
        return new Response('Not found', { status: 404, headers: corsHeaders })
      }

      const pageUrl = `${SITE_URL}/promises/${promise.url_slugs}`
      const title = `${promise.headline} | Mamdani Tracker`
      const description = promise.short_description || `Track the status of Mayor Zohran Mamdani's promise: ${promise.headline}. Category: ${promise.category}. Status: ${promise.status}.`

      const html = generateHTML({
        title,
        description,
        url: pageUrl,
        type: 'article',
        headline: promise.headline,
        content: `
          <p><strong>Category:</strong> ${promise.category}</p>
          <p><strong>Status:</strong> ${promise.status}</p>
          <p><strong>Date Promised:</strong> ${promise.date_promised}</p>
          <p><strong>Owner Agency:</strong> ${promise.owner_agency || 'To be determined'}</p>
          ${promise.description ? `<p>${promise.description}</p>` : ''}
          ${promise.source_url ? `<p><strong>Source:</strong> <a href="${promise.source_url}">${promise.source_text || promise.source_url}</a></p>` : ''}
        `,
        dateModified: promise.updated_at,
        breadcrumbs: [
          { name: 'Home', url: SITE_URL },
          { name: 'Promises', url: `${SITE_URL}/promises` },
          { name: promise.headline, url: pageUrl }
        ]
      })

      return new Response(html, {
        headers: {
          ...corsHeaders,
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'public, max-age=3600, s-maxage=86400',
        },
      })
    }

    // Handle first 100 days detail pages
    const first100DaysMatch = path.match(/^\/zohran-mamdani-first-100-days\/(\d{4})\/(\d{2})\/(\d{2})$/)
    if (first100DaysMatch) {
      const [, year, month, day] = first100DaysMatch
      const dateIso = `${year}-${month}-${day}`

      const { data: dayEntry, error } = await supabase
        .from('first100_days')
        .select('*, activities:first100_activities(*)')
        .eq('date_iso', dateIso)
        .eq('editorial_state', 'published')
        .maybeSingle()

      if (error || !dayEntry) {
        return new Response('Not found', { status: 404, headers: corsHeaders })
      }

      const pageUrl = `${SITE_URL}/zohran-mamdani-first-100-days/${year}/${month}/${day}`
      const title = `Day ${dayEntry.day} - ${dayEntry.date_display} | First 100 Days | Mamdani Tracker`
      const description = `Track Mayor Zohran Mamdani's actions on Day ${dayEntry.day} (${dayEntry.date_display}). View executive orders, policy announcements, and appointments from the first 100 days.`

      const activitiesHtml = (dayEntry.activities || [])
        .sort((a: any, b: any) => a.sort_order - b.sort_order)
        .map((activity: any) => `
          <section>
            ${activity.title ? `<h2>${activity.title}</h2>` : ''}
            ${activity.type ? `<p><strong>Type:</strong> ${activity.type}</p>` : ''}
            ${activity.description ? `<p>${activity.description}</p>` : ''}
            ${activity.quote ? `<blockquote>"${activity.quote}"${activity.quote_attribution ? ` — ${activity.quote_attribution}` : ''}</blockquote>` : ''}
          </section>
        `).join('')

      const html = generateHTML({
        title,
        description,
        url: pageUrl,
        type: 'article',
        headline: `Day ${dayEntry.day} - ${dayEntry.date_display}`,
        content: activitiesHtml,
        dateModified: dayEntry.updated_at,
        breadcrumbs: [
          { name: 'Home', url: SITE_URL },
          { name: 'First 100 Days', url: `${SITE_URL}/zohran-mamdani-first-100-days` },
          { name: `Day ${dayEntry.day}`, url: pageUrl }
        ]
      })

      return new Response(html, {
        headers: {
          ...corsHeaders,
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'public, max-age=3600, s-maxage=86400',
        },
      })
    }

    // Handle promises list page
    if (path === '/promises') {
      const { data: promises } = await supabase
        .from('promises')
        .select('headline, url_slugs, category, status, short_description')
        .eq('editorial_state', 'published')

      const pageUrl = `${SITE_URL}/promises`
      const title = 'Campaign Promises Tracker | Mamdani Tracker'
      const description = "Track all of Mayor Zohran Mamdani's campaign promises. Filter by status and category to see which commitments are in progress, completed, or stalled."

      const promisesHtml = (promises || []).map(p => `
        <article>
          <h2><a href="${SITE_URL}/promises/${p.url_slugs}">${p.headline}</a></h2>
          <p><strong>Category:</strong> ${p.category} | <strong>Status:</strong> ${p.status}</p>
          <p>${p.short_description}</p>
        </article>
      `).join('')

      const html = generateHTML({
        title,
        description,
        url: pageUrl,
        type: 'website',
        headline: 'Promise Tracker',
        content: promisesHtml,
        breadcrumbs: [
          { name: 'Home', url: SITE_URL },
          { name: 'Promises', url: pageUrl }
        ]
      })

      return new Response(html, {
        headers: {
          ...corsHeaders,
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'public, max-age=3600, s-maxage=86400',
        },
      })
    }

    // Handle indicators page
    if (path === '/indicators') {
      const { data: indicators } = await supabase
        .from('indicators')
        .select('headline, category, current, target, description_paragraph')
        .eq('editorial_state', 'published')

      const pageUrl = `${SITE_URL}/indicators`
      const title = 'Policy Indicators Dashboard | Mamdani Tracker'
      const description = "Track key NYC performance indicators measuring the impact of Mayor Zohran Mamdani's policies. Data on housing, education, transportation, and more."

      const indicatorsHtml = (indicators || []).map(i => `
        <article>
          <h2>${i.headline}</h2>
          <p><strong>Category:</strong> ${i.category}</p>
          <p><strong>Current:</strong> ${i.current} | <strong>Target:</strong> ${i.target}</p>
          <p>${i.description_paragraph}</p>
        </article>
      `).join('')

      const html = generateHTML({
        title,
        description,
        url: pageUrl,
        type: 'website',
        headline: 'NYC Performance Indicators',
        content: indicatorsHtml,
        breadcrumbs: [
          { name: 'Home', url: SITE_URL },
          { name: 'Indicators', url: pageUrl }
        ]
      })

      return new Response(html, {
        headers: {
          ...corsHeaders,
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'public, max-age=3600, s-maxage=86400',
        },
      })
    }

    // Handle first 100 days list page
    if (path === '/zohran-mamdani-first-100-days') {
      const { data: days } = await supabase
        .from('first100_days')
        .select('day, date_display, date_iso')
        .eq('editorial_state', 'published')
        .order('day', { ascending: false })

      const pageUrl = `${SITE_URL}/zohran-mamdani-first-100-days`
      const title = "Zohran Mamdani's First 100 Days as NYC Mayor | Mamdani Tracker"
      const description = "Follow Mayor Zohran Mamdani's first 100 days in office. Track executive orders, appointments, policy announcements, and key actions day by day."

      const daysHtml = (days || []).map(d => {
        const datePath = d.date_iso?.replace(/-/g, '/')
        return `
          <article>
            <h2><a href="${SITE_URL}/zohran-mamdani-first-100-days/${datePath}">Day ${d.day} - ${d.date_display}</a></h2>
          </article>
        `
      }).join('')

      const html = generateHTML({
        title,
        description,
        url: pageUrl,
        type: 'website',
        headline: "First 100 Days",
        content: daysHtml,
        breadcrumbs: [
          { name: 'Home', url: SITE_URL },
          { name: 'First 100 Days', url: pageUrl }
        ]
      })

      return new Response(html, {
        headers: {
          ...corsHeaders,
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'public, max-age=3600, s-maxage=86400',
        },
      })
    }

    // Homepage
    if (path === '/') {
      const pageUrl = SITE_URL
      const title = "Mamdani Tracker | Tracking NYC Mayor Zohran Mamdani's Promises & Actions"
      const description = "An independent, nonpartisan public-interest tracker of NYC Mayor Zohran Mamdani's campaign promises, policy positions, and mayoral actions. Made for New Yorkers."

      const html = generateHTML({
        title,
        description,
        url: pageUrl,
        type: 'website',
        headline: 'Tracking Big Promises to New Yorkers',
        content: `
          <p>An independent, public-interest record tracking Mayor Zohran Mamdani's promises, actions, and progress, built with and for the people of New York City.</p>
          <nav>
            <ul>
              <li><a href="${SITE_URL}/promises">Promise Tracker</a> - Track every commitment with clear status updates</li>
              <li><a href="${SITE_URL}/indicators">NYC Performance Indicators</a> - Data and metrics on policy impact</li>
              <li><a href="${SITE_URL}/zohran-mamdani-first-100-days">First 100 Days</a> - Follow early priorities and actions</li>
            </ul>
          </nav>
        `,
        breadcrumbs: [
          { name: 'Home', url: SITE_URL }
        ]
      })

      return new Response(html, {
        headers: {
          ...corsHeaders,
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'public, max-age=3600, s-maxage=86400',
        },
      })
    }

    return new Response('Not found', { status: 404, headers: corsHeaders })

  } catch (error) {
    console.error('Prerender error:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to prerender page' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})