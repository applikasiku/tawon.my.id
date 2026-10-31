(function(root){
'use strict';
function plain(s){return String(s||'').replace(/<[^>]*>/g,' ').replace(/&nbsp;|&#160;/g,' ').replace(/\s+/g,' ').trim();}
function inspect(a){
 const c=String(a.content||''),t=plain(c),errors=[],warnings=[];
 const words=t.split(/\s+/).filter(Boolean).length;
 if(words<1000)errors.push('Isi minimal 1.000 kata; saat ini '+words+'.');
 if((a.title||'').trim().length<15||(a.title||'').length>100)errors.push('Judul harus jelas, antara 15–100 karakter.');
 if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(a.slug||''))errors.push('Slug memakai huruf kecil, angka, dan tanda hubung.');
 const meta=a.meta_title||a.title||'',desc=a.meta_description||'';
 if(meta.length<15||meta.length>70)errors.push('Judul SEO harus 15–70 karakter.');
 if(desc.length<100||desc.length>170)errors.push('Meta description harus 100–170 karakter; target editorial 140–155.');
 if(!a.excerpt||a.excerpt.length<50)errors.push('Ringkasan artikel minimal 50 karakter.');
 if(!/^https:\/\//.test(a.thumbnail_url||''))errors.push('Thumbnail HTTPS relevan wajib tersedia.');
 if(/<h1\b|^#\s+/mi.test(c))errors.push('H1 sudah disediakan dari judul; isi dimulai dengan H2.');
 const headings=(c.match(/<h2\b/gi)||[]).length+(c.match(/^##\s+/gm)||[]).length;
 if(headings<3)errors.push('Gunakan minimal tiga subjudul H2 yang berbeda.');
 if(!/<(?:ul|ol|table)\b|^\s*(?:[-*]|\d+\.)\s+/mi.test(c))errors.push('Tambahkan daftar langkah, poin, atau tabel yang membantu pembaca.');
 if(!/(?:href=["']\/?(?:artikel|info)|\]\(\/?(?:artikel|info)|href=["']https:\/\/tawon\.my\.id)/i.test(c))errors.push('Tambahkan tautan internal yang relevan dalam pembahasan.');
 if(!/(?:href=["']https:\/\/(?!tawon\.my\.id)|\]\(https:\/\/(?!tawon\.my\.id))/i.test(c))errors.push('Sertakan tautan sumber eksternal tepercaya.');
 if(!/(?:kesimpulan|penutup|langkah berikutnya|conclusion|next steps|takeaway)/i.test(t.slice(-1800)))errors.push('Akhiri dengan kesimpulan dan langkah berikutnya.');
 const ps=(c.match(/<p[^>]*>[\s\S]*?<\/p>/gi)||[]).map(plain).filter(x=>x.split(' ').length>20);
 if(new Set(ps.map(x=>x.toLowerCase())).size<ps.length)errors.push('Hapus paragraf yang identik dan berulang.');
 if(meta.length<45||meta.length>60)warnings.push('Target judul SEO sekitar 45–60 karakter, tanpa mengorbankan kejelasan.');
 if(words>2500)warnings.push('Periksa kebutuhan pembaca sebelum mempertahankan artikel di atas 2.500 kata.');
 return {version:'TAWON-2.0',words,errors,warnings,ready:!errors.length};
}
root.TawonEditorial={inspect,plain};if(typeof module!=='undefined')module.exports=root.TawonEditorial;
})(typeof window!=='undefined'?window:globalThis);
