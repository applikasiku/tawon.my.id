# TAWON — English edition

TAWON is an English-language practical publication at https://tawon.my.id, hosted by the existing Cloudflare Worker `tawon-my-id` and backed by the existing Supabase project. All 28 published articles are now in English. The 22 earlier articles retain their record IDs, source links and publication dates; old Indonesian URLs redirect permanently to their English URLs.

## Public experience

The Worker renders home, category, article, information, search and account shells on the server. English discovery sections are Technology, Business, Learning, Living and Sustainability. Published English articles are selected by `articles.language = 'en'`. All published articles now use `language = 'en'`; new CMS articles default to English. There is no geographic redirection or fabricated `hreflang` pairing. Canonical article URLs use `/article/<english-slug>`; old `/artikel.html?slug=...` links remain compatible through permanent redirects.

Article interactions include device-only bookmarks, sharing, text size, reactions, public comments, account-based ratings and ElevenLabs audio when configured. Account credentials remain in Supabase Auth, with authorization enforced by existing database RLS. The redesign does not activate ads or analytics.

## Source and deployment

- `server/worker.mjs`: routing, bounded data retrieval, edge caching, sitemap, RSS and public assets.
- `server/international/render.mjs`: HTML rendering, metadata, structured data and content sanitization.
- `server/international/styles.mjs`: responsive editorial design.
- `server/international/client.js`: reader interactions and account UI.
- `server/international/client.mjs`: generated string module for Worker deployment.
- `server/international/pages.mjs`: English information and policy pages.
- `server/international/admin.mjs`: generated module from `admin.html` so native API deployments retain the updated CMS.
- `server/international/editorial.mjs`: generated module from `editorial-standard.js`.
- `server/legacy.mjs`: retained audio implementation; language follows the article, with optional `ELEVENLABS_EN_VOICE_ID`.
- `database/international-edition.sql`: applied schema and bilingual editorial validation update.
- `content/english-launch.json` and `content/english/`: six original launch guides, published to Supabase.

Update generated string modules after editing their source: `export default ${JSON.stringify(source)};`. All Worker modules must be included in native multipart deployments, or bundled by Wrangler. The existing asset collection can be retained using `keep_assets: true` and `assets.config.run_worker_first: true`. Preserve existing bindings and secrets. `wrangler.jsonc` also configures Worker-first routing for reproducible CLI deployments.

Do not put credentials into source. Supabase's publishable key is intentionally public; service role keys and ElevenLabs keys belong only in server secrets. The English audio voice setting is optional; the existing multilingual voice remains the fallback. Missing audio configuration is presented honestly to readers.

## Editorial and SEO

Public pages have server-rendered titles, descriptions, canonical URLs, language declarations, Open Graph/Twitter tags and applicable Article/Breadcrumb/Organization schema. Search and account pages are noindex; unpublished articles are unavailable publicly. Sitemap includes actual published articles and stable information/category URLs; RSS includes English posts only. The app manifest and service-worker replacement are English, and stale TAWON caches are cleared during activation.

The existing 1,000-word publishing rule is retained as an internal workflow choice, not a claim about Google requirements. English conclusions accept `Next steps`, `Conclusion` or `Takeaway`; All dashboard text and validation feedback are in English. Ads require separate provider setup, privacy/consent review and approval. No ranking, CTR or AdSense acceptance is guaranteed.

## Validation

Completed route/status/metadata checks, publishing validation for all six guides, 390px mobile and desktop visual review, and database verification of language counts. Live article rendering, archive continuity and interactions should also be checked after deployment. Never post production test comments or ratings just to test a control.

## English completion

The public-source translations are in `content/english-translations.json`, and permanent slug mappings are in `server/international/redirects.mjs`. All translations passed structural editorial checks, retained every original source link, and retained the original numeric tokens. The private pre-migration checkpoint is excluded from Git. Public categories and tags have English labels; inactive legacy category slugs redirect to their current section. Preview configuration uses a separate audio rate-limit namespace.
