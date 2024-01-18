
SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

CREATE EXTENSION IF NOT EXISTS "pg_net" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";

CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";

CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";

CREATE TYPE "public"."badge_type" AS ENUM (
    'online',
    'irl',
    'level'
);

ALTER TYPE "public"."badge_type" OWNER TO "postgres";

CREATE TYPE "public"."boost_icon" AS ENUM (
    'WALLET',
    'COFFEE',
    'BAG',
    'GRID',
    'CIRCLE',
    'LINK',
    'USERS'
);

ALTER TYPE "public"."boost_icon" OWNER TO "postgres";

CREATE TYPE "public"."boost_type" AS ENUM (
    'TRANSFER_NFT',
    'NFT',
    'NFT_PER_MINT',
    'TOKEN',
    'DEFAULT',
    'TRANSACTION',
    'SOCIAL'
);

ALTER TYPE "public"."boost_type" OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."claimed_boost_insert"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$ 
    DECLARE 
    _points bigint;      
    BEGIN 
        SELECT points into _points from boost_configuration where id = NEW.boost_id;
        UPDATE score SET current_score = score.current_score + _points, updated_at = NOW()  WHERE user_address = NEW.user_address and game_id = NEW.game_id; 
        IF NOT FOUND THEN 
        INSERT INTO score(current_score,user_address,game_id) values (_points, NEW.user_address, NEW.game_id); 
        END IF; 
        UPDATE treasure_box_state SET current_hitpoints=treasure_box_state.current_hitpoints + _points where game_id= NEW.game_id; 
        RETURN NULL;
    END; 
    $$;

ALTER FUNCTION "public"."claimed_boost_insert"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."getbadgestate"("_game_id" bigint, "_user_address" "text") RETURNS TABLE("j" "json")
    LANGUAGE "plpgsql"
    AS $$
declare 

begin
 RETURN QUERY select to_json(temp) from (select b.id,b.name,b.image_url,b.contract_address,b.token_id,b.cta_url,b.cta_text,b.type,b.lat_lng,b.description,b.artist_name,w.to_address,w.transaction_hash,w.created_at,w.event_type from badge_configuration as b LEFT join webhook_data as w
  on LOWER(b.contract_address) = LOWER(w.contract_address) and b.token_id::bigint = w.value and LOWER(w.from_address) = LOWER(b.minter)
  and w.to_address ILIKE _user_address where b.game_id = _game_id) as temp;
end; 
$$;

ALTER FUNCTION "public"."getbadgestate"("_game_id" bigint, "_user_address" "text") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."getlevelstate"("_game_id" bigint, "_user_address" "text") RETURNS TABLE("j" "json")
    LANGUAGE "plpgsql"
    AS $$
declare 

begin
 RETURN QUERY select to_json(temp) from (select * from level_configuration as  l LEFT join level_data as d
  on LOWER(l.contract_address) = LOWER(d.contract_address) and l.token_id::bigint = d.value and LOWER(l.minter) = LOWER(d.from_address)  
  and d.to_address = LOWER(_user_address) where l.game_id = _game_id order by l.level ASC ) as temp;
end; 
$$;

ALTER FUNCTION "public"."getlevelstate"("_game_id" bigint, "_user_address" "text") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."getscorerank"("_game_id" bigint, "_user_address" "text") RETURNS TABLE("j" "json")
    LANGUAGE "plpgsql"
    AS $$
declare 

begin
 RETURN QUERY  select to_json(temp.*) from (select rank() over (order by current_score desc, updated_at asc) as rank, 
    user_address as user_address, current_score from score where game_id = _game_id ) as temp where temp.user_address ilike _user_address;
end; 
$$;

ALTER FUNCTION "public"."getscorerank"("_game_id" bigint, "_user_address" "text") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."getuserrank"("_game_id" bigint, "_user_address" "text") RETURNS TABLE("j" "json")
    LANGUAGE "plpgsql"
    AS $$
