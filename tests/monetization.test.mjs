import {test} from 'node:test';
import assert from 'node:assert/strict';
import {publisherID,verificationMeta,adsText} from '../server/international/monetization.mjs';
import {pages} from '../server/international/pages.mjs';

test('missing or invalid publisher never authorizes a seller or injects markup',async()=>{
 for(const env of [{},{ADSENSE_PUBLISHER_ID:''},{ADSENSE_PUBLISHER_ID:'pub-123'},{ADSENSE_PUBLISHER_ID:'pub-1234567890123456<script>'},{ADSENSE_PUBLISHER_ID:'other-pub-1234567890123456'}]){
  assert.equal(publisherID(env),'');
  assert.equal(verificationMeta(env),'');
  const r=adsText(env);
  assert.equal(r.status,404);
  assert.ok(!(await r.text()).includes('DIRECT'));
 }
});

test('valid publisher creates matching verification and ads.txt without creating ad slots',async()=>{
 for(const value of ['pub-1234567890123456','ca-pub-1234567890123456']){
  const env={ADSENSE_PUBLISHER_ID:value};
  assert.equal(publisherID(env),'pub-1234567890123456');
  const markup=verificationMeta(env);
  assert.ok(markup.includes('name="google-adsense-account" content="ca-pub-1234567890123456"'));
  assert.ok(markup.includes('client=ca-pub-1234567890123456'));
  assert.match(markup,/<script async /);
  assert.match(markup,/crossorigin="anonymous"/);
  assert.equal((markup.match(/<script /g)||[]).length,1);
  assert.ok(!/ins class=["']adsbygoogle/.test(markup));
  const r=adsText(env);
  assert.equal(r.status,200);
  assert.match(r.headers.get('content-type'),/^text\/plain/);
  assert.equal(await r.text(),'google.com, pub-1234567890123456, DIRECT, f08c47fec0942fa0\n');
 }
});

test('privacy provides actionable advertising choices and honest activation status',()=>{
 for(const value of ['prior visits','myadcenter.google.com','optout.aboutads.info','policies.google.com/technologies/partner-sites','TAWON integrates the Google AdSense loader'])assert.ok(pages.privacy.body.includes(value));
});

test('publisher ID is never silently guessed from source defaults',async()=>{
 assert.equal(publisherID({}),'');
 assert.equal(verificationMeta({}),'');
 assert.equal((await adsText({})).status,404);
});
