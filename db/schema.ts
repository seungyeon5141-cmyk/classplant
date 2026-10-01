import { integer, real, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const projects = sqliteTable("projects", {
  id: text("id").primaryKey(), classCode: text("class_code").notNull(), studentName: text("student_name").notNull(),
  plantName: text("plant_name").notNull(), ownerName: text("owner_name").notNull(), startDate: text("start_date").notNull(),
  growType: text("grow_type", { enum: ["individual", "group"] }).notNull().default("individual"),
  groupName: text("group_name").notNull().default(""), memberNames: text("member_names").notNull().default(""), ownerRole: text("owner_role", { enum: ["student", "teacher"] }).notNull().default("student"),
  targetDate: text("target_date"), growingLocation: text("growing_location").notNull().default(""), supplies: text("supplies").notNull().default(""),
  seasonNote: text("season_note").notNull().default(""), environmentNote: text("environment_note").notNull().default(""),
  commitment: text("commitment").notNull().default(""), harvestUse: text("harvest_use").notNull().default(""), problems: text("problems").notNull().default(""),
  reflection: text("reflection").notNull().default(""), nextTime: text("next_time").notNull().default(""), completedAt: text("completed_at"),
  createdAt: text("created_at").notNull(), updatedAt: text("updated_at").notNull(),
});

export const observations = sqliteTable("observations", {
  id: text("id").primaryKey(), projectId: text("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
  observedAt: text("observed_at").notNull(), weather: text("weather").notNull().default(""), title: text("title").notNull(), note: text("note").notNull(),
  changes: text("changes").notNull().default(""), heightCm: real("height_cm"), leafCount: integer("leaf_count"), photoKey: text("photo_key"),
  photoName: text("photo_name"), photoType: text("photo_type"), createdAt: text("created_at").notNull(),
});

export const accounts = sqliteTable("accounts", {
  id: text("id").primaryKey(), classCode: text("class_code").notNull(), name: text("name").notNull(),
  role: text("role", { enum: ["student", "teacher"] }).notNull(), pinSalt: text("pin_salt").notNull(), pinHash: text("pin_hash").notNull(),
  mustChangePin: integer("must_change_pin", { mode: "boolean" }).notNull().default(true), failedAttempts: integer("failed_attempts").notNull().default(0),
  lockedUntil: text("locked_until"), createdAt: text("created_at").notNull(), updatedAt: text("updated_at").notNull(),
}, (table) => [uniqueIndex("accounts_class_name_role_unique").on(table.classCode, table.name, table.role)]);

export const sessions = sqliteTable("sessions", {
  id: text("id").primaryKey(), accountId: text("account_id").notNull().references(() => accounts.id, { onDelete: "cascade" }),
  tokenHash: text("token_hash").notNull().unique(), expiresAt: text("expires_at").notNull(), createdAt: text("created_at").notNull(),
});