declare 

begin
 RETURN QUERY select to_json(temp.*) from (select rank() over (order by total_hitpoints desc, updated_at asc) as rank, 
    user_address as user_address from treasure_box_entries where game_id = _game_id) as temp where user_address ILIKE _user_address;
end; 
$$;

ALTER FUNCTION "public"."getuserrank"("_game_id" bigint, "_user_address" "text") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."upserttreasurebox"("_game_id" bigint, "_user_address" "text", "_cbid" "text", "_ens_name" "text", "_increment" bigint, "_tap_count" integer) RETURNS TABLE("j" "json")
    LANGUAGE "plpgsql"
    AS $$
declare 
 _is_open_ boolean:=false;
begin
SELECT (treasure_box_state.current_hitpoints+_increment) > treasure_box_configuration.total_hitpoints INTO _is_open_
    FROM treasure_box_state, treasure_box_configuration
    WHERE treasure_box_state.game_id = treasure_box_configuration.game_id;
   _is_open_ = COALESCE(_is_open_, FALSE);
 INSERT INTO treasure_box_entries (game_id,user_address, cbid, ens_name,total_hitpoints,tap_count) VALUES (_game_id,_user_address,_cbid,_ens_name,_increment,_tap_count)
ON CONFLICT (user_address,game_id) DO
UPDATE SET total_hitpoints=treasure_box_entries.total_hitpoints + _increment,
tap_count = treasure_box_entries.tap_count + _tap_count,
updated_at = NOW();
INSERT INTO treasure_box_state (current_hitpoints,game_id,is_open) VALUES (_increment,_game_id,_is_open_)
ON CONFLICT (game_id) DO
UPDATE SET current_hitpoints=treasure_box_state.current_hitpoints + _increment,
is_open = _is_open_ ;
end; 
$$;

ALTER FUNCTION "public"."upserttreasurebox"("_game_id" bigint, "_user_address" "text", "_cbid" "text", "_ens_name" "text", "_increment" bigint, "_tap_count" integer) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."webhook_data_update"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$ 
    
    DECLARE 
      _num_nfts BIGINT;
      _game_id BIGINT;
    BEGIN 
        --SELECT count(*)+1 into _num_nfts from webhook_data where to_address = NEW.to_address;
        select ag.game_id into _game_id from badge_configuration as b join address_gameid_configuration as ag on b.contract_address = ag.address 
        WHERE b.contract_address = NEW.contract_address and b.token_id::bigint = NEW.value and b.minter = NEW.from_address
        and b.type != 'level';
        IF FOUND THEN
          SELECT count(*)+1 into _num_nfts from webhook_data where to_address = NEW.to_address;
          INSERT into claimed_boost(boost_id,user_address,game_id)
          SELECT b.id as boost_id,NEW.to_address as user_address,_game_id as game_id
          FROM boost_configuration AS b
          LEFT JOIN claimed_boost AS c ON b.id = c.boost_id AND c.user_address = NEW.to_address
          WHERE b.boost_type = 'TRANSFER_NFT' 
          and b.game_id = _game_id
          AND c.boost_id IS NULL
          AND b.nft_amount <= _num_nfts 
          ON CONFLICT (boost_id,user_address,game_id)
          DO NOTHING;               
          RETURN NEW;
        END IF;
        RETURN NULL;
    END; 
    
    $$;

ALTER FUNCTION "public"."webhook_data_update"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";

CREATE TABLE IF NOT EXISTS "public"."address_gameid_configuration" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "game_id" bigint,
    "address" "text"
);

ALTER TABLE "public"."address_gameid_configuration" OWNER TO "postgres";

