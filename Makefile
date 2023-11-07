gen-types:
	supabase gen types typescript --project-id $(SUPABASE_PROJECT_ID) > database.types.ts
link:
	supabase link --project-ref $(SUPABASE_PROJECT_ID)
db-pull:
	npx prisma db pull
db-generate:
	npx prisma generate
