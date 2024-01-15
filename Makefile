gen-types:
	supabase gen types typescript --project-id $(SUPABASE_PROJECT_ID) > database.types.ts
link:
	supabase link --project-ref $(SUPABASE_PROJECT_ID)
remote-db-dump:
	supabase start
	supabase db dump -f supabase/schema.sql
	supabase db dump -f supabase/seed.sql --data-only
	supabase db dump -f supabase/roles.sql --role-only