ALTER TABLE "public"."address_gameid_configuration" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."address_gameid_configuration_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."badge_configuration" (
    "id" bigint NOT NULL,
    "name" character varying NOT NULL,
    "contract_address" character varying NOT NULL,
    "token_id" bigint NOT NULL,
    "level" integer,
    "minter" "text" NOT NULL,
    "image_url" "text",
    "game_id" bigint DEFAULT '0'::bigint NOT NULL,
    "cta_url" "text",
    "cta_text" "text",
    "type" "public"."badge_type" DEFAULT 'irl'::"public"."badge_type" NOT NULL,
    "lat_lng" "text",
    "description" "text",
    "artist_name" "text"
);

ALTER TABLE "public"."badge_configuration" OWNER TO "postgres";

ALTER TABLE "public"."badge_configuration" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."badge_configuration_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."boost_configuration" (
    "id" bigint NOT NULL,
    "name" character varying NOT NULL,
    "contract_addresses" character varying[] NOT NULL,
    "refresh_time" time without time zone,
    "image_url" character varying,
    "game_id" bigint DEFAULT '0'::bigint NOT NULL,
    "cta_url" character varying,
    "cta_text" character varying,
    "boost_type" "public"."boost_type" DEFAULT 'NFT'::"public"."boost_type" NOT NULL,
    "is_enabled" boolean DEFAULT true NOT NULL,
    "points" bigint DEFAULT '0'::bigint NOT NULL,
    "nft_amount" bigint,
    "available_time" timestamp without time zone,
    "transaction_to" character varying,
    "transaction_from" character varying,
    "transaction_value_threshold" bigint,
    "network" character varying DEFAULT 'base-mainnet'::character varying NOT NULL,
    "max_threshold" bigint DEFAULT '0'::bigint,
    "description" character varying DEFAULT '""'::character varying NOT NULL,
    "icon" "public"."boost_icon" DEFAULT 'CIRCLE'::"public"."boost_icon" NOT NULL,
    "cta_button_text" character varying
);

ALTER TABLE "public"."boost_configuration" OWNER TO "postgres";

ALTER TABLE "public"."boost_configuration" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."boost_configuration_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."claimed_boost" (
    "id" bigint NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "user_address" character varying NOT NULL,
    "boost_id" bigint NOT NULL,
    "game_id" bigint NOT NULL,
    "contract_address" character varying,
    "transaction_hash" character varying
);

ALTER TABLE "public"."claimed_boost" OWNER TO "postgres";

ALTER TABLE "public"."claimed_boost" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."claimed_boost_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."level_configuration" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "game_id" bigint NOT NULL,
    "name" "text" NOT NULL,
    "threshold_points" bigint NOT NULL,
    "airdrop_command" "text" NOT NULL,
    "level" "text" DEFAULT ''::"text",
    "contract_address" "text",
    "minter" "text",
    "image_url" "text",
    "badge_type" "public"."badge_type" DEFAULT 'level'::"public"."badge_type" NOT NULL,
    "token_id" bigint,
    "description" "text",
    "cta_url" "text"
);

ALTER TABLE "public"."level_configuration" OWNER TO "postgres";

ALTER TABLE "public"."level_configuration" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."level_configuration_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."level_data" (
    "transaction_hash" character varying NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "network_id" character varying NOT NULL,
    "block_hash" "text",
    "block_timestamp" character varying,
    "event_type" character varying,
    "from_address" character varying,
    "to_address" character varying,
    "value" bigint,
    "contract_address" character varying,
    "log_index" character varying DEFAULT ''::character varying,
    "is_from_address_cbw" boolean DEFAULT false,
    "is_to_address_cbw" boolean DEFAULT false,
    "id" bigint NOT NULL
);

ALTER TABLE "public"."level_data" OWNER TO "postgres";

ALTER TABLE "public"."level_data" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."level_data_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."score" (
    "id" bigint NOT NULL,
    "game_id" bigint NOT NULL,
    "user_address" "text" NOT NULL,
    "current_score" bigint DEFAULT '0'::bigint NOT NULL,
    "updated_at" timestamp without time zone DEFAULT "now"() NOT NULL
);

