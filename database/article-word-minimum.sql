-- Publication requirement: at least 1,000 whitespace-separated words.
-- HTML tags and common nonbreaking spaces do not count as words.
-- Draft/review content remains unrestricted.
create or replace function public.article_word_count(article_content text)
returns integer language sql immutable strict security invoker
set search_path = ''
as $$
 select count(*)::integer
 from pg_catalog.regexp_matches(
   pg_catalog.regexp_replace(
     pg_catalog.replace(pg_catalog.replace(article_content, '&nbsp;', ' '), '&#160;', ' '),
     '<[^>]*>', ' ', 'g'
   ), '[^[:space:]]+', 'g'
 );
$$;
create or replace function private.require_article_word_minimum()
returns trigger language plpgsql security invoker
set search_path = ''
as $$
begin
 if new.status = 'published' and public.article_word_count(new.content) < 1000 then
  raise exception 'Artikel minimal 1.000 kata sebelum diterbitkan. Saat ini % kata.', public.article_word_count(new.content)
   using errcode = '23514';
 end if;
 return new;
end;
$$;
revoke all on function private.require_article_word_minimum() from public, anon, authenticated;
drop trigger if exists articles_require_minimum_words on public.articles;
create trigger articles_require_minimum_words
 before insert or update of content, status on public.articles
 for each row execute function private.require_article_word_minimum();
