
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

CREATE SCHEMA IF NOT EXISTS "public";

ALTER SCHEMA "public" OWNER TO "pg_database_owner";

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

CREATE TYPE "public"."challenge_status" AS ENUM (
    'NOT_STARTED',
    'IN_PROGRESS',
    'COMPLETE'
);

ALTER TYPE "public"."challenge_status" OWNER TO "postgres";

CREATE TYPE "public"."challenge_type" AS ENUM (
    'ERC_TRANSFER',
    'BALANCE_CHECK',
    'CONTRACT_INTERACTION',
    'TRIVIA',
    'SOCIAL',
    'EVENT_TYPE_TRANSFER_ERC1155',
    'EVENT_TYPE_TRANSFER_ERC20',
    'EVENT_TYPE_TRANSFER_ERC721',
    'EVENT_TYPE_CONTRACT_EXECUTION',
    'GUILD'
);

ALTER TYPE "public"."challenge_type" OWNER TO "postgres";

CREATE TYPE "public"."check_function_type" AS ENUM (
    'checkMint',
    'checkTrivia',
    'checkFunctionExecution',
    'checkBalance',
    'checkTokenIdBalance',
    'checkTxCountBatch',
    'checkJoinGuild'
);

ALTER TYPE "public"."check_function_type" OWNER TO "postgres";

CREATE TYPE "public"."networks" AS ENUM (
    'networks/base-mainnet',
    'networks/eth-mainnet'
);

ALTER TYPE "public"."networks" OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."claimed_boost_insert"() RETURNS trigger
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

CREATE OR REPLACE FUNCTION "public"."getbadgestate"(_game_id bigint, _user_address text) RETURNS TABLE(j json)
    LANGUAGE "plpgsql"
    AS $$
declare 

begin
 RETURN QUERY select to_json(temp) from (select b.id,b.name,b.image_url,b.contract_address,b.token_id,b.cta_url,b.cta_text,b.type,b.lat_lng,b.description,b.artist_name,w.to_address,w.transaction_hash,w.created_at,w.event_type from badge_configuration as b LEFT join webhook_data as w
  on LOWER(b.contract_address) = LOWER(w.contract_address) and b.token_id::bigint = w.value and LOWER(w.from_address) = LOWER(b.minter)
  and w.to_address ILIKE _user_address where b.game_id = _game_id) as temp;
end; 
$$;

ALTER FUNCTION "public"."getbadgestate"(_game_id bigint, _user_address text) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."getlevelstate"(_game_id bigint, _user_address text) RETURNS TABLE(j json)
    LANGUAGE "plpgsql"
    AS $$
declare 

begin
 RETURN QUERY select to_json(temp) from (select * from level_configuration as  l LEFT join level_data as d
  on LOWER(l.contract_address) = LOWER(d.contract_address) and l.token_id::bigint = d.value and LOWER(l.minter) = LOWER(d.from_address)  
  and d.to_address = LOWER(_user_address) where l.game_id = _game_id order by l.level ASC ) as temp;
end; 
$$;

ALTER FUNCTION "public"."getlevelstate"(_game_id bigint, _user_address text) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."getscorerank"(_game_id bigint, _user_address text) RETURNS TABLE(j json)
    LANGUAGE "plpgsql"
    AS $$
declare 

begin
 RETURN QUERY  select to_json(temp.*) from (select rank() over (order by current_score desc, updated_at asc) as rank, 
    user_address as user_address, current_score from score where game_id = _game_id ) as temp where temp.user_address ilike _user_address;
end; 
$$;

ALTER FUNCTION "public"."getscorerank"(_game_id bigint, _user_address text) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."getuserrank"(_game_id bigint, _user_address text) RETURNS TABLE(j json)
    LANGUAGE "plpgsql"
    AS $$
declare 

begin
 RETURN QUERY select to_json(temp.*) from (select rank() over (order by total_hitpoints desc, updated_at asc) as rank, 
    user_address as user_address from treasure_box_entries where game_id = _game_id) as temp where user_address ILIKE _user_address;
end; 
$$;

ALTER FUNCTION "public"."getuserrank"(_game_id bigint, _user_address text) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."guildmembercount"(_game_id bigint) RETURNS TABLE(guild text, count bigint)
    LANGUAGE "plpgsql"
    AS $$