ALTER TABLE "public"."score" OWNER TO "postgres";

ALTER TABLE "public"."score" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."score_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."treasure_box_configuration" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "total_hitpoints" bigint NOT NULL,
    "game_id" bigint NOT NULL,
    "name" "text" NOT NULL,
    "location" "text",
    "cta_url" "text",
    "image_url" "text"
);

ALTER TABLE "public"."treasure_box_configuration" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."treasure_box_entries" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "user_address" "text" NOT NULL,
    "total_hitpoints" bigint NOT NULL,
    "cbid" "text",
    "game_id" bigint NOT NULL,
    "ens_name" "text",
    "tap_count" integer DEFAULT 0 NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);

ALTER TABLE "public"."treasure_box_entries" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."treasure_box_state" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "current_hitpoints" bigint NOT NULL,
    "is_open" boolean DEFAULT false NOT NULL,
    "game_id" bigint
);

ALTER TABLE "public"."treasure_box_state" OWNER TO "postgres";

ALTER TABLE "public"."treasure_box_state" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."treasure_box_state_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

ALTER TABLE "public"."treasure_box_entries" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."treasurebox_attacks_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

ALTER TABLE "public"."treasure_box_configuration" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."treasurebox_configuration_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."webhook_data" (
    "transaction_hash" character varying NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "network_id" character varying NOT NULL,
    "block_hash" "text",
    "block_timestamp" character varying,
    "event_type" character varying,
    "from_address" character varying,
    "to_address" character varying,
    "value" bigint,
    "contract_address" character varying,
    "log_index" character varying DEFAULT ''::character varying,
    "is_from_address_cbw" boolean DEFAULT false,
    "is_to_address_cbw" boolean DEFAULT false,
    "id" bigint NOT NULL
);

ALTER TABLE "public"."webhook_data" OWNER TO "postgres";

ALTER TABLE "public"."webhook_data" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."webhook_data_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

ALTER TABLE ONLY "public"."address_gameid_configuration"
    ADD CONSTRAINT "address_gameid_configuration_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."badge_configuration"
    ADD CONSTRAINT "badge_configuration_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."boost_configuration"
    ADD CONSTRAINT "boost_configuration_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."claimed_boost"
    ADD CONSTRAINT "claimed_boost_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."level_configuration"
    ADD CONSTRAINT "level_configuration_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."level_data"
    ADD CONSTRAINT "level_data_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."score"
    ADD CONSTRAINT "score_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."treasure_box_state"
    ADD CONSTRAINT "treasure_box_state_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."treasure_box_entries"
    ADD CONSTRAINT "treasurebox_attacks_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."treasure_box_configuration"
    ADD CONSTRAINT "treasurebox_configuration_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."webhook_data"
    ADD CONSTRAINT "webhook_data_pkey" PRIMARY KEY ("id");

CREATE UNIQUE INDEX "address_gameid_unique_key" ON "public"."address_gameid_configuration" USING "btree" ("game_id", "address");

CREATE INDEX "claimed_boost_boost_id_user_address_idx" ON "public"."claimed_boost" USING "btree" ("boost_id", "user_address");

CREATE UNIQUE INDEX "claimed_boost_unique" ON "public"."claimed_boost" USING "btree" ("user_address", "boost_id", "game_id");

CREATE UNIQUE INDEX "level_data_contract_address_to_address_value_idx" ON "public"."level_data" USING "btree" ("contract_address", "to_address", "value");

CREATE INDEX "level_data_to_address_idx" ON "public"."level_data" USING "btree" ("to_address");

CREATE UNIQUE INDEX "score_unique" ON "public"."score" USING "btree" ("user_address", "game_id");

CREATE UNIQUE INDEX "treasure_box_entries_unique" ON "public"."treasure_box_entries" USING "btree" ("user_address", "game_id");

