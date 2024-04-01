Basehunt Dapp

## TODOs: Argentina

### ENV
- [ ] Make sure everyone can configure + build Locally
  - [ ] Amhed
  - [ ] Farid
  - [ ] Mike
- [ ] Create supabase instance
  - [ ] Run first schema script (migration?)
- [ ] Create Vercel instance
  - [ ] Update Vercel ENV variables
- [ ] Configure vercel.json
- [ ] Configure Prisma / CLI should allow performing migrations

### Basehunt Actions
- [ ] Define final list of features
- [ ] Change Branding (not Basehunt). Who's the correct DRI?
- [ ] Remove Guilds, not applicable to this first version
- [ ] Generate QR from Linkdrop that can both onboard a user and drop an NFT so they start counting towards basehunt points 

## Getting Started

1. Install dependencies

```sh
yarn install
```

Install Docker Desktop (https://www.docker.com/products/docker-desktop/)

2. Update ENV file. use `.env.sample.local` as starting point

3. If this is a brand new environment, connect to the Postgres instance and run the `supabase/schema.sql` script to generate all tables

