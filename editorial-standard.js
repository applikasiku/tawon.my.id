(function(root){
'use strict';
function plain(s){return String(s||'').replace(/<[^>]*>/g,' ').replace(/&nbsp;|&#160;/g,' ').replace(/\s+/g,' ').trim();}
function inspect(a){
 const c=String(a.content||''),t=plain(c),errors=[],warnings=[];
 const words=t.split(/\s+/).filter(Boolean).length;
 if(words<1000)errors.push('Content requires at least 1,000 words; current count: '+words+'.');
 if((a.title||'').trim().length<15||(a.title||'').length>100)errors.push('Use a clear title between 15 and 100 characters.');
 if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(a.slug||''))errors.push('Use lowercase letters, numbers and hyphens in the slug.');
 const meta=a.meta_title||a.title||'',desc=a.meta_description||'';
 if(meta.length<15||meta.length>70)errors.push('The SEO title must contain 15–70 characters.');
 if(desc.length<100||desc.length>170)errors.push('The meta description must contain 100–170 characters; aim for 140–155.');
 if(!a.excerpt||a.excerpt.length<50)errors.push('The article summary must contain at least 50 characters.');
 if(!/^https:\/\//.test(a.thumbnail_url||''))errors.push('Provide a relevant thumbnail using an HTTPS URL.');
 if(/<h1\b|^#\s+/mi.test(c))errors.push('The title provides H1; start body headings with H2.');
 const headings=(c.match(/<h2\b/gi)||[]).length+(c.match(/^##\s+/gm)||[]).length;
 if(headings<3)errors.push('Use at least three distinct H2 headings.');
 if(!/<(?:ul|ol|table)\b|^\s*(?:[-*]|\d+\.)\s+/mi.test(c))errors.push('Include a useful list, sequence or table.');
 if(!/(?:href=["']\/?(?:article|artikel|info)|\]\(\/?(?:article|artikel|info)|href=["']https:\/\/tawon\.my\.id)/i.test(c))errors.push('Include a relevant internal link.');
 if(!/(?:href=["']https:\/\/(?!tawon\.my\.id)|\]\(https:\/\/(?!tawon\.my\.id))/i.test(c))errors.push('Link to trustworthy external sources.');
 if(!/(?:kesimpulan|penutup|langkah berikutnya|conclusion|next steps|takeaway)/i.test(t.slice(-1800)))errors.push('End with a conclusion and next steps.');
 const ps=(c.match(/<p[^>]*>[\s\S]*?<\/p>/gi)||[]).map(plain).filter(x=>x.split(' ').length>20);
 if(new Set(ps.map(x=>x.toLowerCase())).size<ps.length)errors.push('Remove identical or repeated paragraphs.');
 if(meta.length<45||meta.length>60)warnings.push('Aim for an SEO title of around 45–60 characters without sacrificing clarity.');
 if(words>2500)warnings.push('Check reader needs before retaining an article longer than 2,500 words.');
 return {version:'TAWON-2.0',words,errors,warnings,ready:!errors.length};
}
root.TawonEditorial={inspect,plain};if(typeof module!=='undefined')module.exports=root.TawonEditorial;
})(typeof window!=='undefined'?window:globalThis);
