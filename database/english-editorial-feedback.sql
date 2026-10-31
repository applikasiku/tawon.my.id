create or replace function private.enforce_editorial_standard()
returns trigger language plpgsql security invoker set search_path='' as $$
declare issues text[]:=array[]::text[];h integer;c text:=coalesce(new.content,'');
begin
 if new.status<>'published' then return new;end if;
 if public.article_word_count(c)<1000 then issues:=array_append(issues,'Content requires at least 1,000 words');end if;
 if char_length(coalesce(new.title,'')) not between 15 and 100 then issues:=array_append(issues,'Title must contain 15–100 characters');end if;
 if coalesce(new.slug,'') !~ '^[a-z0-9]+(-[a-z0-9]+)*$' then issues:=array_append(issues,'Invalid descriptive slug');end if;
 if char_length(coalesce(new.meta_title,'')) not between 15 and 70 then issues:=array_append(issues,'SEO title must contain 15–70 characters');end if;
 if char_length(coalesce(new.meta_description,'')) not between 100 and 170 then issues:=array_append(issues,'SEO description must contain 100–170 characters');end if;
 if char_length(coalesce(new.excerpt,''))<50 then issues:=array_append(issues,'Summary requires at least 50 characters');end if;
 if coalesce(new.thumbnail_url,'') !~ '^https://' then issues:=array_append(issues,'An HTTPS thumbnail is required');end if;
 select count(*) into h from regexp_matches(c,'<h2\y|^##[[:space:]]','gim');
 if h<3 then issues:=array_append(issues,'At least three H2 headings are required');end if;
 if c !~* '<(ul|ol|table)\y' and c !~ '(?m)^[[:space:]]*(-|\*|[0-9]+\.)[[:space:]]' then issues:=array_append(issues,'A supporting list or table is required');end if;
 if c !~* '(href=["'']/((article|artikel|info))|\]\(/(article|artikel|info)|https://tawon.my.id)' then issues:=array_append(issues,'An internal link is required');end if;
 if c !~* '(href=["'']https://|\]\(https://)' then issues:=array_append(issues,'An external source is required');end if;
 if right(regexp_replace(c,'<[^>]*>',' ','g'),1800) !~* '(kesimpulan|penutup|langkah berikutnya|conclusion|next steps|takeaway)' then issues:=array_append(issues,'A concluding section is required');end if;
 if cardinality(issues)>0 then raise exception using errcode='23514',message='TAWON editorial standard 2.0: '||array_to_string(issues,'; ');end if;
 return new;
end $$;

create or replace function private.require_article_word_minimum() returns trigger language plpgsql security invoker set search_path='' as $$
begin
 if new.status='published' and public.article_word_count(new.content)<1000 then
 raise exception 'Published articles require at least 1,000 words. Current count: %.',public.article_word_count(new.content) using errcode='23514';
 end if;return new;
end;$$;
