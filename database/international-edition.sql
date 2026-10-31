alter table public.articles add column if not exists language text not null default 'id';
alter table public.articles alter column language set default 'en';
alter table public.articles add constraint articles_language_check check (language in ('en','id'));
create or replace function private.enforce_editorial_standard()
returns trigger language plpgsql security invoker set search_path='' as $$
declare issues text[]:=array[]::text[];h integer;c text:=coalesce(new.content,'');
begin
 if new.status<>'published' then return new;end if;
 if public.article_word_count(c)<1000 then issues:=array_append(issues,'Isi minimal 1.000 kata');end if;
 if char_length(coalesce(new.title,'')) not between 15 and 100 then issues:=array_append(issues,'Judul 15–100 karakter');end if;
 if coalesce(new.slug,'') !~ '^[a-z0-9]+(-[a-z0-9]+)*$' then issues:=array_append(issues,'Slug deskriptif tidak valid');end if;
 if char_length(coalesce(new.meta_title,'')) not between 15 and 70 then issues:=array_append(issues,'Judul SEO 15–70 karakter');end if;
 if char_length(coalesce(new.meta_description,'')) not between 100 and 170 then issues:=array_append(issues,'Deskripsi SEO 100–170 karakter');end if;
 if char_length(coalesce(new.excerpt,''))<50 then issues:=array_append(issues,'Ringkasan minimal 50 karakter');end if;
 if coalesce(new.thumbnail_url,'') !~ '^https://' then issues:=array_append(issues,'Thumbnail HTTPS wajib');end if;
 select count(*) into h from regexp_matches(c,'<h2\y|^##[[:space:]]','gim');
 if h<3 then issues:=array_append(issues,'Minimal tiga subjudul H2');end if;
 if c !~* '<(ul|ol|table)\y' and c !~ '(?m)^[[:space:]]*(-|\*|[0-9]+\.)[[:space:]]' then issues:=array_append(issues,'Daftar atau tabel pendukung wajib');end if;
 if c !~* '(href=["'']/((artikel|info))|\]\(/(artikel|info)|https://tawon.my.id)' then issues:=array_append(issues,'Tautan internal wajib');end if;
 if c !~* '(href=["'']https://|\]\(https://)' then issues:=array_append(issues,'Sumber eksternal wajib');end if;
 if right(regexp_replace(c,'<[^>]*>',' ','g'),1800) !~* '(kesimpulan|penutup|langkah berikutnya|conclusion|next steps|takeaway)' then issues:=array_append(issues,'Kesimpulan di akhir wajib');end if;
 if cardinality(issues)>0 then raise exception using errcode='23514',message='TAWON editorial standard 2.0: '||array_to_string(issues,'; ');end if;
 return new;
end $$;