declare 
begin

return query select guild_id::text as guild,count(*) from guild_member_configuration where game_id=_game_id group by guild_id; 
end; 
$$;

ALTER FUNCTION "public"."guildmembercount"(_game_id bigint) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."guilduserclaim"(_game_id bigint, _user_address text) RETURNS boolean
    LANGUAGE "plpgsql"
    AS $$
declare 
  _score bigint:=0;
begin

CREATE TEMP TABLE _claims AS select _game_id as game_id, gmc.guild_id as guild_id, _user_address as user_address, gw.claim_id as claim_id,gw.points as score 
from 
guild_win as gw 
join guild_member_configuration as gmc on gw.guild_id = gmc.guild_id and gw.game_id = gmc.game_id 
left join guild_user_claim as guc on guc.game_id = gw.game_id and guc.guild_id = gw.guild_id and gw.claim_id = guc.claim_id and gmc.user_address = guc.user_address
where gmc.user_address = _user_address and gmc.game_id = _game_id and gmc.created_at < gw.to and guc.id is null ;
select SUM(score) into _score from _claims;
IF _score >0 then
  insert into guild_user_claim(game_id,guild_id,user_address,claim_id) select game_id,guild_id,user_address,claim_id from _claims;

  UPDATE score set current_score = score.current_score + _score where game_id = _game_id and user_address =_user_address;
  IF NOT FOUND then
    INSERT INTO score(game_id,user_address,current_score) VALUES(_game_id,_user_address,_score);
  end if;
end if;
DROP TABLE _claims;
return TRUE;
 
end; 
$$;

ALTER FUNCTION "public"."guilduserclaim"(_game_id bigint, _user_address text) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."guildwinshares"(_game_id bigint) RETURNS TABLE(guild text, count bigint)
    LANGUAGE "plpgsql"
    AS $$
declare 
begin

return query select guild_id as guild, count(*) from guild_win where game_id = _game_id group by guild_id;

 
end; 
$$;

ALTER FUNCTION "public"."guildwinshares"(_game_id bigint) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."incrementuserscore"(_game_id bigint, _user_address text, _score bigint) RETURNS boolean
    LANGUAGE "plpgsql"
    AS $$
declare 
begin
  UPDATE score set current_score = score.current_score + _score where game_id = _game_id and user_address =_user_address;
  IF NOT FOUND then
    INSERT INTO score(game_id,user_address,current_score) VALUES(_game_id,_user_address,_score);
  end if;
  return TRUE;
end; 
$$;

ALTER FUNCTION "public"."incrementuserscore"(_game_id bigint, _user_address text, _score bigint) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."upserttreasurebox"(_game_id bigint, _user_address text, _cbid text, _ens_name text, _increment bigint, _tap_count integer) RETURNS TABLE(j json)
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

ALTER FUNCTION "public"."upserttreasurebox"(_game_id bigint, _user_address text, _cbid text, _ens_name text, _increment bigint, _tap_count integer) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."user_challenge_status_insert"() RETURNS trigger
    LANGUAGE "plpgsql"
    AS $$ 
    DECLARE      
    BEGIN 
        UPDATE score SET current_score = score.current_score + NEW.points, updated_at = NOW()  WHERE user_address = NEW.user_address and game_id = NEW.game_id; 
        IF NOT FOUND THEN 
        INSERT INTO score(current_score,user_address,game_id) values (NEW.points, NEW.user_address, NEW.game_id); 
        END IF;         
        RETURN NEW;
    END; 
    $$;

ALTER FUNCTION "public"."user_challenge_status_insert"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."user_claim_guild_score"(_game_id bigint, _user_address text) RETURNS boolean
    LANGUAGE "plpgsql"
    AS $$
declare 
  _sum_points bigint = 0;
begin
 with cte as (UPDATE user_guild_score_claim set is_claimed = true where game_id=_game_id and user_address=_user_address and is_claimed is false returning points)
 select sum(cte.points) into _sum_points from cte;
 IF _sum_points IS null THEN
  RETURN FALSE;
 END IF;
 UPDATE score set current_score = score.current_score+_sum_points  
  where game_id=_game_id and user_address=_user_address;
 IF NOT FOUND THEN 
  INSERT INTO score(current_score,user_address,game_id) values (_sum_points, _user_address, _game_id); 
  END IF;  
  RETURN TRUE;
