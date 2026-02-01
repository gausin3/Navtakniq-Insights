import { pgTable, text, serial, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

/**
 * @fileoverview Defines the database schema and Zod validation schemas.
 * Shared between client and server to ensure type safety.
 */

// === TABLE DEFINITIONS ===

/**
 * Contact Messages table definition.
 * Stores inquiries submitted via the contact form.
 */
export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  company: text("company"),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

/**
 * Images table definition.
 * Stores metadata for uploaded images.
 */
export const images = pgTable("images", {
  id: serial("id").primaryKey(),
  url: text("url").notNull(),
  altText: text("alt_text").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

/**
 * Blog Posts table definition.
 * Stores content for the insights/blog section.
 */
export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  summary: text("summary").notNull(),
  content: text("content").notNull(), // Markdown content
  coverImage: text("cover_image").notNull(),
  isPublished: boolean("is_published").default(true).notNull(),
  publishedAt: timestamp("published_at").defaultNow(),
});

// Using boolean for isPublished. Drizzle supports it. 
// Re-defining blogPosts correctly.

// === SCHEMAS ===
export const insertContactMessageSchema = createInsertSchema(contactMessages).omit({
  id: true,
  createdAt: true
});

export const insertBlogPostSchema = createInsertSchema(blogPosts, {
  isPublished: z.boolean().optional(),
}).omit({
  id: true,
  publishedAt: true
});

export const insertImageSchema = createInsertSchema(images).omit({
  id: true,
  createdAt: true
});

// === EXPLICIT API CONTRACT TYPES ===
export type ContactMessage = typeof contactMessages.$inferSelect;
export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;

export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;

export type Image = typeof images.$inferSelect;
export type InsertImage = z.infer<typeof insertImageSchema>;
