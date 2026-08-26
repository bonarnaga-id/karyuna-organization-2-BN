import {
  boolean,
  date,
  integer,
  jsonb,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", [
  "SUPER_ADMIN",
  "ADMIN_ORGANISASI",
  "KETUA",
  "SEKRETARIS",
  "BENDAHARA",
  "KOORDINATOR_BIDANG",
  "ANGGOTA",
]);

export const genderEnum = pgEnum("gender", ["LAKI_LAKI", "PEREMPUAN"]);
export const memberStatusEnum = pgEnum("member_status", ["AKTIF", "NONAKTIF", "ALUMNI"]);
export const activityStatusEnum = pgEnum("activity_status", ["DRAF", "TERJADWAL", "BERJALAN", "SELESAI", "DIBATALKAN"]);
export const transactionTypeEnum = pgEnum("transaction_type", ["PEMASUKAN", "PENGELUARAN"]);
export const approvalStatusEnum = pgEnum("approval_status", ["MENUNGGU", "DISETUJUI", "DITOLAK"]);
export const letterTypeEnum = pgEnum("letter_type", ["MASUK", "KELUAR"]);
export const documentTypeEnum = pgEnum("document_type", ["PROPOSAL", "LAPORAN", "DOKUMEN", "BUKTI_TRANSAKSI", "FOTO"]);

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 160 }).notNull(),
  email: varchar("email", { length: 180 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: roleEnum("role").notNull().default("ANGGOTA"),
  isActive: boolean("is_active").notNull().default(true),
  lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const members = pgTable("members", {
  id: uuid("id").primaryKey().defaultRandom(),
  memberNumber: varchar("member_number", { length: 60 }).notNull().unique(),
  fullName: varchar("full_name", { length: 180 }).notNull(),
  birthPlace: varchar("birth_place", { length: 120 }).notNull(),
  birthDate: date("birth_date").notNull(),
  gender: genderEnum("gender").notNull(),
  address: text("address").notNull(),
  phone: varchar("phone", { length: 40 }).notNull(),
  email: varchar("email", { length: 180 }),
  education: varchar("education", { length: 120 }),
  occupation: varchar("occupation", { length: 120 }),
  skills: text("skills"),
  joinedAt: date("joined_at").notNull(),
  status: memberStatusEnum("status").notNull().default("AKTIF"),
  photoUrl: text("photo_url"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const organizationPositions = pgTable("organization_positions", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 140 }).notNull(),
  field: varchar("field", { length: 140 }),
  memberId: uuid("member_id").references(() => members.id),
  orderNumber: integer("order_number").notNull().default(0),
  period: varchar("period", { length: 80 }).notNull().default("2026-2029"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const activities = pgTable("activities", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 200 }).notNull(),
  description: text("description").notNull(),
  location: varchar("location", { length: 200 }).notNull(),
  startsAt: timestamp("starts_at", { withTimezone: true }).notNull(),
  endsAt: timestamp("ends_at", { withTimezone: true }),
  responsibleUserId: uuid("responsible_user_id").references(() => users.id),
  committee: jsonb("committee").$type<string[]>().notNull().default([]),
  budget: numeric("budget", { precision: 14, scale: 2 }).notNull().default("0"),
  participants: jsonb("participants").$type<string[]>().notNull().default([]),
  attendanceSummary: jsonb("attendance_summary").$type<Record<string, number>>().notNull().default({}),
  documentationUrls: jsonb("documentation_urls").$type<string[]>().notNull().default([]),
  proposalUrl: text("proposal_url"),
  reportUrl: text("report_url"),
  status: activityStatusEnum("status").notNull().default("DRAF"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const attendances = pgTable("attendances", {
  id: uuid("id").primaryKey().defaultRandom(),
  activityId: uuid("activity_id").notNull().references(() => activities.id),
  memberId: uuid("member_id").notNull().references(() => members.id),
  status: varchar("status", { length: 40 }).notNull().default("HADIR"),
  checkedAt: timestamp("checked_at", { withTimezone: true }).defaultNow().notNull(),
  note: text("note"),
});

export const documents = pgTable("documents", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 200 }).notNull(),
  type: documentTypeEnum("type").notNull().default("DOKUMEN"),
  fileUrl: text("file_url").notNull(),
  fileSize: integer("file_size").notNull().default(0),
  mimeType: varchar("mime_type", { length: 120 }).notNull().default("application/pdf"),
  uploadedBy: uuid("uploaded_by").references(() => users.id),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const letters = pgTable("letters", {
  id: uuid("id").primaryKey().defaultRandom(),
  type: letterTypeEnum("type").notNull(),
  number: varchar("number", { length: 120 }).notNull(),
  subject: varchar("subject", { length: 220 }).notNull(),
  sender: varchar("sender", { length: 180 }),
  recipient: varchar("recipient", { length: 180 }),
  letterDate: date("letter_date").notNull(),
  fileUrl: text("file_url"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const announcements = pgTable("announcements", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 220 }).notNull(),
  content: text("content").notNull(),
  isPublished: boolean("is_published").notNull().default(true),
  createdBy: uuid("created_by").references(() => users.id),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const financeTransactions = pgTable("finance_transactions", {
  id: uuid("id").primaryKey().defaultRandom(),
  transactionDate: date("transaction_date").notNull(),
  type: transactionTypeEnum("type").notNull(),
  category: varchar("category", { length: 120 }).notNull(),
  amount: numeric("amount", { precision: 14, scale: 2 }).notNull(),
  fundingSource: varchar("funding_source", { length: 160 }),
  description: text("description").notNull(),
  proofUrl: text("proof_url"),
  approvalStatus: approvalStatusEnum("approval_status").notNull().default("MENUNGGU"),
  changeHistory: jsonb("change_history").$type<Array<Record<string, string>>>().notNull().default([]),
  createdBy: uuid("created_by").references(() => users.id),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const appSettings = pgTable("app_settings", {
  key: varchar("key", { length: 120 }).primaryKey(),
  value: jsonb("value").$type<unknown>().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const auditLogs = pgTable("audit_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id),
  action: varchar("action", { length: 120 }).notNull(),
  entity: varchar("entity", { length: 120 }).notNull(),
  entityId: varchar("entity_id", { length: 140 }),
  ipAddress: varchar("ip_address", { length: 80 }),
  userAgent: text("user_agent"),
  metadata: jsonb("metadata").$type<Record<string, unknown>>().notNull().default({}),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export type UserRole = (typeof roleEnum.enumValues)[number];
