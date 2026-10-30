create function public.homepage_reader_metadata(p_article_ids uuid[]) returns jsonb
language sql stable security invoker set search_path='' as $$
 select coalesce(jsonb_agg(
 public.article_reader_metadata(a.id)||jsonb_build_object('id',a.id,'read_minutes',greatest(1,ceil(public.article_word_count(a.content)/200.0)::int))
 ),'[]'::jsonb)
 from public.articles a
 where a.id in (select x from unnest(p_article_ids) with ordinality as ids(x,n) where n<=30)
 and a.status='published' and a.published_at is not null and a.published_at<=now()
$$;
revoke all on function public.homepage_reader_metadata(uuid[]) from public;
grant execute on function public.homepage_reader_metadata(uuid[]) to anon,authenticated;
