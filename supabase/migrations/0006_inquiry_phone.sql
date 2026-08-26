-- Migration 0006: add phone (with country code) to inquiries.
-- Captures the customer's contact number alongside their message.
-- Run in the Supabase SQL editor.

alter table public.inquiries
  add column if not exists phone text
  check (phone is null or char_length(phone) between 1 and 40);
