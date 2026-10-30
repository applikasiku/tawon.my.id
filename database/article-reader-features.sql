create table public.profile_verifications(
 user_id uuid primary key references public.profiles(id) on delete cascade,
 verified boolean not null default false
);
alter table public.profile_verifications enable row level security;
revoke all on public.profile_verifications from anon,authenticated;
grant select,insert,update on public.profile_verifications to authenticated;
create policy verification_admin_read on public.profile_verifications for select to authenticated using ((select private.is_current_user_admin()));
create policy verification_admin_insert on public.profile_verifications for insert to authenticated with check ((select private.is_current_user_admin()));
create policy verification_admin_update on public.profile_verifications for update to authenticated using ((select private.is_current_user_admin())) with check ((select private.is_current_user_admin()));
create table public.article_ratings(
 article_id uuid references public.articles(id) on delete cascade,
 user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
 rating smallint not null check (rating between 1 and 5),
 primary key(article_id,user_id)
);
create index article_ratings_user_idx on public.article_ratings(user_id);
alter table public.article_ratings enable row level security;
revoke all on public.article_ratings from anon,authenticated;
grant select,insert,update on public.article_ratings to authenticated;
create policy ratings_own_read on public.article_ratings for select to authenticated using (user_id=(select auth.uid()));
create policy ratings_own_insert on public.article_ratings for insert to authenticated with check(user_id=(select auth.uid()) and exists(select 1 from public.articles a where a.id=article_id and a.status='published' and a.published_at<=now()));
create policy ratings_own_update on public.article_ratings for update to authenticated using(user_id=(select auth.uid())) with check(user_id=(select auth.uid()) and exists(select 1 from public.articles a where a.id=article_id and a.status='published' and a.published_at<=now()));
-- This narrow public projection intentionally exposes only editorial identity and
-- aggregate statistics for a currently published article, never private profile fields.
create function private.article_reader_metadata(p_article_id uuid) returns jsonb
language sql stable security definer set search_path='' as $$
 select jsonb_build_object(
 'author',jsonb_build_object('display_name',coalesce(p.display_name,'Redaksi'),'avatar_url',p.avatar_url,'role',p.role,'verified',coalesce(v.verified,false)),
 'views',greatest(coalesce(a.view_count,0),(select count(*) from public.article_views av where av.article_id=a.id)),
 'rating_count',(select count(*) from public.article_ratings ar where ar.article_id=a.id),
 'rating_average',(select coalesce(round(avg(ar.rating),1),0) from public.article_ratings ar where ar.article_id=a.id))
 from public.articles a left join public.profiles p on p.id=a.author_id left join public.profile_verifications v on v.user_id=p.id
 where a.id=p_article_id and a.status='published' and a.published_at is not null and a.published_at<=now()
$$;
revoke all on function private.article_reader_metadata(uuid) from public;
grant usage on schema private to anon,authenticated;
grant execute on function private.article_reader_metadata(uuid) to anon,authenticated;
create function public.article_reader_metadata(p_article_id uuid) returns jsonb
language sql stable security invoker set search_path='' as $$
 select private.article_reader_metadata(p_article_id)
$$;
revoke all on function public.article_reader_metadata(uuid) from public;
grant execute on function public.article_reader_metadata(uuid) to anon,authenticated;
alter table public.profiles drop constraint profiles_role_check;
alter table public.profiles add constraint profiles_role_check check(role in ('admin','editor','author','user'));
