import { sql } from "drizzle-orm";
import { index, integer, primaryKey, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(), email: text("email").notNull().unique(), name: text("name").notNull(),
  role: text("role", { enum: ["admin", "editor"] }).notNull().default("editor"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`), updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});
export const categories = sqliteTable("categories", {
  id: integer("id").primaryKey({ autoIncrement: true }), name: text("name").notNull(), slug: text("slug").notNull().unique(),
  description: text("description").notNull().default(""), color: text("color").notNull().default("#f06f5f"), createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});
export const tags = sqliteTable("tags", { id: integer("id").primaryKey({ autoIncrement: true }), name: text("name").notNull(), slug: text("slug").notNull().unique(), createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`) });
export const media = sqliteTable("media", {
  id: integer("id").primaryKey({ autoIncrement: true }), objectKey: text("object_key").notNull().unique(), fileName: text("file_name").notNull(), mimeType: text("mime_type").notNull(), size: integer("size").notNull(),
  altText: text("alt_text").notNull().default(""), caption: text("caption").notNull().default(""), createdBy: text("created_by").references(() => users.id), createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});
export const contentItems = sqliteTable("content_items", {
  id: integer("id").primaryKey({ autoIncrement: true }), type: text("type", { enum: ["article", "note", "film", "place"] }).notNull(), title: text("title").notNull(), slug: text("slug").notNull(),
  subtitle: text("subtitle").notNull().default(""), excerpt: text("excerpt").notNull().default(""), bodyHtml: text("body_html").notNull().default(""), status: text("status", { enum: ["draft", "published"] }).notNull().default("draft"),
  categoryId: integer("category_id").references(() => categories.id), authorId: text("author_id").references(() => users.id), featuredImageId: integer("featured_image_id").references(() => media.id), galleryJson: text("gallery_json").notNull().default("[]"), fieldsJson: text("fields_json").notNull().default("{}"),
  seoTitle: text("seo_title").notNull().default(""), seoDescription: text("seo_description").notNull().default(""), socialImageId: integer("social_image_id").references(() => media.id), featured: integer("featured", { mode: "boolean" }).notNull().default(false),
  publishedAt: text("published_at"), createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`), updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [uniqueIndex("idx_content_type_slug").on(table.type, table.slug), index("idx_content_status_published").on(table.status, table.publishedAt), index("idx_content_category_status").on(table.categoryId, table.status)]);
export const contentTags = sqliteTable("content_tags", { contentId: integer("content_id").notNull().references(() => contentItems.id, { onDelete: "cascade" }), tagId: integer("tag_id").notNull().references(() => tags.id, { onDelete: "cascade" }) }, (table) => [primaryKey({ columns: [table.contentId, table.tagId] })]);
export const relatedContent = sqliteTable("related_content", { contentId: integer("content_id").notNull().references(() => contentItems.id, { onDelete: "cascade" }), relatedId: integer("related_id").notNull().references(() => contentItems.id, { onDelete: "cascade" }) }, (table) => [primaryKey({ columns: [table.contentId, table.relatedId] })]);
export const settings = sqliteTable("settings", { key: text("key").primaryKey(), value: text("value").notNull(), updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`) });
export const activity = sqliteTable("activity", {
  id: integer("id").primaryKey({ autoIncrement: true }), userId: text("user_id").references(() => users.id), action: text("action").notNull(), entityType: text("entity_type").notNull(), entityId: text("entity_id").notNull(), detail: text("detail").notNull().default(""), createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [index("idx_activity_created").on(table.createdAt)]);
