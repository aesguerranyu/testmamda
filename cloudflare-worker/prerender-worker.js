/**
 * Cloudflare Worker for SEO Prerendering
 * 
 * Routes crawler/bot requests to the Supabase prerender edge function
 * while serving the normal SPA to regular users.
 * 
 * CLOUDFLARE ROUTE PATTERNS TO CONFIGURE (use these specific patterns, NOT catch-all):
 * - mamdanitracker.nyc/promises*
 * - mamdanitracker.nyc/indicators*
 * - mamdanitracker.nyc/zohran-mamdani-first-100-days*
 */

// Bot user agents to detect
const BOT_AGENTS = [
  'googlebot',
  'google-inspectiontool',
  'bingbot',
  'msnbot',
  'duckduckbot',
  'slurp',           // Yahoo
  'baiduspider',
  'yandexbot',
  'facebookexternalhit',
  'facebot',
  'twitterbot',
  'linkedinbot',
  'slackbot',
  'slackbot-linkexpanding',
  'discordbot',
  'whatsapp',
  'telegrambot',
  'pinterest',
  'embedly',
  'quora link preview',
  'outbrain',
  'rogerbot',
  'showyoubot',
  'applebot',
  'semrushbot',
  'ahrefsbot',
  'petalbot',
];

// Routes that should be prerendered for bots (homepage excluded)
const PRERENDER_ROUTES = [
  /^\/promises$/,
  /^\/promises\/.+$/,
  /^\/indicators$/,
  /^\/indicators\/.+$/,
  /^\/zohran-mamdani-first-100-days$/,
  /^\/zohran-mamdani-first-100-days\/\d{4}\/\d{2}\/\d{2}$/,
];

// Supabase prerender function URL
const PRERENDER_FUNCTION_URL = 'https://vjtltqxakolhzlqdnhop.supabase.co/functions/v1/prerender';

// Cache TTL in seconds (24 hours)
const CACHE_TTL = 86400;

/**
 * Check if the user agent is a known bot/crawler
 */
function isBot(userAgent) {
  if (!userAgent) return false;
  const ua = userAgent.toLowerCase();
  return BOT_AGENTS.some(bot => ua.includes(bot));
}

/**
 * Check if the path should be prerendered
 */
function shouldPrerender(pathname) {
  return PRERENDER_ROUTES.some(pattern => pattern.test(pathname));
}

/**
 * Generate a cache key for the request
 */
function getCacheKey(request) {
  const url = new URL(request.url);
  // Include only the path for caching (not query params for prerender)
  return new Request(`${url.origin}${url.pathname}`, {
    method: 'GET',
  });
}

/**
 * Fetch prerendered HTML from Supabase edge function
 */
async function fetchPrerendered(pathname) {
  const prerenderUrl = `${PRERENDER_FUNCTION_URL}?path=${encodeURIComponent(pathname)}`;
  
  const response = await fetch(prerenderUrl, {
    method: 'GET',
    headers: {
      'Accept': 'text/html',
    },
  });
  
  return response;
}

/**
 * Check if the request accepts HTML
 */
function acceptsHtml(request) {
  const accept = request.headers.get('accept') || '';
  return accept.includes('text/html') || accept.includes('*/*');
}

/**
 * Main worker handler
 */
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const pathname = url.pathname;
    const userAgent = request.headers.get('user-agent') || '';
    
    // Only process GET and HEAD requests
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      return fetch(request);
    }
    
    // Skip static assets
    if (pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot|json|xml|txt|map|webp|avif)$/i)) {
      return fetch(request);
    }
    
    // Only prerender requests that accept HTML (skip API/JSON requests)
    if (!acceptsHtml(request)) {
      return fetch(request);
    }
    
    // Check if this is a bot and the route should be prerendered
    const isBotRequest = isBot(userAgent);
    const shouldPrerenderRoute = shouldPrerender(pathname);
    
    if (!isBotRequest || !shouldPrerenderRoute) {
      // Serve normal SPA for non-bots or non-prerender routes
      return fetch(request);
    }
    
    // Bot request for a prerenderable route - check cache first
    const cache = caches.default;
    const cacheKey = getCacheKey(request);
    
    // Try to get from cache
    let cachedResponse = await cache.match(cacheKey);
    
    if (cachedResponse) {
      // Return cached response with verification header
      const headers = new Headers(cachedResponse.headers);
      headers.set('X-Prerender', '1');
      headers.set('X-Prerender-Cache', 'HIT');
      
      return new Response(cachedResponse.body, {
        status: cachedResponse.status,
        statusText: cachedResponse.statusText,
        headers,
      });
    }
    
    // Cache miss - fetch from prerender function
    try {
      const prerenderResponse = await fetchPrerendered(pathname);
      
      if (!prerenderResponse.ok) {
        // If prerender fails, fall back to SPA
        console.error(`Prerender failed for ${pathname}: ${prerenderResponse.status}`);
        return fetch(request);
      }
      
      // Get the HTML content
      const html = await prerenderResponse.text();
      
      // Create response with caching headers
      const responseHeaders = new Headers({
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': `public, s-maxage=${CACHE_TTL}, stale-while-revalidate=3600`,
        'X-Prerender': '1',
        'X-Prerender-Cache': 'MISS',
        'Vary': 'User-Agent',
      });
      
      const response = new Response(html, {
        status: 200,
        headers: responseHeaders,
      });
      
      // Store in cache (don't await - do in background)
      ctx.waitUntil(cache.put(cacheKey, response.clone()));
      
      return response;
      
    } catch (error) {
      console.error(`Prerender error for ${pathname}:`, error);
      // Fall back to SPA on error
      return fetch(request);
    }
  },
};
