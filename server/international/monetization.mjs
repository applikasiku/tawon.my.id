// Verification and authorized-seller declaration only. Ad serving requires separate CMP setup.
export function publisherID(env = {}) {
  const raw = String(env.ADSENSE_PUBLISHER_ID || '').trim();
  return /^(?:ca-)?pub-[0-9]{16}$/.test(raw) ? raw.replace(/^ca-/, '') : '';
}
export function verificationMeta(env) {
  const id = publisherID(env);
  return id ? `<meta name="google-adsense-account" content="ca-${id}">` : '';
}
export function adsText(env) {
  const id = publisherID(env);
  return new Response(id ? `google.com, ${id}, DIRECT, f08c47fec0942fa0\n` : '# No AdSense publisher has been configured.\n', {
    status: id ? 200 : 404,
    headers: {'Content-Type':'text/plain; charset=utf-8', 'Cache-Control':id ? 'public, max-age=300' : 'no-store', 'X-Content-Type-Options':'nosniff'}
  });
}