CREATE UNIQUE INDEX "treasure_box_state_unique" ON "public"."treasure_box_state" USING "btree" ("game_id");

CREATE INDEX "webhook_data_to_address_idx" ON "public"."webhook_data" USING "btree" ("to_address");

CREATE UNIQUE INDEX "webhook_data_unique" ON "public"."webhook_data" USING "btree" ("contract_address", "to_address", "value");

CREATE OR REPLACE TRIGGER "claimed_boost_insert_trigger" AFTER INSERT ON "public"."claimed_boost" FOR EACH ROW EXECUTE FUNCTION "public"."claimed_boost_insert"();

CREATE OR REPLACE TRIGGER "score update => /api/webhook/airdrop" AFTER INSERT OR UPDATE ON "public"."score" FOR EACH ROW EXECUTE FUNCTION "supabase_functions"."http_request"('https://base-hunt-eth-denver-2024.vercel.app/api/webhook/airdrop', 'POST', '{"Content-type":"application/json","x-api-secret":"8DF49982CBF3C3D28696B63975253"}', '{}', '3986');

CREATE OR REPLACE TRIGGER "webhook_data_update_trigger" BEFORE INSERT ON "public"."webhook_data" FOR EACH ROW EXECUTE FUNCTION "public"."webhook_data_update"();

ALTER TABLE ONLY "public"."claimed_boost"
    ADD CONSTRAINT "claimed_boost_boost_id_fkey" FOREIGN KEY ("boost_id") REFERENCES "public"."boost_configuration"("id") ON UPDATE CASCADE ON DELETE CASCADE;

CREATE POLICY "Enable insert for authenticated users only" ON "public"."webhook_data" FOR INSERT TO "authenticated" WITH CHECK (true);

ALTER TABLE "public"."address_gameid_configuration" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."badge_configuration" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."boost_configuration" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."claimed_boost" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."level_configuration" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."level_data" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."score" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."treasure_box_configuration" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."treasure_box_entries" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."treasure_box_state" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."webhook_data" ENABLE ROW LEVEL SECURITY;

GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

GRANT ALL ON FUNCTION "public"."claimed_boost_insert"() TO "anon";
GRANT ALL ON FUNCTION "public"."claimed_boost_insert"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."claimed_boost_insert"() TO "service_role";

