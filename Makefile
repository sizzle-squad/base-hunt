gen-types:
	supabase gen types typescript --project-id $(SUPABASE_PROJECT_ID) > database.types.ts


link:
	supabase link --project-ref $(SUPABASE_PROJECT_ID)
db-pull:
	supabase db pull