end; 
$$;

ALTER FUNCTION "public"."user_claim_guild_score"(_game_id bigint, _user_address text) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."webhook_data_update"() RETURNS trigger
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
    "created_at" timestamp with time zone DEFAULT now() NOT NULL,
    "game_id" bigint,
    "address" text
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
    "minter" text NOT NULL,
    "image_url" text,
    "game_id" bigint DEFAULT '0'::bigint NOT NULL,
    "cta_url" text,
    "cta_text" text,
    "type" public.badge_type DEFAULT 'irl'::public.badge_type NOT NULL,
    "lat_lng" text,
    "description" text,
    "artist_name" text
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
    "boost_type" public.boost_type DEFAULT 'NFT'::public.boost_type NOT NULL,
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
    "icon" public.boost_icon DEFAULT 'CIRCLE'::public.boost_icon NOT NULL,
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

CREATE TABLE IF NOT EXISTS "public"."challenge_configuration" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT now() NOT NULL,
    "display_name" text NOT NULL,
    "auto_claim" boolean DEFAULT false,
    "params" jsonb,
    "contract_address" text,
    "points" bigint NOT NULL,
    "is_enabled" boolean NOT NULL,
    "game_id" bigint,
    "type" public.challenge_type NOT NULL,
    "network" public.networks,
    "function_type" public.check_function_type,
    "is_dynamic_points" boolean DEFAULT false NOT NULL,
    "content_data" jsonb DEFAULT '{}'::jsonb,
    "start_timestamp" timestamp with time zone,
    "end_timestamp" timestamp with time zone
);

ALTER TABLE "public"."challenge_configuration" OWNER TO "postgres";

ALTER TABLE "public"."challenge_configuration" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."challenge_configuration_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."claimed_boost" (
    "id" bigint NOT NULL,
    "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
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

CREATE TABLE IF NOT EXISTS "public"."guild_configuration" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT now() NOT NULL,
    "guild_id" text NOT NULL,
    "game_id" bigint NOT NULL,
    "name" text NOT NULL,
    "total_member_count" bigint,
    "leader" text NOT NULL,
    "image_url" text
);

ALTER TABLE "public"."guild_configuration" OWNER TO "postgres";

ALTER TABLE "public"."guild_configuration" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."guild_configuration_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."guild_member_configuration" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT now() NOT NULL,
    "user_address" character varying NOT NULL,
    "game_id" bigint,
    "guild_id" character varying NOT NULL
);

ALTER TABLE "public"."guild_member_configuration" OWNER TO "postgres";

ALTER TABLE "public"."guild_member_configuration" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."guild_member_configuration_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."guild_score" (
    "id" bigint NOT NULL,
    "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
    "guild_id" text,
    "game_id" bigint,
    "score" bigint,
    "timestamp" timestamp with time zone DEFAULT now() NOT NULL
);

ALTER TABLE "public"."guild_score" OWNER TO "postgres";

ALTER TABLE "public"."guild_score" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."guild_score_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."guild_user_claim" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT now() NOT NULL,
    "game_id" bigint NOT NULL,
    "guild_id" text NOT NULL,
    "claim_id" bigint NOT NULL,
    "user_address" text NOT NULL
);

ALTER TABLE "public"."guild_user_claim" OWNER TO "postgres";

ALTER TABLE "public"."guild_user_claim" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."guild_user_claim_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."guild_win" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT now() NOT NULL,
    "guild_id" text NOT NULL,
    "claim_id" bigint NOT NULL,
    "from" timestamp with time zone NOT NULL,
    "to" timestamp with time zone NOT NULL,
    "game_id" bigint NOT NULL,
    "score" bigint NOT NULL,
    "points" bigint DEFAULT '0'::bigint NOT NULL
);

ALTER TABLE "public"."guild_win" OWNER TO "postgres";

