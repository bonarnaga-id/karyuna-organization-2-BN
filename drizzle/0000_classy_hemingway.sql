CREATE TYPE "public"."activity_status" AS ENUM('DRAF', 'TERJADWAL', 'BERJALAN', 'SELESAI', 'DIBATALKAN');--> statement-breakpoint
CREATE TYPE "public"."approval_status" AS ENUM('MENUNGGU', 'DISETUJUI', 'DITOLAK');--> statement-breakpoint
CREATE TYPE "public"."document_type" AS ENUM('PROPOSAL', 'LAPORAN', 'DOKUMEN', 'BUKTI_TRANSAKSI', 'FOTO');--> statement-breakpoint
CREATE TYPE "public"."gender" AS ENUM('LAKI_LAKI', 'PEREMPUAN');--> statement-breakpoint
CREATE TYPE "public"."letter_type" AS ENUM('MASUK', 'KELUAR');--> statement-breakpoint
CREATE TYPE "public"."member_status" AS ENUM('AKTIF', 'NONAKTIF', 'ALUMNI');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('SUPER_ADMIN', 'ADMIN_ORGANISASI', 'KETUA', 'SEKRETARIS', 'BENDAHARA', 'KOORDINATOR_BIDANG', 'ANGGOTA');--> statement-breakpoint
CREATE TYPE "public"."transaction_type" AS ENUM('PEMASUKAN', 'PENGELUARAN');--> statement-breakpoint
CREATE TABLE "activities" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(200) NOT NULL,
	"description" text NOT NULL,
	"location" varchar(200) NOT NULL,
	"starts_at" timestamp with time zone NOT NULL,
	"ends_at" timestamp with time zone,
	"responsible_user_id" uuid,
	"committee" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"budget" numeric(14, 2) DEFAULT '0' NOT NULL,
	"participants" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"attendance_summary" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"documentation_urls" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"proposal_url" text,
	"report_url" text,
	"status" "activity_status" DEFAULT 'DRAF' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "announcements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(220) NOT NULL,
	"content" text NOT NULL,
	"is_published" boolean DEFAULT true NOT NULL,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "app_settings" (
	"key" varchar(120) PRIMARY KEY NOT NULL,
	"value" jsonb NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "attendances" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"activity_id" uuid NOT NULL,
	"member_id" uuid NOT NULL,
	"status" varchar(40) DEFAULT 'HADIR' NOT NULL,
	"checked_at" timestamp with time zone DEFAULT now() NOT NULL,
	"note" text
);
--> statement-breakpoint
CREATE TABLE "audit_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"action" varchar(120) NOT NULL,
	"entity" varchar(120) NOT NULL,
	"entity_id" varchar(140),
	"ip_address" varchar(80),
	"user_agent" text,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "documents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(200) NOT NULL,
	"type" "document_type" DEFAULT 'DOKUMEN' NOT NULL,
	"file_url" text NOT NULL,
	"file_size" integer DEFAULT 0 NOT NULL,
	"mime_type" varchar(120) DEFAULT 'application/pdf' NOT NULL,
	"uploaded_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "finance_transactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"transaction_date" date NOT NULL,
	"type" "transaction_type" NOT NULL,
	"category" varchar(120) NOT NULL,
	"amount" numeric(14, 2) NOT NULL,
	"funding_source" varchar(160),
	"description" text NOT NULL,
	"proof_url" text,
	"approval_status" "approval_status" DEFAULT 'MENUNGGU' NOT NULL,
	"change_history" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "letters" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type" "letter_type" NOT NULL,
	"number" varchar(120) NOT NULL,
	"subject" varchar(220) NOT NULL,
	"sender" varchar(180),
	"recipient" varchar(180),
	"letter_date" date NOT NULL,
	"file_url" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "members" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"member_number" varchar(60) NOT NULL,
	"full_name" varchar(180) NOT NULL,
	"birth_place" varchar(120) NOT NULL,
	"birth_date" date NOT NULL,
	"gender" "gender" NOT NULL,
	"address" text NOT NULL,
	"phone" varchar(40) NOT NULL,
	"email" varchar(180),
	"education" varchar(120),
	"occupation" varchar(120),
	"skills" text,
	"joined_at" date NOT NULL,
	"status" "member_status" DEFAULT 'AKTIF' NOT NULL,
	"photo_url" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "members_member_number_unique" UNIQUE("member_number")
);
--> statement-breakpoint
CREATE TABLE "organization_positions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(140) NOT NULL,
	"field" varchar(140),
	"member_id" uuid,
	"order_number" integer DEFAULT 0 NOT NULL,
	"period" varchar(80) DEFAULT '2026-2029' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(160) NOT NULL,
	"email" varchar(180) NOT NULL,
	"password_hash" text NOT NULL,
	"role" "role" DEFAULT 'ANGGOTA' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"last_login_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "activities" ADD CONSTRAINT "activities_responsible_user_id_users_id_fk" FOREIGN KEY ("responsible_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "announcements" ADD CONSTRAINT "announcements_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attendances" ADD CONSTRAINT "attendances_activity_id_activities_id_fk" FOREIGN KEY ("activity_id") REFERENCES "public"."activities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attendances" ADD CONSTRAINT "attendances_member_id_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."members"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "documents" ADD CONSTRAINT "documents_uploaded_by_users_id_fk" FOREIGN KEY ("uploaded_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "finance_transactions" ADD CONSTRAINT "finance_transactions_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organization_positions" ADD CONSTRAINT "organization_positions_member_id_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."members"("id") ON DELETE no action ON UPDATE no action;