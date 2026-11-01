import {test} from 'node:test';
import assert from 'node:assert/strict';
import {publisherID,verificationMeta,adsText} from '../server/international/monetization.mjs';
import {pages} from '../server/international/pages.mjs';
test('unconfigured or invalid publisher never authorizes a seller or injects markup',async()=>{
 for(const value of ['', 'pub-123', 'pub-1234567890123456<script>', 'other-pub-1234567890123456']){
  const env={ADSENSE_PUBLISHER_ID:value};assert.equal(publisherID(env),'');assert.equal(verificationMeta(env),'');const r=adsText(env);assert.equal(r.status,404);assert.ok(!(await r.text()).includes('DIRECT'));
 }
});
test('valid publisher creates matching verification and ads.txt without activating ads',async()=>{
 for(const value of ['pub-1234567890123456','ca-pub-1234567890123456']){
  const env={ADSENSE_PUBLISHER_ID:value};assert.equal(publisherID(env),'pub-1234567890123456');assert.equal(verificationMeta(env),'<meta name="google-adsense-account" content="ca-pub-1234567890123456">');const r=adsText(env);assert.equal(r.status,200);assert.match(r.headers.get('content-type'),/^text\/plain/);assert.equal(await r.text(),'google.com, pub-1234567890123456, DIRECT, f08c47fec0942fa0\n');assert.ok(!verificationMeta(env).includes('<script'));
 }
});
test('privacy provides actionable advertising choices and honest activation status',()=>{
 for(const value of ['prior visits','myadcenter.google.com','optout.aboutads.info','policies.google.com/technologies/partner-sites','does not activate advertising scripts'])assert.ok(pages.privacy.body.includes(value));
});
