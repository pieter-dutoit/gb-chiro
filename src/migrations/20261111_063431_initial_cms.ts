import { databaseSchema } from '../cms-config/lib/environment'
import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE SCHEMA IF NOT EXISTS ${sql.identifier(databaseSchema())};
   CREATE TYPE ${sql.identifier(databaseSchema())}."enum_users_roles" AS ENUM('admin', 'editor');
  CREATE TYPE ${sql.identifier(databaseSchema())}."enum_services_status" AS ENUM('draft', 'published');
  CREATE TYPE ${sql.identifier(databaseSchema())}."enum__services_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE ${sql.identifier(databaseSchema())}."enum_new_patient_steps_status" AS ENUM('draft', 'published');
  CREATE TYPE ${sql.identifier(databaseSchema())}."enum__new_patient_steps_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE ${sql.identifier(databaseSchema())}."enum_articles_status" AS ENUM('draft', 'published');
  CREATE TYPE ${sql.identifier(databaseSchema())}."enum__articles_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE ${sql.identifier(databaseSchema())}."enum_social_media_platforms_name" AS ENUM('facebook', 'instagram', 'x', 'linkedin', 'youtube', 'tiktok', 'snapchat', 'reddit', 'threads', 'twitch', 'telegram', 'whatsapp', 'weChat');
  CREATE TYPE ${sql.identifier(databaseSchema())}."enum_social_media_platforms_status" AS ENUM('draft', 'published');
  CREATE TYPE ${sql.identifier(databaseSchema())}."enum__social_media_platforms_v_version_name" AS ENUM('facebook', 'instagram', 'x', 'linkedin', 'youtube', 'tiktok', 'snapchat', 'reddit', 'threads', 'twitch', 'telegram', 'whatsapp', 'weChat');
  CREATE TYPE ${sql.identifier(databaseSchema())}."enum__social_media_platforms_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE ${sql.identifier(databaseSchema())}."enum_reviews_platform" AS ENUM('Google', 'Facebook', 'HealthEngine', 'Whitecoat', 'Word of Mouth', 'HotDoc', 'Yelp');
  CREATE TYPE ${sql.identifier(databaseSchema())}."enum_reviews_status" AS ENUM('draft', 'published');
  CREATE TYPE ${sql.identifier(databaseSchema())}."enum__reviews_v_version_platform" AS ENUM('Google', 'Facebook', 'HealthEngine', 'Whitecoat', 'Word of Mouth', 'HotDoc', 'Yelp');
  CREATE TYPE ${sql.identifier(databaseSchema())}."enum__reviews_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE ${sql.identifier(databaseSchema())}."enum_business_details_address_state" AS ENUM('nsw', 'vic', 'qld', 'wa', 'sa', 'tas', 'act', 'nt');
  CREATE TYPE ${sql.identifier(databaseSchema())}."enum_business_details_status" AS ENUM('draft', 'published');
  CREATE TYPE ${sql.identifier(databaseSchema())}."enum__business_details_v_version_address_state" AS ENUM('nsw', 'vic', 'qld', 'wa', 'sa', 'tas', 'act', 'nt');
  CREATE TYPE ${sql.identifier(databaseSchema())}."enum__business_details_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE ${sql.identifier(databaseSchema())}."enum_graphics_status" AS ENUM('draft', 'published');
  CREATE TYPE ${sql.identifier(databaseSchema())}."enum__graphics_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE ${sql.identifier(databaseSchema())}."enum_home_page_status" AS ENUM('draft', 'published');
  CREATE TYPE ${sql.identifier(databaseSchema())}."enum__home_page_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE ${sql.identifier(databaseSchema())}."enum_about_us_page_status" AS ENUM('draft', 'published');
  CREATE TYPE ${sql.identifier(databaseSchema())}."enum__about_us_page_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE ${sql.identifier(databaseSchema())}."enum_treatment_and_care_page_status" AS ENUM('draft', 'published');
  CREATE TYPE ${sql.identifier(databaseSchema())}."enum__treatment_and_care_page_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE ${sql.identifier(databaseSchema())}."enum_what_to_expect_page_status" AS ENUM('draft', 'published');
  CREATE TYPE ${sql.identifier(databaseSchema())}."enum__what_to_expect_page_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE ${sql.identifier(databaseSchema())}."enum_contact_us_page_status" AS ENUM('draft', 'published');
  CREATE TYPE ${sql.identifier(databaseSchema())}."enum__contact_us_page_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE ${sql.identifier(databaseSchema())}."users_roles" (
    "order" integer NOT NULL,
    "parent_id" integer NOT NULL,
    "value" ${sql.identifier(databaseSchema())}."enum_users_roles",
    "id" serial PRIMARY KEY NOT NULL
  );

  CREATE TABLE ${sql.identifier(databaseSchema())}."users_sessions" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "created_at" timestamp(3) with time zone,
    "expires_at" timestamp(3) with time zone NOT NULL
  );

  CREATE TABLE ${sql.identifier(databaseSchema())}."users" (
    "id" serial PRIMARY KEY NOT NULL,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "email" varchar NOT NULL,
    "reset_password_token" varchar,
    "reset_password_expiration" timestamp(3) with time zone,
    "salt" varchar,
    "hash" varchar,
    "reset_password_requested_at" timestamp(3) with time zone,
    "login_attempts" numeric DEFAULT 0,
    "lock_until" timestamp(3) with time zone
  );

  CREATE TABLE ${sql.identifier(databaseSchema())}."media" (
    "id" serial PRIMARY KEY NOT NULL,
    "alt" varchar NOT NULL,
    "source_i_d" varchar,
    "prefix" varchar DEFAULT 'development/feat-new-cms/media',
    "_objectkey" varchar,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "url" varchar,
    "thumbnail_u_r_l" varchar,
    "filename" varchar,
    "mime_type" varchar,
    "filesize" numeric,
    "width" numeric,
    "height" numeric,
    "focal_x" numeric,
    "focal_y" numeric,
    "sizes_thumbnail_url" varchar,
    "sizes_thumbnail_width" numeric,
    "sizes_thumbnail_height" numeric,
    "sizes_thumbnail_mime_type" varchar,
    "sizes_thumbnail_filesize" numeric,
    "sizes_thumbnail_filename" varchar
  );

  CREATE TABLE ${sql.identifier(databaseSchema())}."seo_media" (
    "id" serial PRIMARY KEY NOT NULL,
    "alt" varchar NOT NULL,
    "source_i_d" varchar,
    "prefix" varchar DEFAULT 'development/feat-new-cms/media/seo',
    "_objectkey" varchar,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "url" varchar,
    "thumbnail_u_r_l" varchar,
    "filename" varchar,
    "mime_type" varchar,
    "filesize" numeric,
    "width" numeric,
    "height" numeric,
    "focal_x" numeric,
    "focal_y" numeric,
    "sizes_thumbnail_url" varchar,
    "sizes_thumbnail_width" numeric,
    "sizes_thumbnail_height" numeric,
    "sizes_thumbnail_mime_type" varchar,
    "sizes_thumbnail_filesize" numeric,
    "sizes_thumbnail_filename" varchar
  );

  CREATE TABLE ${sql.identifier(databaseSchema())}."services" (
    "id" serial PRIMARY KEY NOT NULL,
    "thumbnail_id" integer,
    "name" varchar,
    "description" varchar,
    "article_id" integer,
    "source_i_d" varchar,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "_status" ${sql.identifier(databaseSchema())}."enum_services_status" DEFAULT 'draft'
  );

  CREATE TABLE ${sql.identifier(databaseSchema())}."_services_v" (
    "id" serial PRIMARY KEY NOT NULL,
    "parent_id" integer,
    "version_thumbnail_id" integer,
    "version_name" varchar,
    "version_description" varchar,
    "version_article_id" integer,
    "version_source_i_d" varchar,
    "version_updated_at" timestamp(3) with time zone,
    "version_created_at" timestamp(3) with time zone,
    "version__status" ${sql.identifier(databaseSchema())}."enum__services_v_version_status" DEFAULT 'draft',
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "latest" boolean
  );

  CREATE TABLE ${sql.identifier(databaseSchema())}."new_patient_steps" (
    "id" serial PRIMARY KEY NOT NULL,
    "icon_id" integer,
    "title" jsonb,
    "overview" varchar,
    "description" jsonb,
    "source_i_d" varchar,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "_status" ${sql.identifier(databaseSchema())}."enum_new_patient_steps_status" DEFAULT 'draft'
  );

  CREATE TABLE ${sql.identifier(databaseSchema())}."_new_patient_steps_v" (
    "id" serial PRIMARY KEY NOT NULL,
    "parent_id" integer,
    "version_icon_id" integer,
    "version_title" jsonb,
    "version_overview" varchar,
    "version_description" jsonb,
    "version_source_i_d" varchar,
    "version_updated_at" timestamp(3) with time zone,
    "version_created_at" timestamp(3) with time zone,
    "version__status" ${sql.identifier(databaseSchema())}."enum__new_patient_steps_v_version_status" DEFAULT 'draft',
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "latest" boolean
  );

  CREATE TABLE ${sql.identifier(databaseSchema())}."articles_keywords" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "value" varchar
  );

  CREATE TABLE ${sql.identifier(databaseSchema())}."articles" (
    "id" serial PRIMARY KEY NOT NULL,
    "summary" varchar,
    "slug" varchar,
    "author" varchar DEFAULT 'GB Chiropractic',
    "thumbnail_id" integer,
    "title" varchar,
    "body" jsonb,
    "source_i_d" varchar,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "_status" ${sql.identifier(databaseSchema())}."enum_articles_status" DEFAULT 'draft'
  );

  CREATE TABLE ${sql.identifier(databaseSchema())}."_articles_v_version_keywords" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "value" varchar,
    "_uuid" varchar
  );

  CREATE TABLE ${sql.identifier(databaseSchema())}."_articles_v" (
    "id" serial PRIMARY KEY NOT NULL,
    "parent_id" integer,
    "version_summary" varchar,
    "version_slug" varchar,
    "version_author" varchar DEFAULT 'GB Chiropractic',
    "version_thumbnail_id" integer,
    "version_title" varchar,
    "version_body" jsonb,
    "version_source_i_d" varchar,
    "version_updated_at" timestamp(3) with time zone,
    "version_created_at" timestamp(3) with time zone,
    "version__status" ${sql.identifier(databaseSchema())}."enum__articles_v_version_status" DEFAULT 'draft',
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "latest" boolean
  );

  CREATE TABLE ${sql.identifier(databaseSchema())}."social_media_platforms" (
    "id" serial PRIMARY KEY NOT NULL,
    "name" ${sql.identifier(databaseSchema())}."enum_social_media_platforms_name",
    "link" varchar,
    "source_i_d" varchar,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "_status" ${sql.identifier(databaseSchema())}."enum_social_media_platforms_status" DEFAULT 'draft'
  );

  CREATE TABLE ${sql.identifier(databaseSchema())}."_social_media_platforms_v" (
    "id" serial PRIMARY KEY NOT NULL,
    "parent_id" integer,
    "version_name" ${sql.identifier(databaseSchema())}."enum__social_media_platforms_v_version_name",
    "version_link" varchar,
    "version_source_i_d" varchar,
    "version_updated_at" timestamp(3) with time zone,
    "version_created_at" timestamp(3) with time zone,
    "version__status" ${sql.identifier(databaseSchema())}."enum__social_media_platforms_v_version_status" DEFAULT 'draft',
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "latest" boolean
  );

  CREATE TABLE ${sql.identifier(databaseSchema())}."reviews" (
    "id" serial PRIMARY KEY NOT NULL,
    "name" varchar,
    "text" varchar,
    "platform" ${sql.identifier(databaseSchema())}."enum_reviews_platform",
    "link" varchar,
    "source_i_d" varchar,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "_status" ${sql.identifier(databaseSchema())}."enum_reviews_status" DEFAULT 'draft'
  );

  CREATE TABLE ${sql.identifier(databaseSchema())}."_reviews_v" (
    "id" serial PRIMARY KEY NOT NULL,
    "parent_id" integer,
    "version_name" varchar,
    "version_text" varchar,
    "version_platform" ${sql.identifier(databaseSchema())}."enum__reviews_v_version_platform",
    "version_link" varchar,
    "version_source_i_d" varchar,
    "version_updated_at" timestamp(3) with time zone,
    "version_created_at" timestamp(3) with time zone,
    "version__status" ${sql.identifier(databaseSchema())}."enum__reviews_v_version_status" DEFAULT 'draft',
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "latest" boolean
  );

  CREATE TABLE ${sql.identifier(databaseSchema())}."payload_kv" (
    "id" serial PRIMARY KEY NOT NULL,
    "key" varchar NOT NULL,
    "data" jsonb NOT NULL
  );

  CREATE TABLE ${sql.identifier(databaseSchema())}."payload_locked_documents" (
    "id" serial PRIMARY KEY NOT NULL,
    "global_slug" varchar,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE TABLE ${sql.identifier(databaseSchema())}."payload_locked_documents_rels" (
    "id" serial PRIMARY KEY NOT NULL,
    "order" integer,
    "parent_id" integer NOT NULL,
    "path" varchar NOT NULL,
    "users_id" integer,
    "media_id" integer,
    "seo_media_id" integer,
    "services_id" integer,
    "new_patient_steps_id" integer,
    "articles_id" integer,
    "social_media_platforms_id" integer,
    "reviews_id" integer
  );

  CREATE TABLE ${sql.identifier(databaseSchema())}."payload_preferences" (
    "id" serial PRIMARY KEY NOT NULL,
    "key" varchar,
    "value" jsonb,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE TABLE ${sql.identifier(databaseSchema())}."payload_preferences_rels" (
    "id" serial PRIMARY KEY NOT NULL,
    "order" integer,
    "parent_id" integer NOT NULL,
    "path" varchar NOT NULL,
    "users_id" integer
  );

  CREATE TABLE ${sql.identifier(databaseSchema())}."payload_migrations" (
    "id" serial PRIMARY KEY NOT NULL,
    "name" varchar,
    "batch" numeric,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE TABLE ${sql.identifier(databaseSchema())}."business_details_operating_hours" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "opens" varchar,
    "closes" varchar,
    "monday" boolean DEFAULT false,
    "tuesday" boolean DEFAULT false,
    "wednesday" boolean DEFAULT false,
    "thursday" boolean DEFAULT false,
    "friday" boolean DEFAULT false,
    "saturday" boolean DEFAULT false,
    "sunday" boolean DEFAULT false,
    "note" varchar
  );

  CREATE TABLE ${sql.identifier(databaseSchema())}."business_details" (
    "id" serial PRIMARY KEY NOT NULL,
    "booking_link" varchar,
    "email" varchar,
    "phone" varchar,
    "address_street" varchar,
    "address_suburb" varchar,
    "address_state" ${sql.identifier(databaseSchema())}."enum_business_details_address_state",
    "address_code" varchar,
    "address_maps_link" varchar,
    "address_coords" geometry(Point),
    "_status" ${sql.identifier(databaseSchema())}."enum_business_details_status" DEFAULT 'draft',
    "updated_at" timestamp(3) with time zone,
    "created_at" timestamp(3) with time zone
  );

  CREATE TABLE ${sql.identifier(databaseSchema())}."_business_details_v_version_operating_hours" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "opens" varchar,
    "closes" varchar,
    "monday" boolean DEFAULT false,
    "tuesday" boolean DEFAULT false,
    "wednesday" boolean DEFAULT false,
    "thursday" boolean DEFAULT false,
    "friday" boolean DEFAULT false,
    "saturday" boolean DEFAULT false,
    "sunday" boolean DEFAULT false,
    "note" varchar,
    "_uuid" varchar
  );

  CREATE TABLE ${sql.identifier(databaseSchema())}."_business_details_v" (
    "id" serial PRIMARY KEY NOT NULL,
    "version_booking_link" varchar,
    "version_email" varchar,
    "version_phone" varchar,
    "version_address_street" varchar,
    "version_address_suburb" varchar,
    "version_address_state" ${sql.identifier(databaseSchema())}."enum__business_details_v_version_address_state",
    "version_address_code" varchar,
    "version_address_maps_link" varchar,
    "version_address_coords" geometry(Point),
    "version__status" ${sql.identifier(databaseSchema())}."enum__business_details_v_version_status" DEFAULT 'draft',
    "version_updated_at" timestamp(3) with time zone,
    "version_created_at" timestamp(3) with time zone,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "latest" boolean
  );

  CREATE TABLE ${sql.identifier(databaseSchema())}."graphics" (
    "id" serial PRIMARY KEY NOT NULL,
    "logo_id" integer,
    "horizontal_logo_id" integer,
    "background_graphic_id" integer,
    "_status" ${sql.identifier(databaseSchema())}."enum_graphics_status" DEFAULT 'draft',
    "updated_at" timestamp(3) with time zone,
    "created_at" timestamp(3) with time zone
  );

  CREATE TABLE ${sql.identifier(databaseSchema())}."_graphics_v" (
    "id" serial PRIMARY KEY NOT NULL,
    "version_logo_id" integer,
    "version_horizontal_logo_id" integer,
    "version_background_graphic_id" integer,
    "version__status" ${sql.identifier(databaseSchema())}."enum__graphics_v_version_status" DEFAULT 'draft',
    "version_updated_at" timestamp(3) with time zone,
    "version_created_at" timestamp(3) with time zone,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "latest" boolean
  );

  CREATE TABLE ${sql.identifier(databaseSchema())}."home_page" (
    "id" serial PRIMARY KEY NOT NULL,
    "landing_image_id" integer,
    "what_to_expect_image_id" integer,
    "seo_meta_title" varchar,
    "seo_meta_description" varchar,
    "seo_open_graph_site_name" varchar,
    "seo_open_graph_title" varchar,
    "seo_open_graph_description" varchar,
    "seo_twitter_creator" varchar,
    "seo_twitter_creator_id" varchar,
    "_status" ${sql.identifier(databaseSchema())}."enum_home_page_status" DEFAULT 'draft',
    "updated_at" timestamp(3) with time zone,
    "created_at" timestamp(3) with time zone
  );

  CREATE TABLE ${sql.identifier(databaseSchema())}."home_page_rels" (
    "id" serial PRIMARY KEY NOT NULL,
    "order" integer,
    "parent_id" integer NOT NULL,
    "path" varchar NOT NULL,
    "seo_media_id" integer
  );

  CREATE TABLE ${sql.identifier(databaseSchema())}."_home_page_v" (
    "id" serial PRIMARY KEY NOT NULL,
    "version_landing_image_id" integer,
    "version_what_to_expect_image_id" integer,
    "version_seo_meta_title" varchar,
    "version_seo_meta_description" varchar,
    "version_seo_open_graph_site_name" varchar,
    "version_seo_open_graph_title" varchar,
    "version_seo_open_graph_description" varchar,
    "version_seo_twitter_creator" varchar,
    "version_seo_twitter_creator_id" varchar,
    "version__status" ${sql.identifier(databaseSchema())}."enum__home_page_v_version_status" DEFAULT 'draft',
    "version_updated_at" timestamp(3) with time zone,
    "version_created_at" timestamp(3) with time zone,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "latest" boolean
  );

  CREATE TABLE ${sql.identifier(databaseSchema())}."_home_page_v_rels" (
    "id" serial PRIMARY KEY NOT NULL,
    "order" integer,
    "parent_id" integer NOT NULL,
    "path" varchar NOT NULL,
    "seo_media_id" integer
  );

  CREATE TABLE ${sql.identifier(databaseSchema())}."about_us_page" (
    "id" serial PRIMARY KEY NOT NULL,
    "welcome_image_id" integer,
    "meet_the_chiro_image_id" integer,
    "seo_meta_title" varchar,
    "seo_meta_description" varchar,
    "seo_open_graph_site_name" varchar,
    "seo_open_graph_title" varchar,
    "seo_open_graph_description" varchar,
    "seo_twitter_creator" varchar,
    "seo_twitter_creator_id" varchar,
    "_status" ${sql.identifier(databaseSchema())}."enum_about_us_page_status" DEFAULT 'draft',
    "updated_at" timestamp(3) with time zone,
    "created_at" timestamp(3) with time zone
  );

  CREATE TABLE ${sql.identifier(databaseSchema())}."about_us_page_rels" (
    "id" serial PRIMARY KEY NOT NULL,
    "order" integer,
    "parent_id" integer NOT NULL,
    "path" varchar NOT NULL,
    "media_id" integer,
    "seo_media_id" integer
  );

  CREATE TABLE ${sql.identifier(databaseSchema())}."_about_us_page_v" (
    "id" serial PRIMARY KEY NOT NULL,
    "version_welcome_image_id" integer,
    "version_meet_the_chiro_image_id" integer,
    "version_seo_meta_title" varchar,
    "version_seo_meta_description" varchar,
    "version_seo_open_graph_site_name" varchar,
    "version_seo_open_graph_title" varchar,
    "version_seo_open_graph_description" varchar,
    "version_seo_twitter_creator" varchar,
    "version_seo_twitter_creator_id" varchar,
    "version__status" ${sql.identifier(databaseSchema())}."enum__about_us_page_v_version_status" DEFAULT 'draft',
    "version_updated_at" timestamp(3) with time zone,
    "version_created_at" timestamp(3) with time zone,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "latest" boolean
  );

  CREATE TABLE ${sql.identifier(databaseSchema())}."_about_us_page_v_rels" (
    "id" serial PRIMARY KEY NOT NULL,
    "order" integer,
    "parent_id" integer NOT NULL,
    "path" varchar NOT NULL,
    "media_id" integer,
    "seo_media_id" integer
  );

  CREATE TABLE ${sql.identifier(databaseSchema())}."treatment_and_care_page" (
    "id" serial PRIMARY KEY NOT NULL,
    "seo_meta_title" varchar,
    "seo_meta_description" varchar,
    "seo_open_graph_site_name" varchar,
    "seo_open_graph_title" varchar,
    "seo_open_graph_description" varchar,
    "seo_twitter_creator" varchar,
    "seo_twitter_creator_id" varchar,
    "_status" ${sql.identifier(databaseSchema())}."enum_treatment_and_care_page_status" DEFAULT 'draft',
    "updated_at" timestamp(3) with time zone,
    "created_at" timestamp(3) with time zone
  );

  CREATE TABLE ${sql.identifier(databaseSchema())}."treatment_and_care_page_rels" (
    "id" serial PRIMARY KEY NOT NULL,
    "order" integer,
    "parent_id" integer NOT NULL,
    "path" varchar NOT NULL,
    "services_id" integer,
    "seo_media_id" integer
  );

  CREATE TABLE ${sql.identifier(databaseSchema())}."_treatment_and_care_page_v" (
    "id" serial PRIMARY KEY NOT NULL,
    "version_seo_meta_title" varchar,
    "version_seo_meta_description" varchar,
    "version_seo_open_graph_site_name" varchar,
    "version_seo_open_graph_title" varchar,
    "version_seo_open_graph_description" varchar,
    "version_seo_twitter_creator" varchar,
    "version_seo_twitter_creator_id" varchar,
    "version__status" ${sql.identifier(databaseSchema())}."enum__treatment_and_care_page_v_version_status" DEFAULT 'draft',
    "version_updated_at" timestamp(3) with time zone,
    "version_created_at" timestamp(3) with time zone,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "latest" boolean
  );

  CREATE TABLE ${sql.identifier(databaseSchema())}."_treatment_and_care_page_v_rels" (
    "id" serial PRIMARY KEY NOT NULL,
    "order" integer,
    "parent_id" integer NOT NULL,
    "path" varchar NOT NULL,
    "services_id" integer,
    "seo_media_id" integer
  );

  CREATE TABLE ${sql.identifier(databaseSchema())}."what_to_expect_page" (
    "id" serial PRIMARY KEY NOT NULL,
    "seo_meta_title" varchar,
    "seo_meta_description" varchar,
    "seo_open_graph_site_name" varchar,
    "seo_open_graph_title" varchar,
    "seo_open_graph_description" varchar,
    "seo_twitter_creator" varchar,
    "seo_twitter_creator_id" varchar,
    "_status" ${sql.identifier(databaseSchema())}."enum_what_to_expect_page_status" DEFAULT 'draft',
    "updated_at" timestamp(3) with time zone,
    "created_at" timestamp(3) with time zone
  );

  CREATE TABLE ${sql.identifier(databaseSchema())}."what_to_expect_page_rels" (
    "id" serial PRIMARY KEY NOT NULL,
    "order" integer,
    "parent_id" integer NOT NULL,
    "path" varchar NOT NULL,
    "new_patient_steps_id" integer,
    "seo_media_id" integer
  );

  CREATE TABLE ${sql.identifier(databaseSchema())}."_what_to_expect_page_v" (
    "id" serial PRIMARY KEY NOT NULL,
    "version_seo_meta_title" varchar,
    "version_seo_meta_description" varchar,
    "version_seo_open_graph_site_name" varchar,
    "version_seo_open_graph_title" varchar,
    "version_seo_open_graph_description" varchar,
    "version_seo_twitter_creator" varchar,
    "version_seo_twitter_creator_id" varchar,
    "version__status" ${sql.identifier(databaseSchema())}."enum__what_to_expect_page_v_version_status" DEFAULT 'draft',
    "version_updated_at" timestamp(3) with time zone,
    "version_created_at" timestamp(3) with time zone,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "latest" boolean
  );

  CREATE TABLE ${sql.identifier(databaseSchema())}."_what_to_expect_page_v_rels" (
    "id" serial PRIMARY KEY NOT NULL,
    "order" integer,
    "parent_id" integer NOT NULL,
    "path" varchar NOT NULL,
    "new_patient_steps_id" integer,
    "seo_media_id" integer
  );

  CREATE TABLE ${sql.identifier(databaseSchema())}."contact_us_page" (
    "id" serial PRIMARY KEY NOT NULL,
    "seo_meta_title" varchar,
    "seo_meta_description" varchar,
    "seo_open_graph_site_name" varchar,
    "seo_open_graph_title" varchar,
    "seo_open_graph_description" varchar,
    "seo_twitter_creator" varchar,
    "seo_twitter_creator_id" varchar,
    "_status" ${sql.identifier(databaseSchema())}."enum_contact_us_page_status" DEFAULT 'draft',
    "updated_at" timestamp(3) with time zone,
    "created_at" timestamp(3) with time zone
  );

  CREATE TABLE ${sql.identifier(databaseSchema())}."contact_us_page_rels" (
    "id" serial PRIMARY KEY NOT NULL,
    "order" integer,
    "parent_id" integer NOT NULL,
    "path" varchar NOT NULL,
    "seo_media_id" integer
  );

  CREATE TABLE ${sql.identifier(databaseSchema())}."_contact_us_page_v" (
    "id" serial PRIMARY KEY NOT NULL,
    "version_seo_meta_title" varchar,
    "version_seo_meta_description" varchar,
    "version_seo_open_graph_site_name" varchar,
    "version_seo_open_graph_title" varchar,
    "version_seo_open_graph_description" varchar,
    "version_seo_twitter_creator" varchar,
    "version_seo_twitter_creator_id" varchar,
    "version__status" ${sql.identifier(databaseSchema())}."enum__contact_us_page_v_version_status" DEFAULT 'draft',
    "version_updated_at" timestamp(3) with time zone,
    "version_created_at" timestamp(3) with time zone,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "latest" boolean
  );

  CREATE TABLE ${sql.identifier(databaseSchema())}."_contact_us_page_v_rels" (
    "id" serial PRIMARY KEY NOT NULL,
    "order" integer,
    "parent_id" integer NOT NULL,
    "path" varchar NOT NULL,
    "seo_media_id" integer
  );

  ALTER TABLE ${sql.identifier(databaseSchema())}."users_roles" ADD CONSTRAINT "users_roles_parent_fk" FOREIGN KEY ("parent_id") REFERENCES ${sql.identifier(databaseSchema())}."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE ${sql.identifier(databaseSchema())}."users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES ${sql.identifier(databaseSchema())}."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE ${sql.identifier(databaseSchema())}."services" ADD CONSTRAINT "services_thumbnail_id_media_id_fk" FOREIGN KEY ("thumbnail_id") REFERENCES ${sql.identifier(databaseSchema())}."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE ${sql.identifier(databaseSchema())}."services" ADD CONSTRAINT "services_article_id_articles_id_fk" FOREIGN KEY ("article_id") REFERENCES ${sql.identifier(databaseSchema())}."articles"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE ${sql.identifier(databaseSchema())}."_services_v" ADD CONSTRAINT "_services_v_parent_id_services_id_fk" FOREIGN KEY ("parent_id") REFERENCES ${sql.identifier(databaseSchema())}."services"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE ${sql.identifier(databaseSchema())}."_services_v" ADD CONSTRAINT "_services_v_version_thumbnail_id_media_id_fk" FOREIGN KEY ("version_thumbnail_id") REFERENCES ${sql.identifier(databaseSchema())}."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE ${sql.identifier(databaseSchema())}."_services_v" ADD CONSTRAINT "_services_v_version_article_id_articles_id_fk" FOREIGN KEY ("version_article_id") REFERENCES ${sql.identifier(databaseSchema())}."articles"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE ${sql.identifier(databaseSchema())}."new_patient_steps" ADD CONSTRAINT "new_patient_steps_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES ${sql.identifier(databaseSchema())}."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE ${sql.identifier(databaseSchema())}."_new_patient_steps_v" ADD CONSTRAINT "_new_patient_steps_v_parent_id_new_patient_steps_id_fk" FOREIGN KEY ("parent_id") REFERENCES ${sql.identifier(databaseSchema())}."new_patient_steps"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE ${sql.identifier(databaseSchema())}."_new_patient_steps_v" ADD CONSTRAINT "_new_patient_steps_v_version_icon_id_media_id_fk" FOREIGN KEY ("version_icon_id") REFERENCES ${sql.identifier(databaseSchema())}."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE ${sql.identifier(databaseSchema())}."articles_keywords" ADD CONSTRAINT "articles_keywords_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES ${sql.identifier(databaseSchema())}."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE ${sql.identifier(databaseSchema())}."articles" ADD CONSTRAINT "articles_thumbnail_id_media_id_fk" FOREIGN KEY ("thumbnail_id") REFERENCES ${sql.identifier(databaseSchema())}."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE ${sql.identifier(databaseSchema())}."_articles_v_version_keywords" ADD CONSTRAINT "_articles_v_version_keywords_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES ${sql.identifier(databaseSchema())}."_articles_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE ${sql.identifier(databaseSchema())}."_articles_v" ADD CONSTRAINT "_articles_v_parent_id_articles_id_fk" FOREIGN KEY ("parent_id") REFERENCES ${sql.identifier(databaseSchema())}."articles"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE ${sql.identifier(databaseSchema())}."_articles_v" ADD CONSTRAINT "_articles_v_version_thumbnail_id_media_id_fk" FOREIGN KEY ("version_thumbnail_id") REFERENCES ${sql.identifier(databaseSchema())}."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE ${sql.identifier(databaseSchema())}."_social_media_platforms_v" ADD CONSTRAINT "_social_media_platforms_v_parent_id_social_media_platforms_id_fk" FOREIGN KEY ("parent_id") REFERENCES ${sql.identifier(databaseSchema())}."social_media_platforms"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE ${sql.identifier(databaseSchema())}."_reviews_v" ADD CONSTRAINT "_reviews_v_parent_id_reviews_id_fk" FOREIGN KEY ("parent_id") REFERENCES ${sql.identifier(databaseSchema())}."reviews"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE ${sql.identifier(databaseSchema())}."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES ${sql.identifier(databaseSchema())}."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE ${sql.identifier(databaseSchema())}."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES ${sql.identifier(databaseSchema())}."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE ${sql.identifier(databaseSchema())}."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES ${sql.identifier(databaseSchema())}."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE ${sql.identifier(databaseSchema())}."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_seo_media_fk" FOREIGN KEY ("seo_media_id") REFERENCES ${sql.identifier(databaseSchema())}."seo_media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE ${sql.identifier(databaseSchema())}."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES ${sql.identifier(databaseSchema())}."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE ${sql.identifier(databaseSchema())}."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_new_patient_steps_fk" FOREIGN KEY ("new_patient_steps_id") REFERENCES ${sql.identifier(databaseSchema())}."new_patient_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE ${sql.identifier(databaseSchema())}."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_articles_fk" FOREIGN KEY ("articles_id") REFERENCES ${sql.identifier(databaseSchema())}."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE ${sql.identifier(databaseSchema())}."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_social_media_platforms_fk" FOREIGN KEY ("social_media_platforms_id") REFERENCES ${sql.identifier(databaseSchema())}."social_media_platforms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE ${sql.identifier(databaseSchema())}."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_reviews_fk" FOREIGN KEY ("reviews_id") REFERENCES ${sql.identifier(databaseSchema())}."reviews"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE ${sql.identifier(databaseSchema())}."payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES ${sql.identifier(databaseSchema())}."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE ${sql.identifier(databaseSchema())}."payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES ${sql.identifier(databaseSchema())}."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE ${sql.identifier(databaseSchema())}."business_details_operating_hours" ADD CONSTRAINT "business_details_operating_hours_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES ${sql.identifier(databaseSchema())}."business_details"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE ${sql.identifier(databaseSchema())}."_business_details_v_version_operating_hours" ADD CONSTRAINT "_business_details_v_version_operating_hours_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES ${sql.identifier(databaseSchema())}."_business_details_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE ${sql.identifier(databaseSchema())}."graphics" ADD CONSTRAINT "graphics_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES ${sql.identifier(databaseSchema())}."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE ${sql.identifier(databaseSchema())}."graphics" ADD CONSTRAINT "graphics_horizontal_logo_id_media_id_fk" FOREIGN KEY ("horizontal_logo_id") REFERENCES ${sql.identifier(databaseSchema())}."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE ${sql.identifier(databaseSchema())}."graphics" ADD CONSTRAINT "graphics_background_graphic_id_media_id_fk" FOREIGN KEY ("background_graphic_id") REFERENCES ${sql.identifier(databaseSchema())}."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE ${sql.identifier(databaseSchema())}."_graphics_v" ADD CONSTRAINT "_graphics_v_version_logo_id_media_id_fk" FOREIGN KEY ("version_logo_id") REFERENCES ${sql.identifier(databaseSchema())}."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE ${sql.identifier(databaseSchema())}."_graphics_v" ADD CONSTRAINT "_graphics_v_version_horizontal_logo_id_media_id_fk" FOREIGN KEY ("version_horizontal_logo_id") REFERENCES ${sql.identifier(databaseSchema())}."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE ${sql.identifier(databaseSchema())}."_graphics_v" ADD CONSTRAINT "_graphics_v_version_background_graphic_id_media_id_fk" FOREIGN KEY ("version_background_graphic_id") REFERENCES ${sql.identifier(databaseSchema())}."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE ${sql.identifier(databaseSchema())}."home_page" ADD CONSTRAINT "home_page_landing_image_id_media_id_fk" FOREIGN KEY ("landing_image_id") REFERENCES ${sql.identifier(databaseSchema())}."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE ${sql.identifier(databaseSchema())}."home_page" ADD CONSTRAINT "home_page_what_to_expect_image_id_media_id_fk" FOREIGN KEY ("what_to_expect_image_id") REFERENCES ${sql.identifier(databaseSchema())}."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE ${sql.identifier(databaseSchema())}."home_page_rels" ADD CONSTRAINT "home_page_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES ${sql.identifier(databaseSchema())}."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE ${sql.identifier(databaseSchema())}."home_page_rels" ADD CONSTRAINT "home_page_rels_seo_media_fk" FOREIGN KEY ("seo_media_id") REFERENCES ${sql.identifier(databaseSchema())}."seo_media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE ${sql.identifier(databaseSchema())}."_home_page_v" ADD CONSTRAINT "_home_page_v_version_landing_image_id_media_id_fk" FOREIGN KEY ("version_landing_image_id") REFERENCES ${sql.identifier(databaseSchema())}."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE ${sql.identifier(databaseSchema())}."_home_page_v" ADD CONSTRAINT "_home_page_v_version_what_to_expect_image_id_media_id_fk" FOREIGN KEY ("version_what_to_expect_image_id") REFERENCES ${sql.identifier(databaseSchema())}."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE ${sql.identifier(databaseSchema())}."_home_page_v_rels" ADD CONSTRAINT "_home_page_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES ${sql.identifier(databaseSchema())}."_home_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE ${sql.identifier(databaseSchema())}."_home_page_v_rels" ADD CONSTRAINT "_home_page_v_rels_seo_media_fk" FOREIGN KEY ("seo_media_id") REFERENCES ${sql.identifier(databaseSchema())}."seo_media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE ${sql.identifier(databaseSchema())}."about_us_page" ADD CONSTRAINT "about_us_page_welcome_image_id_media_id_fk" FOREIGN KEY ("welcome_image_id") REFERENCES ${sql.identifier(databaseSchema())}."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE ${sql.identifier(databaseSchema())}."about_us_page" ADD CONSTRAINT "about_us_page_meet_the_chiro_image_id_media_id_fk" FOREIGN KEY ("meet_the_chiro_image_id") REFERENCES ${sql.identifier(databaseSchema())}."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE ${sql.identifier(databaseSchema())}."about_us_page_rels" ADD CONSTRAINT "about_us_page_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES ${sql.identifier(databaseSchema())}."about_us_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE ${sql.identifier(databaseSchema())}."about_us_page_rels" ADD CONSTRAINT "about_us_page_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES ${sql.identifier(databaseSchema())}."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE ${sql.identifier(databaseSchema())}."about_us_page_rels" ADD CONSTRAINT "about_us_page_rels_seo_media_fk" FOREIGN KEY ("seo_media_id") REFERENCES ${sql.identifier(databaseSchema())}."seo_media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE ${sql.identifier(databaseSchema())}."_about_us_page_v" ADD CONSTRAINT "_about_us_page_v_version_welcome_image_id_media_id_fk" FOREIGN KEY ("version_welcome_image_id") REFERENCES ${sql.identifier(databaseSchema())}."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE ${sql.identifier(databaseSchema())}."_about_us_page_v" ADD CONSTRAINT "_about_us_page_v_version_meet_the_chiro_image_id_media_id_fk" FOREIGN KEY ("version_meet_the_chiro_image_id") REFERENCES ${sql.identifier(databaseSchema())}."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE ${sql.identifier(databaseSchema())}."_about_us_page_v_rels" ADD CONSTRAINT "_about_us_page_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES ${sql.identifier(databaseSchema())}."_about_us_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE ${sql.identifier(databaseSchema())}."_about_us_page_v_rels" ADD CONSTRAINT "_about_us_page_v_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES ${sql.identifier(databaseSchema())}."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE ${sql.identifier(databaseSchema())}."_about_us_page_v_rels" ADD CONSTRAINT "_about_us_page_v_rels_seo_media_fk" FOREIGN KEY ("seo_media_id") REFERENCES ${sql.identifier(databaseSchema())}."seo_media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE ${sql.identifier(databaseSchema())}."treatment_and_care_page_rels" ADD CONSTRAINT "treatment_and_care_page_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES ${sql.identifier(databaseSchema())}."treatment_and_care_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE ${sql.identifier(databaseSchema())}."treatment_and_care_page_rels" ADD CONSTRAINT "treatment_and_care_page_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES ${sql.identifier(databaseSchema())}."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE ${sql.identifier(databaseSchema())}."treatment_and_care_page_rels" ADD CONSTRAINT "treatment_and_care_page_rels_seo_media_fk" FOREIGN KEY ("seo_media_id") REFERENCES ${sql.identifier(databaseSchema())}."seo_media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE ${sql.identifier(databaseSchema())}."_treatment_and_care_page_v_rels" ADD CONSTRAINT "_treatment_and_care_page_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES ${sql.identifier(databaseSchema())}."_treatment_and_care_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE ${sql.identifier(databaseSchema())}."_treatment_and_care_page_v_rels" ADD CONSTRAINT "_treatment_and_care_page_v_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES ${sql.identifier(databaseSchema())}."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE ${sql.identifier(databaseSchema())}."_treatment_and_care_page_v_rels" ADD CONSTRAINT "_treatment_and_care_page_v_rels_seo_media_fk" FOREIGN KEY ("seo_media_id") REFERENCES ${sql.identifier(databaseSchema())}."seo_media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE ${sql.identifier(databaseSchema())}."what_to_expect_page_rels" ADD CONSTRAINT "what_to_expect_page_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES ${sql.identifier(databaseSchema())}."what_to_expect_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE ${sql.identifier(databaseSchema())}."what_to_expect_page_rels" ADD CONSTRAINT "what_to_expect_page_rels_new_patient_steps_fk" FOREIGN KEY ("new_patient_steps_id") REFERENCES ${sql.identifier(databaseSchema())}."new_patient_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE ${sql.identifier(databaseSchema())}."what_to_expect_page_rels" ADD CONSTRAINT "what_to_expect_page_rels_seo_media_fk" FOREIGN KEY ("seo_media_id") REFERENCES ${sql.identifier(databaseSchema())}."seo_media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE ${sql.identifier(databaseSchema())}."_what_to_expect_page_v_rels" ADD CONSTRAINT "_what_to_expect_page_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES ${sql.identifier(databaseSchema())}."_what_to_expect_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE ${sql.identifier(databaseSchema())}."_what_to_expect_page_v_rels" ADD CONSTRAINT "_what_to_expect_page_v_rels_new_patient_steps_fk" FOREIGN KEY ("new_patient_steps_id") REFERENCES ${sql.identifier(databaseSchema())}."new_patient_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE ${sql.identifier(databaseSchema())}."_what_to_expect_page_v_rels" ADD CONSTRAINT "_what_to_expect_page_v_rels_seo_media_fk" FOREIGN KEY ("seo_media_id") REFERENCES ${sql.identifier(databaseSchema())}."seo_media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE ${sql.identifier(databaseSchema())}."contact_us_page_rels" ADD CONSTRAINT "contact_us_page_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES ${sql.identifier(databaseSchema())}."contact_us_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE ${sql.identifier(databaseSchema())}."contact_us_page_rels" ADD CONSTRAINT "contact_us_page_rels_seo_media_fk" FOREIGN KEY ("seo_media_id") REFERENCES ${sql.identifier(databaseSchema())}."seo_media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE ${sql.identifier(databaseSchema())}."_contact_us_page_v_rels" ADD CONSTRAINT "_contact_us_page_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES ${sql.identifier(databaseSchema())}."_contact_us_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE ${sql.identifier(databaseSchema())}."_contact_us_page_v_rels" ADD CONSTRAINT "_contact_us_page_v_rels_seo_media_fk" FOREIGN KEY ("seo_media_id") REFERENCES ${sql.identifier(databaseSchema())}."seo_media"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_roles_order_idx" ON ${sql.identifier(databaseSchema())}."users_roles" USING btree ("order");
  CREATE INDEX "users_roles_parent_idx" ON ${sql.identifier(databaseSchema())}."users_roles" USING btree ("parent_id");
  CREATE INDEX "users_sessions_order_idx" ON ${sql.identifier(databaseSchema())}."users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON ${sql.identifier(databaseSchema())}."users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON ${sql.identifier(databaseSchema())}."users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON ${sql.identifier(databaseSchema())}."users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON ${sql.identifier(databaseSchema())}."users" USING btree ("email");
  CREATE UNIQUE INDEX "media_source_i_d_idx" ON ${sql.identifier(databaseSchema())}."media" USING btree ("source_i_d");
  CREATE INDEX "media_updated_at_idx" ON ${sql.identifier(databaseSchema())}."media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON ${sql.identifier(databaseSchema())}."media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON ${sql.identifier(databaseSchema())}."media" USING btree ("filename");
  CREATE INDEX "media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON ${sql.identifier(databaseSchema())}."media" USING btree ("sizes_thumbnail_filename");
  CREATE UNIQUE INDEX "seo_media_source_i_d_idx" ON ${sql.identifier(databaseSchema())}."seo_media" USING btree ("source_i_d");
  CREATE INDEX "seo_media_updated_at_idx" ON ${sql.identifier(databaseSchema())}."seo_media" USING btree ("updated_at");
  CREATE INDEX "seo_media_created_at_idx" ON ${sql.identifier(databaseSchema())}."seo_media" USING btree ("created_at");
  CREATE UNIQUE INDEX "seo_media_filename_idx" ON ${sql.identifier(databaseSchema())}."seo_media" USING btree ("filename");
  CREATE INDEX "seo_media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON ${sql.identifier(databaseSchema())}."seo_media" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX "services_thumbnail_idx" ON ${sql.identifier(databaseSchema())}."services" USING btree ("thumbnail_id");
  CREATE INDEX "services_article_idx" ON ${sql.identifier(databaseSchema())}."services" USING btree ("article_id");
  CREATE UNIQUE INDEX "services_source_i_d_idx" ON ${sql.identifier(databaseSchema())}."services" USING btree ("source_i_d");
  CREATE INDEX "services_updated_at_idx" ON ${sql.identifier(databaseSchema())}."services" USING btree ("updated_at");
  CREATE INDEX "services_created_at_idx" ON ${sql.identifier(databaseSchema())}."services" USING btree ("created_at");
  CREATE INDEX "services__status_idx" ON ${sql.identifier(databaseSchema())}."services" USING btree ("_status");
  CREATE INDEX "_services_v_parent_idx" ON ${sql.identifier(databaseSchema())}."_services_v" USING btree ("parent_id");
  CREATE INDEX "_services_v_version_version_thumbnail_idx" ON ${sql.identifier(databaseSchema())}."_services_v" USING btree ("version_thumbnail_id");
  CREATE INDEX "_services_v_version_version_article_idx" ON ${sql.identifier(databaseSchema())}."_services_v" USING btree ("version_article_id");
  CREATE INDEX "_services_v_version_version_source_i_d_idx" ON ${sql.identifier(databaseSchema())}."_services_v" USING btree ("version_source_i_d");
  CREATE INDEX "_services_v_version_version_updated_at_idx" ON ${sql.identifier(databaseSchema())}."_services_v" USING btree ("version_updated_at");
  CREATE INDEX "_services_v_version_version_created_at_idx" ON ${sql.identifier(databaseSchema())}."_services_v" USING btree ("version_created_at");
  CREATE INDEX "_services_v_version_version__status_idx" ON ${sql.identifier(databaseSchema())}."_services_v" USING btree ("version__status");
  CREATE INDEX "_services_v_created_at_idx" ON ${sql.identifier(databaseSchema())}."_services_v" USING btree ("created_at");
  CREATE INDEX "_services_v_updated_at_idx" ON ${sql.identifier(databaseSchema())}."_services_v" USING btree ("updated_at");
  CREATE INDEX "_services_v_latest_idx" ON ${sql.identifier(databaseSchema())}."_services_v" USING btree ("latest");
  CREATE INDEX "new_patient_steps_icon_idx" ON ${sql.identifier(databaseSchema())}."new_patient_steps" USING btree ("icon_id");
  CREATE UNIQUE INDEX "new_patient_steps_source_i_d_idx" ON ${sql.identifier(databaseSchema())}."new_patient_steps" USING btree ("source_i_d");
  CREATE INDEX "new_patient_steps_updated_at_idx" ON ${sql.identifier(databaseSchema())}."new_patient_steps" USING btree ("updated_at");
  CREATE INDEX "new_patient_steps_created_at_idx" ON ${sql.identifier(databaseSchema())}."new_patient_steps" USING btree ("created_at");
  CREATE INDEX "new_patient_steps__status_idx" ON ${sql.identifier(databaseSchema())}."new_patient_steps" USING btree ("_status");
  CREATE INDEX "_new_patient_steps_v_parent_idx" ON ${sql.identifier(databaseSchema())}."_new_patient_steps_v" USING btree ("parent_id");
  CREATE INDEX "_new_patient_steps_v_version_version_icon_idx" ON ${sql.identifier(databaseSchema())}."_new_patient_steps_v" USING btree ("version_icon_id");
  CREATE INDEX "_new_patient_steps_v_version_version_source_i_d_idx" ON ${sql.identifier(databaseSchema())}."_new_patient_steps_v" USING btree ("version_source_i_d");
  CREATE INDEX "_new_patient_steps_v_version_version_updated_at_idx" ON ${sql.identifier(databaseSchema())}."_new_patient_steps_v" USING btree ("version_updated_at");
  CREATE INDEX "_new_patient_steps_v_version_version_created_at_idx" ON ${sql.identifier(databaseSchema())}."_new_patient_steps_v" USING btree ("version_created_at");
  CREATE INDEX "_new_patient_steps_v_version_version__status_idx" ON ${sql.identifier(databaseSchema())}."_new_patient_steps_v" USING btree ("version__status");
  CREATE INDEX "_new_patient_steps_v_created_at_idx" ON ${sql.identifier(databaseSchema())}."_new_patient_steps_v" USING btree ("created_at");
  CREATE INDEX "_new_patient_steps_v_updated_at_idx" ON ${sql.identifier(databaseSchema())}."_new_patient_steps_v" USING btree ("updated_at");
  CREATE INDEX "_new_patient_steps_v_latest_idx" ON ${sql.identifier(databaseSchema())}."_new_patient_steps_v" USING btree ("latest");
  CREATE INDEX "articles_keywords_order_idx" ON ${sql.identifier(databaseSchema())}."articles_keywords" USING btree ("_order");
  CREATE INDEX "articles_keywords_parent_id_idx" ON ${sql.identifier(databaseSchema())}."articles_keywords" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "articles_slug_idx" ON ${sql.identifier(databaseSchema())}."articles" USING btree ("slug");
  CREATE INDEX "articles_thumbnail_idx" ON ${sql.identifier(databaseSchema())}."articles" USING btree ("thumbnail_id");
  CREATE UNIQUE INDEX "articles_source_i_d_idx" ON ${sql.identifier(databaseSchema())}."articles" USING btree ("source_i_d");
  CREATE INDEX "articles_updated_at_idx" ON ${sql.identifier(databaseSchema())}."articles" USING btree ("updated_at");
  CREATE INDEX "articles_created_at_idx" ON ${sql.identifier(databaseSchema())}."articles" USING btree ("created_at");
  CREATE INDEX "articles__status_idx" ON ${sql.identifier(databaseSchema())}."articles" USING btree ("_status");
  CREATE INDEX "_articles_v_version_keywords_order_idx" ON ${sql.identifier(databaseSchema())}."_articles_v_version_keywords" USING btree ("_order");
  CREATE INDEX "_articles_v_version_keywords_parent_id_idx" ON ${sql.identifier(databaseSchema())}."_articles_v_version_keywords" USING btree ("_parent_id");
  CREATE INDEX "_articles_v_parent_idx" ON ${sql.identifier(databaseSchema())}."_articles_v" USING btree ("parent_id");
  CREATE INDEX "_articles_v_version_version_slug_idx" ON ${sql.identifier(databaseSchema())}."_articles_v" USING btree ("version_slug");
  CREATE INDEX "_articles_v_version_version_thumbnail_idx" ON ${sql.identifier(databaseSchema())}."_articles_v" USING btree ("version_thumbnail_id");
  CREATE INDEX "_articles_v_version_version_source_i_d_idx" ON ${sql.identifier(databaseSchema())}."_articles_v" USING btree ("version_source_i_d");
  CREATE INDEX "_articles_v_version_version_updated_at_idx" ON ${sql.identifier(databaseSchema())}."_articles_v" USING btree ("version_updated_at");
  CREATE INDEX "_articles_v_version_version_created_at_idx" ON ${sql.identifier(databaseSchema())}."_articles_v" USING btree ("version_created_at");
  CREATE INDEX "_articles_v_version_version__status_idx" ON ${sql.identifier(databaseSchema())}."_articles_v" USING btree ("version__status");
  CREATE INDEX "_articles_v_created_at_idx" ON ${sql.identifier(databaseSchema())}."_articles_v" USING btree ("created_at");
  CREATE INDEX "_articles_v_updated_at_idx" ON ${sql.identifier(databaseSchema())}."_articles_v" USING btree ("updated_at");
  CREATE INDEX "_articles_v_latest_idx" ON ${sql.identifier(databaseSchema())}."_articles_v" USING btree ("latest");
  CREATE UNIQUE INDEX "social_media_platforms_name_idx" ON ${sql.identifier(databaseSchema())}."social_media_platforms" USING btree ("name");
  CREATE UNIQUE INDEX "social_media_platforms_source_i_d_idx" ON ${sql.identifier(databaseSchema())}."social_media_platforms" USING btree ("source_i_d");
  CREATE INDEX "social_media_platforms_updated_at_idx" ON ${sql.identifier(databaseSchema())}."social_media_platforms" USING btree ("updated_at");
  CREATE INDEX "social_media_platforms_created_at_idx" ON ${sql.identifier(databaseSchema())}."social_media_platforms" USING btree ("created_at");
  CREATE INDEX "social_media_platforms__status_idx" ON ${sql.identifier(databaseSchema())}."social_media_platforms" USING btree ("_status");
  CREATE INDEX "_social_media_platforms_v_parent_idx" ON ${sql.identifier(databaseSchema())}."_social_media_platforms_v" USING btree ("parent_id");
  CREATE INDEX "_social_media_platforms_v_version_version_name_idx" ON ${sql.identifier(databaseSchema())}."_social_media_platforms_v" USING btree ("version_name");
  CREATE INDEX "_social_media_platforms_v_version_version_source_i_d_idx" ON ${sql.identifier(databaseSchema())}."_social_media_platforms_v" USING btree ("version_source_i_d");
  CREATE INDEX "_social_media_platforms_v_version_version_updated_at_idx" ON ${sql.identifier(databaseSchema())}."_social_media_platforms_v" USING btree ("version_updated_at");
  CREATE INDEX "_social_media_platforms_v_version_version_created_at_idx" ON ${sql.identifier(databaseSchema())}."_social_media_platforms_v" USING btree ("version_created_at");
  CREATE INDEX "_social_media_platforms_v_version_version__status_idx" ON ${sql.identifier(databaseSchema())}."_social_media_platforms_v" USING btree ("version__status");
  CREATE INDEX "_social_media_platforms_v_created_at_idx" ON ${sql.identifier(databaseSchema())}."_social_media_platforms_v" USING btree ("created_at");
  CREATE INDEX "_social_media_platforms_v_updated_at_idx" ON ${sql.identifier(databaseSchema())}."_social_media_platforms_v" USING btree ("updated_at");
  CREATE INDEX "_social_media_platforms_v_latest_idx" ON ${sql.identifier(databaseSchema())}."_social_media_platforms_v" USING btree ("latest");
  CREATE UNIQUE INDEX "reviews_source_i_d_idx" ON ${sql.identifier(databaseSchema())}."reviews" USING btree ("source_i_d");
  CREATE INDEX "reviews_updated_at_idx" ON ${sql.identifier(databaseSchema())}."reviews" USING btree ("updated_at");
  CREATE INDEX "reviews_created_at_idx" ON ${sql.identifier(databaseSchema())}."reviews" USING btree ("created_at");
  CREATE INDEX "reviews__status_idx" ON ${sql.identifier(databaseSchema())}."reviews" USING btree ("_status");
  CREATE INDEX "_reviews_v_parent_idx" ON ${sql.identifier(databaseSchema())}."_reviews_v" USING btree ("parent_id");
  CREATE INDEX "_reviews_v_version_version_source_i_d_idx" ON ${sql.identifier(databaseSchema())}."_reviews_v" USING btree ("version_source_i_d");
  CREATE INDEX "_reviews_v_version_version_updated_at_idx" ON ${sql.identifier(databaseSchema())}."_reviews_v" USING btree ("version_updated_at");
  CREATE INDEX "_reviews_v_version_version_created_at_idx" ON ${sql.identifier(databaseSchema())}."_reviews_v" USING btree ("version_created_at");
  CREATE INDEX "_reviews_v_version_version__status_idx" ON ${sql.identifier(databaseSchema())}."_reviews_v" USING btree ("version__status");
  CREATE INDEX "_reviews_v_created_at_idx" ON ${sql.identifier(databaseSchema())}."_reviews_v" USING btree ("created_at");
  CREATE INDEX "_reviews_v_updated_at_idx" ON ${sql.identifier(databaseSchema())}."_reviews_v" USING btree ("updated_at");
  CREATE INDEX "_reviews_v_latest_idx" ON ${sql.identifier(databaseSchema())}."_reviews_v" USING btree ("latest");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON ${sql.identifier(databaseSchema())}."payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON ${sql.identifier(databaseSchema())}."payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON ${sql.identifier(databaseSchema())}."payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON ${sql.identifier(databaseSchema())}."payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON ${sql.identifier(databaseSchema())}."payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON ${sql.identifier(databaseSchema())}."payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON ${sql.identifier(databaseSchema())}."payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON ${sql.identifier(databaseSchema())}."payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON ${sql.identifier(databaseSchema())}."payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_seo_media_id_idx" ON ${sql.identifier(databaseSchema())}."payload_locked_documents_rels" USING btree ("seo_media_id");
  CREATE INDEX "payload_locked_documents_rels_services_id_idx" ON ${sql.identifier(databaseSchema())}."payload_locked_documents_rels" USING btree ("services_id");
  CREATE INDEX "payload_locked_documents_rels_new_patient_steps_id_idx" ON ${sql.identifier(databaseSchema())}."payload_locked_documents_rels" USING btree ("new_patient_steps_id");
  CREATE INDEX "payload_locked_documents_rels_articles_id_idx" ON ${sql.identifier(databaseSchema())}."payload_locked_documents_rels" USING btree ("articles_id");
  CREATE INDEX "payload_locked_documents_rels_social_media_platforms_id_idx" ON ${sql.identifier(databaseSchema())}."payload_locked_documents_rels" USING btree ("social_media_platforms_id");
  CREATE INDEX "payload_locked_documents_rels_reviews_id_idx" ON ${sql.identifier(databaseSchema())}."payload_locked_documents_rels" USING btree ("reviews_id");
  CREATE INDEX "payload_preferences_key_idx" ON ${sql.identifier(databaseSchema())}."payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON ${sql.identifier(databaseSchema())}."payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON ${sql.identifier(databaseSchema())}."payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON ${sql.identifier(databaseSchema())}."payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON ${sql.identifier(databaseSchema())}."payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON ${sql.identifier(databaseSchema())}."payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON ${sql.identifier(databaseSchema())}."payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON ${sql.identifier(databaseSchema())}."payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON ${sql.identifier(databaseSchema())}."payload_migrations" USING btree ("created_at");
  CREATE INDEX "business_details_operating_hours_order_idx" ON ${sql.identifier(databaseSchema())}."business_details_operating_hours" USING btree ("_order");
  CREATE INDEX "business_details_operating_hours_parent_id_idx" ON ${sql.identifier(databaseSchema())}."business_details_operating_hours" USING btree ("_parent_id");
  CREATE INDEX "business_details__status_idx" ON ${sql.identifier(databaseSchema())}."business_details" USING btree ("_status");
  CREATE INDEX "_business_details_v_version_operating_hours_order_idx" ON ${sql.identifier(databaseSchema())}."_business_details_v_version_operating_hours" USING btree ("_order");
  CREATE INDEX "_business_details_v_version_operating_hours_parent_id_idx" ON ${sql.identifier(databaseSchema())}."_business_details_v_version_operating_hours" USING btree ("_parent_id");
  CREATE INDEX "_business_details_v_version_version__status_idx" ON ${sql.identifier(databaseSchema())}."_business_details_v" USING btree ("version__status");
  CREATE INDEX "_business_details_v_created_at_idx" ON ${sql.identifier(databaseSchema())}."_business_details_v" USING btree ("created_at");
  CREATE INDEX "_business_details_v_updated_at_idx" ON ${sql.identifier(databaseSchema())}."_business_details_v" USING btree ("updated_at");
  CREATE INDEX "_business_details_v_latest_idx" ON ${sql.identifier(databaseSchema())}."_business_details_v" USING btree ("latest");
  CREATE INDEX "graphics_logo_idx" ON ${sql.identifier(databaseSchema())}."graphics" USING btree ("logo_id");
  CREATE INDEX "graphics_horizontal_logo_idx" ON ${sql.identifier(databaseSchema())}."graphics" USING btree ("horizontal_logo_id");
  CREATE INDEX "graphics_background_graphic_idx" ON ${sql.identifier(databaseSchema())}."graphics" USING btree ("background_graphic_id");
  CREATE INDEX "graphics__status_idx" ON ${sql.identifier(databaseSchema())}."graphics" USING btree ("_status");
  CREATE INDEX "_graphics_v_version_version_logo_idx" ON ${sql.identifier(databaseSchema())}."_graphics_v" USING btree ("version_logo_id");
  CREATE INDEX "_graphics_v_version_version_horizontal_logo_idx" ON ${sql.identifier(databaseSchema())}."_graphics_v" USING btree ("version_horizontal_logo_id");
  CREATE INDEX "_graphics_v_version_version_background_graphic_idx" ON ${sql.identifier(databaseSchema())}."_graphics_v" USING btree ("version_background_graphic_id");
  CREATE INDEX "_graphics_v_version_version__status_idx" ON ${sql.identifier(databaseSchema())}."_graphics_v" USING btree ("version__status");
  CREATE INDEX "_graphics_v_created_at_idx" ON ${sql.identifier(databaseSchema())}."_graphics_v" USING btree ("created_at");
  CREATE INDEX "_graphics_v_updated_at_idx" ON ${sql.identifier(databaseSchema())}."_graphics_v" USING btree ("updated_at");
  CREATE INDEX "_graphics_v_latest_idx" ON ${sql.identifier(databaseSchema())}."_graphics_v" USING btree ("latest");
  CREATE INDEX "home_page_landing_image_idx" ON ${sql.identifier(databaseSchema())}."home_page" USING btree ("landing_image_id");
  CREATE INDEX "home_page_what_to_expect_image_idx" ON ${sql.identifier(databaseSchema())}."home_page" USING btree ("what_to_expect_image_id");
  CREATE INDEX "home_page__status_idx" ON ${sql.identifier(databaseSchema())}."home_page" USING btree ("_status");
  CREATE INDEX "home_page_rels_order_idx" ON ${sql.identifier(databaseSchema())}."home_page_rels" USING btree ("order");
  CREATE INDEX "home_page_rels_parent_idx" ON ${sql.identifier(databaseSchema())}."home_page_rels" USING btree ("parent_id");
  CREATE INDEX "home_page_rels_path_idx" ON ${sql.identifier(databaseSchema())}."home_page_rels" USING btree ("path");
  CREATE INDEX "home_page_rels_seo_media_id_idx" ON ${sql.identifier(databaseSchema())}."home_page_rels" USING btree ("seo_media_id");
  CREATE INDEX "_home_page_v_version_version_landing_image_idx" ON ${sql.identifier(databaseSchema())}."_home_page_v" USING btree ("version_landing_image_id");
  CREATE INDEX "_home_page_v_version_version_what_to_expect_image_idx" ON ${sql.identifier(databaseSchema())}."_home_page_v" USING btree ("version_what_to_expect_image_id");
  CREATE INDEX "_home_page_v_version_version__status_idx" ON ${sql.identifier(databaseSchema())}."_home_page_v" USING btree ("version__status");
  CREATE INDEX "_home_page_v_created_at_idx" ON ${sql.identifier(databaseSchema())}."_home_page_v" USING btree ("created_at");
  CREATE INDEX "_home_page_v_updated_at_idx" ON ${sql.identifier(databaseSchema())}."_home_page_v" USING btree ("updated_at");
  CREATE INDEX "_home_page_v_latest_idx" ON ${sql.identifier(databaseSchema())}."_home_page_v" USING btree ("latest");
  CREATE INDEX "_home_page_v_rels_order_idx" ON ${sql.identifier(databaseSchema())}."_home_page_v_rels" USING btree ("order");
  CREATE INDEX "_home_page_v_rels_parent_idx" ON ${sql.identifier(databaseSchema())}."_home_page_v_rels" USING btree ("parent_id");
  CREATE INDEX "_home_page_v_rels_path_idx" ON ${sql.identifier(databaseSchema())}."_home_page_v_rels" USING btree ("path");
  CREATE INDEX "_home_page_v_rels_seo_media_id_idx" ON ${sql.identifier(databaseSchema())}."_home_page_v_rels" USING btree ("seo_media_id");
  CREATE INDEX "about_us_page_welcome_image_idx" ON ${sql.identifier(databaseSchema())}."about_us_page" USING btree ("welcome_image_id");
  CREATE INDEX "about_us_page_meet_the_chiro_image_idx" ON ${sql.identifier(databaseSchema())}."about_us_page" USING btree ("meet_the_chiro_image_id");
  CREATE INDEX "about_us_page__status_idx" ON ${sql.identifier(databaseSchema())}."about_us_page" USING btree ("_status");
  CREATE INDEX "about_us_page_rels_order_idx" ON ${sql.identifier(databaseSchema())}."about_us_page_rels" USING btree ("order");
  CREATE INDEX "about_us_page_rels_parent_idx" ON ${sql.identifier(databaseSchema())}."about_us_page_rels" USING btree ("parent_id");
  CREATE INDEX "about_us_page_rels_path_idx" ON ${sql.identifier(databaseSchema())}."about_us_page_rels" USING btree ("path");
  CREATE INDEX "about_us_page_rels_media_id_idx" ON ${sql.identifier(databaseSchema())}."about_us_page_rels" USING btree ("media_id");
  CREATE INDEX "about_us_page_rels_seo_media_id_idx" ON ${sql.identifier(databaseSchema())}."about_us_page_rels" USING btree ("seo_media_id");
  CREATE INDEX "_about_us_page_v_version_version_welcome_image_idx" ON ${sql.identifier(databaseSchema())}."_about_us_page_v" USING btree ("version_welcome_image_id");
  CREATE INDEX "_about_us_page_v_version_version_meet_the_chiro_image_idx" ON ${sql.identifier(databaseSchema())}."_about_us_page_v" USING btree ("version_meet_the_chiro_image_id");
  CREATE INDEX "_about_us_page_v_version_version__status_idx" ON ${sql.identifier(databaseSchema())}."_about_us_page_v" USING btree ("version__status");
  CREATE INDEX "_about_us_page_v_created_at_idx" ON ${sql.identifier(databaseSchema())}."_about_us_page_v" USING btree ("created_at");
  CREATE INDEX "_about_us_page_v_updated_at_idx" ON ${sql.identifier(databaseSchema())}."_about_us_page_v" USING btree ("updated_at");
  CREATE INDEX "_about_us_page_v_latest_idx" ON ${sql.identifier(databaseSchema())}."_about_us_page_v" USING btree ("latest");
  CREATE INDEX "_about_us_page_v_rels_order_idx" ON ${sql.identifier(databaseSchema())}."_about_us_page_v_rels" USING btree ("order");
  CREATE INDEX "_about_us_page_v_rels_parent_idx" ON ${sql.identifier(databaseSchema())}."_about_us_page_v_rels" USING btree ("parent_id");
  CREATE INDEX "_about_us_page_v_rels_path_idx" ON ${sql.identifier(databaseSchema())}."_about_us_page_v_rels" USING btree ("path");
  CREATE INDEX "_about_us_page_v_rels_media_id_idx" ON ${sql.identifier(databaseSchema())}."_about_us_page_v_rels" USING btree ("media_id");
  CREATE INDEX "_about_us_page_v_rels_seo_media_id_idx" ON ${sql.identifier(databaseSchema())}."_about_us_page_v_rels" USING btree ("seo_media_id");
  CREATE INDEX "treatment_and_care_page__status_idx" ON ${sql.identifier(databaseSchema())}."treatment_and_care_page" USING btree ("_status");
  CREATE INDEX "treatment_and_care_page_rels_order_idx" ON ${sql.identifier(databaseSchema())}."treatment_and_care_page_rels" USING btree ("order");
  CREATE INDEX "treatment_and_care_page_rels_parent_idx" ON ${sql.identifier(databaseSchema())}."treatment_and_care_page_rels" USING btree ("parent_id");
  CREATE INDEX "treatment_and_care_page_rels_path_idx" ON ${sql.identifier(databaseSchema())}."treatment_and_care_page_rels" USING btree ("path");
  CREATE INDEX "treatment_and_care_page_rels_services_id_idx" ON ${sql.identifier(databaseSchema())}."treatment_and_care_page_rels" USING btree ("services_id");
  CREATE INDEX "treatment_and_care_page_rels_seo_media_id_idx" ON ${sql.identifier(databaseSchema())}."treatment_and_care_page_rels" USING btree ("seo_media_id");
  CREATE INDEX "_treatment_and_care_page_v_version_version__status_idx" ON ${sql.identifier(databaseSchema())}."_treatment_and_care_page_v" USING btree ("version__status");
  CREATE INDEX "_treatment_and_care_page_v_created_at_idx" ON ${sql.identifier(databaseSchema())}."_treatment_and_care_page_v" USING btree ("created_at");
  CREATE INDEX "_treatment_and_care_page_v_updated_at_idx" ON ${sql.identifier(databaseSchema())}."_treatment_and_care_page_v" USING btree ("updated_at");
  CREATE INDEX "_treatment_and_care_page_v_latest_idx" ON ${sql.identifier(databaseSchema())}."_treatment_and_care_page_v" USING btree ("latest");
  CREATE INDEX "_treatment_and_care_page_v_rels_order_idx" ON ${sql.identifier(databaseSchema())}."_treatment_and_care_page_v_rels" USING btree ("order");
  CREATE INDEX "_treatment_and_care_page_v_rels_parent_idx" ON ${sql.identifier(databaseSchema())}."_treatment_and_care_page_v_rels" USING btree ("parent_id");
  CREATE INDEX "_treatment_and_care_page_v_rels_path_idx" ON ${sql.identifier(databaseSchema())}."_treatment_and_care_page_v_rels" USING btree ("path");
  CREATE INDEX "_treatment_and_care_page_v_rels_services_id_idx" ON ${sql.identifier(databaseSchema())}."_treatment_and_care_page_v_rels" USING btree ("services_id");
  CREATE INDEX "_treatment_and_care_page_v_rels_seo_media_id_idx" ON ${sql.identifier(databaseSchema())}."_treatment_and_care_page_v_rels" USING btree ("seo_media_id");
  CREATE INDEX "what_to_expect_page__status_idx" ON ${sql.identifier(databaseSchema())}."what_to_expect_page" USING btree ("_status");
  CREATE INDEX "what_to_expect_page_rels_order_idx" ON ${sql.identifier(databaseSchema())}."what_to_expect_page_rels" USING btree ("order");
  CREATE INDEX "what_to_expect_page_rels_parent_idx" ON ${sql.identifier(databaseSchema())}."what_to_expect_page_rels" USING btree ("parent_id");
  CREATE INDEX "what_to_expect_page_rels_path_idx" ON ${sql.identifier(databaseSchema())}."what_to_expect_page_rels" USING btree ("path");
  CREATE INDEX "what_to_expect_page_rels_new_patient_steps_id_idx" ON ${sql.identifier(databaseSchema())}."what_to_expect_page_rels" USING btree ("new_patient_steps_id");
  CREATE INDEX "what_to_expect_page_rels_seo_media_id_idx" ON ${sql.identifier(databaseSchema())}."what_to_expect_page_rels" USING btree ("seo_media_id");
  CREATE INDEX "_what_to_expect_page_v_version_version__status_idx" ON ${sql.identifier(databaseSchema())}."_what_to_expect_page_v" USING btree ("version__status");
  CREATE INDEX "_what_to_expect_page_v_created_at_idx" ON ${sql.identifier(databaseSchema())}."_what_to_expect_page_v" USING btree ("created_at");
  CREATE INDEX "_what_to_expect_page_v_updated_at_idx" ON ${sql.identifier(databaseSchema())}."_what_to_expect_page_v" USING btree ("updated_at");
  CREATE INDEX "_what_to_expect_page_v_latest_idx" ON ${sql.identifier(databaseSchema())}."_what_to_expect_page_v" USING btree ("latest");
  CREATE INDEX "_what_to_expect_page_v_rels_order_idx" ON ${sql.identifier(databaseSchema())}."_what_to_expect_page_v_rels" USING btree ("order");
  CREATE INDEX "_what_to_expect_page_v_rels_parent_idx" ON ${sql.identifier(databaseSchema())}."_what_to_expect_page_v_rels" USING btree ("parent_id");
  CREATE INDEX "_what_to_expect_page_v_rels_path_idx" ON ${sql.identifier(databaseSchema())}."_what_to_expect_page_v_rels" USING btree ("path");
  CREATE INDEX "_what_to_expect_page_v_rels_new_patient_steps_id_idx" ON ${sql.identifier(databaseSchema())}."_what_to_expect_page_v_rels" USING btree ("new_patient_steps_id");
  CREATE INDEX "_what_to_expect_page_v_rels_seo_media_id_idx" ON ${sql.identifier(databaseSchema())}."_what_to_expect_page_v_rels" USING btree ("seo_media_id");
  CREATE INDEX "contact_us_page__status_idx" ON ${sql.identifier(databaseSchema())}."contact_us_page" USING btree ("_status");
  CREATE INDEX "contact_us_page_rels_order_idx" ON ${sql.identifier(databaseSchema())}."contact_us_page_rels" USING btree ("order");
  CREATE INDEX "contact_us_page_rels_parent_idx" ON ${sql.identifier(databaseSchema())}."contact_us_page_rels" USING btree ("parent_id");
  CREATE INDEX "contact_us_page_rels_path_idx" ON ${sql.identifier(databaseSchema())}."contact_us_page_rels" USING btree ("path");
  CREATE INDEX "contact_us_page_rels_seo_media_id_idx" ON ${sql.identifier(databaseSchema())}."contact_us_page_rels" USING btree ("seo_media_id");
  CREATE INDEX "_contact_us_page_v_version_version__status_idx" ON ${sql.identifier(databaseSchema())}."_contact_us_page_v" USING btree ("version__status");
  CREATE INDEX "_contact_us_page_v_created_at_idx" ON ${sql.identifier(databaseSchema())}."_contact_us_page_v" USING btree ("created_at");
  CREATE INDEX "_contact_us_page_v_updated_at_idx" ON ${sql.identifier(databaseSchema())}."_contact_us_page_v" USING btree ("updated_at");
  CREATE INDEX "_contact_us_page_v_latest_idx" ON ${sql.identifier(databaseSchema())}."_contact_us_page_v" USING btree ("latest");
  CREATE INDEX "_contact_us_page_v_rels_order_idx" ON ${sql.identifier(databaseSchema())}."_contact_us_page_v_rels" USING btree ("order");
  CREATE INDEX "_contact_us_page_v_rels_parent_idx" ON ${sql.identifier(databaseSchema())}."_contact_us_page_v_rels" USING btree ("parent_id");
  CREATE INDEX "_contact_us_page_v_rels_path_idx" ON ${sql.identifier(databaseSchema())}."_contact_us_page_v_rels" USING btree ("path");
  CREATE INDEX "_contact_us_page_v_rels_seo_media_id_idx" ON ${sql.identifier(databaseSchema())}."_contact_us_page_v_rels" USING btree ("seo_media_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE ${sql.identifier(databaseSchema())}."users_roles" CASCADE;
  DROP TABLE ${sql.identifier(databaseSchema())}."users_sessions" CASCADE;
  DROP TABLE ${sql.identifier(databaseSchema())}."users" CASCADE;
  DROP TABLE ${sql.identifier(databaseSchema())}."media" CASCADE;
  DROP TABLE ${sql.identifier(databaseSchema())}."seo_media" CASCADE;
  DROP TABLE ${sql.identifier(databaseSchema())}."services" CASCADE;
  DROP TABLE ${sql.identifier(databaseSchema())}."_services_v" CASCADE;
  DROP TABLE ${sql.identifier(databaseSchema())}."new_patient_steps" CASCADE;
  DROP TABLE ${sql.identifier(databaseSchema())}."_new_patient_steps_v" CASCADE;
  DROP TABLE ${sql.identifier(databaseSchema())}."articles_keywords" CASCADE;
  DROP TABLE ${sql.identifier(databaseSchema())}."articles" CASCADE;
  DROP TABLE ${sql.identifier(databaseSchema())}."_articles_v_version_keywords" CASCADE;
  DROP TABLE ${sql.identifier(databaseSchema())}."_articles_v" CASCADE;
  DROP TABLE ${sql.identifier(databaseSchema())}."social_media_platforms" CASCADE;
  DROP TABLE ${sql.identifier(databaseSchema())}."_social_media_platforms_v" CASCADE;
  DROP TABLE ${sql.identifier(databaseSchema())}."reviews" CASCADE;
  DROP TABLE ${sql.identifier(databaseSchema())}."_reviews_v" CASCADE;
  DROP TABLE ${sql.identifier(databaseSchema())}."payload_kv" CASCADE;
  DROP TABLE ${sql.identifier(databaseSchema())}."payload_locked_documents" CASCADE;
  DROP TABLE ${sql.identifier(databaseSchema())}."payload_locked_documents_rels" CASCADE;
  DROP TABLE ${sql.identifier(databaseSchema())}."payload_preferences" CASCADE;
  DROP TABLE ${sql.identifier(databaseSchema())}."payload_preferences_rels" CASCADE;
  DROP TABLE ${sql.identifier(databaseSchema())}."payload_migrations" CASCADE;
  DROP TABLE ${sql.identifier(databaseSchema())}."business_details_operating_hours" CASCADE;
  DROP TABLE ${sql.identifier(databaseSchema())}."business_details" CASCADE;
  DROP TABLE ${sql.identifier(databaseSchema())}."_business_details_v_version_operating_hours" CASCADE;
  DROP TABLE ${sql.identifier(databaseSchema())}."_business_details_v" CASCADE;
  DROP TABLE ${sql.identifier(databaseSchema())}."graphics" CASCADE;
  DROP TABLE ${sql.identifier(databaseSchema())}."_graphics_v" CASCADE;
  DROP TABLE ${sql.identifier(databaseSchema())}."home_page" CASCADE;
  DROP TABLE ${sql.identifier(databaseSchema())}."home_page_rels" CASCADE;
  DROP TABLE ${sql.identifier(databaseSchema())}."_home_page_v" CASCADE;
  DROP TABLE ${sql.identifier(databaseSchema())}."_home_page_v_rels" CASCADE;
  DROP TABLE ${sql.identifier(databaseSchema())}."about_us_page" CASCADE;
  DROP TABLE ${sql.identifier(databaseSchema())}."about_us_page_rels" CASCADE;
  DROP TABLE ${sql.identifier(databaseSchema())}."_about_us_page_v" CASCADE;
  DROP TABLE ${sql.identifier(databaseSchema())}."_about_us_page_v_rels" CASCADE;
  DROP TABLE ${sql.identifier(databaseSchema())}."treatment_and_care_page" CASCADE;
  DROP TABLE ${sql.identifier(databaseSchema())}."treatment_and_care_page_rels" CASCADE;
  DROP TABLE ${sql.identifier(databaseSchema())}."_treatment_and_care_page_v" CASCADE;
  DROP TABLE ${sql.identifier(databaseSchema())}."_treatment_and_care_page_v_rels" CASCADE;
  DROP TABLE ${sql.identifier(databaseSchema())}."what_to_expect_page" CASCADE;
  DROP TABLE ${sql.identifier(databaseSchema())}."what_to_expect_page_rels" CASCADE;
  DROP TABLE ${sql.identifier(databaseSchema())}."_what_to_expect_page_v" CASCADE;
  DROP TABLE ${sql.identifier(databaseSchema())}."_what_to_expect_page_v_rels" CASCADE;
  DROP TABLE ${sql.identifier(databaseSchema())}."contact_us_page" CASCADE;
  DROP TABLE ${sql.identifier(databaseSchema())}."contact_us_page_rels" CASCADE;
  DROP TABLE ${sql.identifier(databaseSchema())}."_contact_us_page_v" CASCADE;
  DROP TABLE ${sql.identifier(databaseSchema())}."_contact_us_page_v_rels" CASCADE;
  DROP TYPE ${sql.identifier(databaseSchema())}."enum_users_roles";
  DROP TYPE ${sql.identifier(databaseSchema())}."enum_services_status";
  DROP TYPE ${sql.identifier(databaseSchema())}."enum__services_v_version_status";
  DROP TYPE ${sql.identifier(databaseSchema())}."enum_new_patient_steps_status";
  DROP TYPE ${sql.identifier(databaseSchema())}."enum__new_patient_steps_v_version_status";
  DROP TYPE ${sql.identifier(databaseSchema())}."enum_articles_status";
  DROP TYPE ${sql.identifier(databaseSchema())}."enum__articles_v_version_status";
  DROP TYPE ${sql.identifier(databaseSchema())}."enum_social_media_platforms_name";
  DROP TYPE ${sql.identifier(databaseSchema())}."enum_social_media_platforms_status";
  DROP TYPE ${sql.identifier(databaseSchema())}."enum__social_media_platforms_v_version_name";
  DROP TYPE ${sql.identifier(databaseSchema())}."enum__social_media_platforms_v_version_status";
  DROP TYPE ${sql.identifier(databaseSchema())}."enum_reviews_platform";
  DROP TYPE ${sql.identifier(databaseSchema())}."enum_reviews_status";
  DROP TYPE ${sql.identifier(databaseSchema())}."enum__reviews_v_version_platform";
  DROP TYPE ${sql.identifier(databaseSchema())}."enum__reviews_v_version_status";
  DROP TYPE ${sql.identifier(databaseSchema())}."enum_business_details_address_state";
  DROP TYPE ${sql.identifier(databaseSchema())}."enum_business_details_status";
  DROP TYPE ${sql.identifier(databaseSchema())}."enum__business_details_v_version_address_state";
  DROP TYPE ${sql.identifier(databaseSchema())}."enum__business_details_v_version_status";
  DROP TYPE ${sql.identifier(databaseSchema())}."enum_graphics_status";
  DROP TYPE ${sql.identifier(databaseSchema())}."enum__graphics_v_version_status";
  DROP TYPE ${sql.identifier(databaseSchema())}."enum_home_page_status";
  DROP TYPE ${sql.identifier(databaseSchema())}."enum__home_page_v_version_status";
  DROP TYPE ${sql.identifier(databaseSchema())}."enum_about_us_page_status";
  DROP TYPE ${sql.identifier(databaseSchema())}."enum__about_us_page_v_version_status";
  DROP TYPE ${sql.identifier(databaseSchema())}."enum_treatment_and_care_page_status";
  DROP TYPE ${sql.identifier(databaseSchema())}."enum__treatment_and_care_page_v_version_status";
  DROP TYPE ${sql.identifier(databaseSchema())}."enum_what_to_expect_page_status";
  DROP TYPE ${sql.identifier(databaseSchema())}."enum__what_to_expect_page_v_version_status";
  DROP TYPE ${sql.identifier(databaseSchema())}."enum_contact_us_page_status";
  DROP TYPE ${sql.identifier(databaseSchema())}."enum__contact_us_page_v_version_status";`)
}