GRANT ALL ON FUNCTION "public"."getbadgestate"("_game_id" bigint, "_user_address" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."getbadgestate"("_game_id" bigint, "_user_address" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."getbadgestate"("_game_id" bigint, "_user_address" "text") TO "service_role";

GRANT ALL ON FUNCTION "public"."getlevelstate"("_game_id" bigint, "_user_address" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."getlevelstate"("_game_id" bigint, "_user_address" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."getlevelstate"("_game_id" bigint, "_user_address" "text") TO "service_role";

GRANT ALL ON FUNCTION "public"."getscorerank"("_game_id" bigint, "_user_address" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."getscorerank"("_game_id" bigint, "_user_address" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."getscorerank"("_game_id" bigint, "_user_address" "text") TO "service_role";

GRANT ALL ON FUNCTION "public"."getuserrank"("_game_id" bigint, "_user_address" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."getuserrank"("_game_id" bigint, "_user_address" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."getuserrank"("_game_id" bigint, "_user_address" "text") TO "service_role";

GRANT ALL ON FUNCTION "public"."upserttreasurebox"("_game_id" bigint, "_user_address" "text", "_cbid" "text", "_ens_name" "text", "_increment" bigint, "_tap_count" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."upserttreasurebox"("_game_id" bigint, "_user_address" "text", "_cbid" "text", "_ens_name" "text", "_increment" bigint, "_tap_count" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."upserttreasurebox"("_game_id" bigint, "_user_address" "text", "_cbid" "text", "_ens_name" "text", "_increment" bigint, "_tap_count" integer) TO "service_role";

GRANT ALL ON FUNCTION "public"."webhook_data_update"() TO "anon";
GRANT ALL ON FUNCTION "public"."webhook_data_update"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."webhook_data_update"() TO "service_role";

GRANT ALL ON TABLE "public"."address_gameid_configuration" TO "anon";
GRANT ALL ON TABLE "public"."address_gameid_configuration" TO "authenticated";
GRANT ALL ON TABLE "public"."address_gameid_configuration" TO "service_role";

GRANT ALL ON SEQUENCE "public"."address_gameid_configuration_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."address_gameid_configuration_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."address_gameid_configuration_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."badge_configuration" TO "anon";
GRANT ALL ON TABLE "public"."badge_configuration" TO "authenticated";
GRANT ALL ON TABLE "public"."badge_configuration" TO "service_role";

GRANT ALL ON SEQUENCE "public"."badge_configuration_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."badge_configuration_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."badge_configuration_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."boost_configuration" TO "anon";
GRANT ALL ON TABLE "public"."boost_configuration" TO "authenticated";
GRANT ALL ON TABLE "public"."boost_configuration" TO "service_role";

GRANT ALL ON SEQUENCE "public"."boost_configuration_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."boost_configuration_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."boost_configuration_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."claimed_boost" TO "anon";
GRANT ALL ON TABLE "public"."claimed_boost" TO "authenticated";
GRANT ALL ON TABLE "public"."claimed_boost" TO "service_role";

GRANT ALL ON SEQUENCE "public"."claimed_boost_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."claimed_boost_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."claimed_boost_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."level_configuration" TO "anon";
GRANT ALL ON TABLE "public"."level_configuration" TO "authenticated";
GRANT ALL ON TABLE "public"."level_configuration" TO "service_role";

GRANT ALL ON SEQUENCE "public"."level_configuration_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."level_configuration_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."level_configuration_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."level_data" TO "anon";
GRANT ALL ON TABLE "public"."level_data" TO "authenticated";
GRANT ALL ON TABLE "public"."level_data" TO "service_role";

GRANT ALL ON SEQUENCE "public"."level_data_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."level_data_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."level_data_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."score" TO "anon";
GRANT ALL ON TABLE "public"."score" TO "authenticated";
GRANT ALL ON TABLE "public"."score" TO "service_role";

GRANT ALL ON SEQUENCE "public"."score_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."score_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."score_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."treasure_box_configuration" TO "anon";
GRANT ALL ON TABLE "public"."treasure_box_configuration" TO "authenticated";
GRANT ALL ON TABLE "public"."treasure_box_configuration" TO "service_role";

GRANT ALL ON TABLE "public"."treasure_box_entries" TO "anon";
GRANT ALL ON TABLE "public"."treasure_box_entries" TO "authenticated";
GRANT ALL ON TABLE "public"."treasure_box_entries" TO "service_role";

GRANT ALL ON TABLE "public"."treasure_box_state" TO "anon";
GRANT ALL ON TABLE "public"."treasure_box_state" TO "authenticated";
GRANT ALL ON TABLE "public"."treasure_box_state" TO "service_role";

GRANT ALL ON SEQUENCE "public"."treasure_box_state_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."treasure_box_state_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."treasure_box_state_id_seq" TO "service_role";

GRANT ALL ON SEQUENCE "public"."treasurebox_attacks_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."treasurebox_attacks_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."treasurebox_attacks_id_seq" TO "service_role";

GRANT ALL ON SEQUENCE "public"."treasurebox_configuration_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."treasurebox_configuration_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."treasurebox_configuration_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."webhook_data" TO "anon";
GRANT ALL ON TABLE "public"."webhook_data" TO "authenticated";
GRANT ALL ON TABLE "public"."webhook_data" TO "service_role";

GRANT ALL ON SEQUENCE "public"."webhook_data_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."webhook_data_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."webhook_data_id_seq" TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";

RESET ALL;
