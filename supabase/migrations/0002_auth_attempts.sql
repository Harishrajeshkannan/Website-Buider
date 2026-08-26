-- Migration 0002: auth_attempts table for application-level lockout (Task 4.2)
-- Requirements: 4.5
--
-- Supabase Auth does not expose a configurable 5-attempt/15-minute lockout in
-- the client SDK, so lockout state is tracked here, keyed by lowercased email.

create table if not exists public.auth_attempts (
  account_key text primary key,
  failed_count int not null default 0,
  locked_until timestamptz,
  last_failed_at timestamptz
);