ALTER TABLE "public"."guild_win" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."guild_win_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."level_configuration" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT now() NOT NULL,
    "game_id" bigint NOT NULL,
    "name" text NOT NULL,
    "threshold_points" bigint NOT NULL,
    "airdrop_command" text NOT NULL,
    "level" text DEFAULT ''::text,
    "contract_address" text,
    "minter" text,
    "image_url" text,
    "badge_type" public.badge_type DEFAULT 'level'::public.badge_type NOT NULL,
    "token_id" bigint,
    "description" text,
    "cta_url" text,
    "prize_image_url" text,
    "prize_description" text
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
    "created_at" timestamp with time zone DEFAULT now() NOT NULL,
    "network_id" character varying NOT NULL,
    "block_hash" text,
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
    "user_address" text NOT NULL,
    "current_score" bigint DEFAULT '0'::bigint NOT NULL,
    "updated_at" timestamp without time zone DEFAULT now() NOT NULL
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
    "created_at" timestamp with time zone DEFAULT now() NOT NULL,
    "total_hitpoints" bigint NOT NULL,
    "game_id" bigint NOT NULL,
    "name" text NOT NULL,
    "location" text,
    "cta_url" text,
    "image_url" text
);

ALTER TABLE "public"."treasure_box_configuration" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."treasure_box_entries" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT now() NOT NULL,
    "user_address" text NOT NULL,
    "total_hitpoints" bigint NOT NULL,
    "cbid" text,
    "game_id" bigint NOT NULL,
    "ens_name" text,
    "tap_count" integer DEFAULT 0 NOT NULL,
    "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

ALTER TABLE "public"."treasure_box_entries" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."treasure_box_state" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT now() NOT NULL,
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

CREATE TABLE IF NOT EXISTS "public"."user_address_opt_in" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT now() NOT NULL,
    "game_id" bigint NOT NULL,
    "user_address" text NOT NULL
);

ALTER TABLE "public"."user_address_opt_in" OWNER TO "postgres";

ALTER TABLE "public"."user_address_opt_in" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."user_address_opt_in_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."user_challenge_status" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT now() NOT NULL,
    "user_address" text NOT NULL,
    "challenge_id" bigint NOT NULL,
    "status" public.challenge_status DEFAULT 'NOT_STARTED'::public.challenge_status NOT NULL,
    "points" bigint DEFAULT '0'::bigint NOT NULL,
    "game_id" bigint DEFAULT '0'::bigint NOT NULL
);

ALTER TABLE "public"."user_challenge_status" OWNER TO "postgres";

ALTER TABLE "public"."user_challenge_status" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."user_challenge_status_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."user_guild_score_claim" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT now() NOT NULL,
    "points" bigint DEFAULT '0'::bigint NOT NULL,
    "is_claimed" boolean DEFAULT false NOT NULL,
    "claim_id" bigint DEFAULT '0'::bigint NOT NULL,
    "game_id" bigint DEFAULT '0'::bigint NOT NULL,
    "user_address" text NOT NULL,
    "guild_id" text NOT NULL
);

ALTER TABLE "public"."user_guild_score_claim" OWNER TO "postgres";

ALTER TABLE "public"."user_guild_score_claim" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."user_guild_score_claim_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."user_txcount" (
    "created_at" timestamp with time zone DEFAULT now() NOT NULL,
    "user_address" text NOT NULL,
    "tx_count" bigint DEFAULT '0'::bigint,
    "network" public.networks DEFAULT 'networks/base-mainnet'::public.networks NOT NULL
);

