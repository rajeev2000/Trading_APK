-- Only backend validation may activate a strategy.
drop policy if exists "strategies_insert_own_draft" on public.strategies;
drop policy if exists "strategies_update_own" on public.strategies;
create policy "strategies_insert_own_draft" on public.strategies for insert to authenticated with check (user_id = (select auth.uid()) and status = 'draft' and strategy_spec is null and version = 1);
create policy "strategies_update_own" on public.strategies for update to authenticated using (user_id = (select auth.uid()) and status = 'draft' and strategy_spec is null) with check (user_id = (select auth.uid()) and status = 'draft' and strategy_spec is null and version = 1);