ALTER TABLE "public"."user_txcount" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."webhook_data" (
    "transaction_hash" character varying NOT NULL,
    "created_at" timestamp with time zone DEFAULT now() NOT NULL,
    "network_id" character varying NOT NULL,
    "block_hash" text,
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

ALTER TABLE ONLY "public"."challenge_configuration"
    ADD CONSTRAINT "challenge_configuration_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."claimed_boost"
    ADD CONSTRAINT "claimed_boost_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."guild_configuration"
    ADD CONSTRAINT "guild_configuration_guild_id_key" UNIQUE ("guild_id");

ALTER TABLE ONLY "public"."guild_configuration"
    ADD CONSTRAINT "guild_configuration_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."guild_member_configuration"
    ADD CONSTRAINT "guild_member_configuration_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."guild_member_configuration"
    ADD CONSTRAINT "guild_member_configuration_user_address_key" UNIQUE ("user_address");

ALTER TABLE ONLY "public"."guild_score"
    ADD CONSTRAINT "guild_score_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."guild_user_claim"
    ADD CONSTRAINT "guild_user_claim_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."guild_win"
    ADD CONSTRAINT "guild_win_pkey" PRIMARY KEY ("id");

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

ALTER TABLE ONLY "public"."user_address_opt_in"
    ADD CONSTRAINT "user_address_opt_in_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."user_challenge_status"
    ADD CONSTRAINT "user_challenge_status_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."user_guild_score_claim"
    ADD CONSTRAINT "user_guild_score_claim_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."user_txcount"
    ADD CONSTRAINT "user_txcount_pkey" PRIMARY KEY ("user_address", "network");

ALTER TABLE ONLY "public"."webhook_data"
    ADD CONSTRAINT "webhook_data_pkey" PRIMARY KEY ("id");

CREATE UNIQUE INDEX address_gameid_unique_key ON public.address_gameid_configuration USING btree (game_id, address);

CREATE INDEX claimed_boost_boost_id_user_address_idx ON public.claimed_boost USING btree (boost_id, user_address);

CREATE UNIQUE INDEX claimed_boost_unique ON public.claimed_boost USING btree (user_address, boost_id, game_id);

CREATE INDEX guild_member_configuration_game_id_guild_id_idx ON public.guild_member_configuration USING btree (game_id, guild_id);

CREATE UNIQUE INDEX guild_member_configuration_game_id_user_address_idx ON public.guild_member_configuration USING btree (game_id, user_address);

CREATE UNIQUE INDEX guild_user_claim_game_id_claim_id_user_address_idx ON public.guild_user_claim USING btree (game_id, claim_id, user_address);

CREATE UNIQUE INDEX guild_win_game_id_claim_id_idx ON public.guild_win USING btree (game_id, claim_id);

CREATE UNIQUE INDEX level_data_contract_address_to_address_value_idx ON public.level_data USING btree (contract_address, to_address, value);

CREATE INDEX level_data_to_address_idx ON public.level_data USING btree (to_address);

CREATE UNIQUE INDEX score_unique ON public.score USING btree (user_address, game_id);

CREATE UNIQUE INDEX treasure_box_entries_unique ON public.treasure_box_entries USING btree (user_address, game_id);

CREATE UNIQUE INDEX treasure_box_state_unique ON public.treasure_box_state USING btree (game_id);

CREATE UNIQUE INDEX user_challenge_status_game_id_user_address_challenge_id_idx ON public.user_challenge_status USING btree (game_id, user_address, challenge_id);

CREATE UNIQUE INDEX user_guild_score_claim_game_id_guild_id_user_address_claim__idx ON public.user_guild_score_claim USING btree (game_id, guild_id, user_address, claim_id);

CREATE INDEX webhook_data_to_address_idx ON public.webhook_data USING btree (to_address);

CREATE UNIQUE INDEX webhook_data_unique ON public.webhook_data USING btree (contract_address, to_address, value);

CREATE TRIGGER claimed_boost_insert_trigger AFTER INSERT ON public.claimed_boost FOR EACH ROW EXECUTE FUNCTION public.claimed_boost_insert();

ALTER TABLE "public"."claimed_boost" DISABLE TRIGGER "claimed_boost_insert_trigger";

CREATE OR REPLACE TRIGGER "score update => /api/webhook/airdrop" AFTER INSERT OR UPDATE ON public.score FOR EACH ROW EXECUTE FUNCTION supabase_functions.http_request('https://base-hunt-eth-denver-2024.vercel.app/api/webhook/airdrop', 'POST', '{"Content-type":"application/json","x-api-secret":"8DF49982CBF3C3D28696B63975253"}', '{}', '3986');

CREATE TRIGGER user_challenge_status_trigger BEFORE INSERT ON public.user_challenge_status FOR EACH ROW EXECUTE FUNCTION public.user_challenge_status_insert();

CREATE TRIGGER webhook_data_update_trigger BEFORE INSERT ON public.webhook_data FOR EACH ROW EXECUTE FUNCTION public.webhook_data_update();

ALTER TABLE "public"."webhook_data" DISABLE TRIGGER "webhook_data_update_trigger";

ALTER TABLE ONLY "public"."claimed_boost"
    ADD CONSTRAINT "claimed_boost_boost_id_fkey" FOREIGN KEY (boost_id) REFERENCES public.boost_configuration(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."user_challenge_status"
    ADD CONSTRAINT "user_challenge_status_challenge_id_fkey" FOREIGN KEY (challenge_id) REFERENCES public.challenge_configuration(id);

CREATE POLICY "Enable insert for authenticated users only" ON "public"."webhook_data" FOR INSERT TO authenticated WITH CHECK (true);

ALTER TABLE "public"."address_gameid_configuration" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."badge_configuration" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."boost_configuration" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."challenge_configuration" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."claimed_boost" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."guild_configuration" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."guild_member_configuration" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."guild_score" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."guild_user_claim" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."guild_win" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."level_configuration" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."level_data" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."score" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."treasure_box_configuration" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."treasure_box_entries" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."treasure_box_state" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."user_address_opt_in" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."user_challenge_status" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."user_guild_score_claim" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."user_txcount" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."webhook_data" ENABLE ROW LEVEL SECURITY;

GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

GRANT ALL ON FUNCTION "public"."claimed_boost_insert"() TO "anon";
GRANT ALL ON FUNCTION "public"."claimed_boost_insert"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."claimed_boost_insert"() TO "service_role";

GRANT ALL ON FUNCTION "public"."getbadgestate"(_game_id bigint, _user_address text) TO "anon";
GRANT ALL ON FUNCTION "public"."getbadgestate"(_game_id bigint, _user_address text) TO "authenticated";
GRANT ALL ON FUNCTION "public"."getbadgestate"(_game_id bigint, _user_address text) TO "service_role";

GRANT ALL ON FUNCTION "public"."getlevelstate"(_game_id bigint, _user_address text) TO "anon";
GRANT ALL ON FUNCTION "public"."getlevelstate"(_game_id bigint, _user_address text) TO "authenticated";
GRANT ALL ON FUNCTION "public"."getlevelstate"(_game_id bigint, _user_address text) TO "service_role";

GRANT ALL ON FUNCTION "public"."getscorerank"(_game_id bigint, _user_address text) TO "anon";
GRANT ALL ON FUNCTION "public"."getscorerank"(_game_id bigint, _user_address text) TO "authenticated";
GRANT ALL ON FUNCTION "public"."getscorerank"(_game_id bigint, _user_address text) TO "service_role";

GRANT ALL ON FUNCTION "public"."getuserrank"(_game_id bigint, _user_address text) TO "anon";
GRANT ALL ON FUNCTION "public"."getuserrank"(_game_id bigint, _user_address text) TO "authenticated";
GRANT ALL ON FUNCTION "public"."getuserrank"(_game_id bigint, _user_address text) TO "service_role";

GRANT ALL ON FUNCTION "public"."guildmembercount"(_game_id bigint) TO "anon";
GRANT ALL ON FUNCTION "public"."guildmembercount"(_game_id bigint) TO "authenticated";
GRANT ALL ON FUNCTION "public"."guildmembercount"(_game_id bigint) TO "service_role";

GRANT ALL ON FUNCTION "public"."guilduserclaim"(_game_id bigint, _user_address text) TO "anon";
GRANT ALL ON FUNCTION "public"."guilduserclaim"(_game_id bigint, _user_address text) TO "authenticated";
GRANT ALL ON FUNCTION "public"."guilduserclaim"(_game_id bigint, _user_address text) TO "service_role";

GRANT ALL ON FUNCTION "public"."guildwinshares"(_game_id bigint) TO "anon";
GRANT ALL ON FUNCTION "public"."guildwinshares"(_game_id bigint) TO "authenticated";
GRANT ALL ON FUNCTION "public"."guildwinshares"(_game_id bigint) TO "service_role";

GRANT ALL ON FUNCTION "public"."incrementuserscore"(_game_id bigint, _user_address text, _score bigint) TO "anon";
GRANT ALL ON FUNCTION "public"."incrementuserscore"(_game_id bigint, _user_address text, _score bigint) TO "authenticated";
GRANT ALL ON FUNCTION "public"."incrementuserscore"(_game_id bigint, _user_address text, _score bigint) TO "service_role";

GRANT ALL ON FUNCTION "public"."upserttreasurebox"(_game_id bigint, _user_address text, _cbid text, _ens_name text, _increment bigint, _tap_count integer) TO "anon";
GRANT ALL ON FUNCTION "public"."upserttreasurebox"(_game_id bigint, _user_address text, _cbid text, _ens_name text, _increment bigint, _tap_count integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."upserttreasurebox"(_game_id bigint, _user_address text, _cbid text, _ens_name text, _increment bigint, _tap_count integer) TO "service_role";

GRANT ALL ON FUNCTION "public"."user_challenge_status_insert"() TO "anon";
GRANT ALL ON FUNCTION "public"."user_challenge_status_insert"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."user_challenge_status_insert"() TO "service_role";

GRANT ALL ON FUNCTION "public"."user_claim_guild_score"(_game_id bigint, _user_address text) TO "anon";
GRANT ALL ON FUNCTION "public"."user_claim_guild_score"(_game_id bigint, _user_address text) TO "authenticated";
GRANT ALL ON FUNCTION "public"."user_claim_guild_score"(_game_id bigint, _user_address text) TO "service_role";

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

GRANT ALL ON TABLE "public"."challenge_configuration" TO "anon";
GRANT ALL ON TABLE "public"."challenge_configuration" TO "authenticated";
GRANT ALL ON TABLE "public"."challenge_configuration" TO "service_role";

GRANT ALL ON SEQUENCE "public"."challenge_configuration_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."challenge_configuration_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."challenge_configuration_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."claimed_boost" TO "anon";
GRANT ALL ON TABLE "public"."claimed_boost" TO "authenticated";
GRANT ALL ON TABLE "public"."claimed_boost" TO "service_role";

GRANT ALL ON SEQUENCE "public"."claimed_boost_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."claimed_boost_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."claimed_boost_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."guild_configuration" TO "anon";
GRANT ALL ON TABLE "public"."guild_configuration" TO "authenticated";
GRANT ALL ON TABLE "public"."guild_configuration" TO "service_role";

GRANT ALL ON SEQUENCE "public"."guild_configuration_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."guild_configuration_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."guild_configuration_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."guild_member_configuration" TO "anon";
GRANT ALL ON TABLE "public"."guild_member_configuration" TO "authenticated";
GRANT ALL ON TABLE "public"."guild_member_configuration" TO "service_role";

GRANT ALL ON SEQUENCE "public"."guild_member_configuration_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."guild_member_configuration_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."guild_member_configuration_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."guild_score" TO "anon";
GRANT ALL ON TABLE "public"."guild_score" TO "authenticated";
GRANT ALL ON TABLE "public"."guild_score" TO "service_role";

GRANT ALL ON SEQUENCE "public"."guild_score_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."guild_score_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."guild_score_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."guild_user_claim" TO "anon";
GRANT ALL ON TABLE "public"."guild_user_claim" TO "authenticated";
GRANT ALL ON TABLE "public"."guild_user_claim" TO "service_role";

GRANT ALL ON SEQUENCE "public"."guild_user_claim_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."guild_user_claim_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."guild_user_claim_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."guild_win" TO "anon";
GRANT ALL ON TABLE "public"."guild_win" TO "authenticated";
GRANT ALL ON TABLE "public"."guild_win" TO "service_role";

GRANT ALL ON SEQUENCE "public"."guild_win_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."guild_win_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."guild_win_id_seq" TO "service_role";

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

GRANT ALL ON TABLE "public"."user_address_opt_in" TO "anon";
GRANT ALL ON TABLE "public"."user_address_opt_in" TO "authenticated";
GRANT ALL ON TABLE "public"."user_address_opt_in" TO "service_role";

GRANT ALL ON SEQUENCE "public"."user_address_opt_in_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."user_address_opt_in_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."user_address_opt_in_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."user_challenge_status" TO "anon";
GRANT ALL ON TABLE "public"."user_challenge_status" TO "authenticated";
GRANT ALL ON TABLE "public"."user_challenge_status" TO "service_role";

GRANT ALL ON SEQUENCE "public"."user_challenge_status_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."user_challenge_status_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."user_challenge_status_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."user_guild_score_claim" TO "anon";
GRANT ALL ON TABLE "public"."user_guild_score_claim" TO "authenticated";
GRANT ALL ON TABLE "public"."user_guild_score_claim" TO "service_role";

GRANT ALL ON SEQUENCE "public"."user_guild_score_claim_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."user_guild_score_claim_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."user_guild_score_claim_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."user_txcount" TO "anon";
GRANT ALL ON TABLE "public"."user_txcount" TO "authenticated";
GRANT ALL ON TABLE "public"."user_txcount" TO "service_role";

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
