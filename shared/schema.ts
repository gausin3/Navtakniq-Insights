import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// === TABLE DEFINITIONS ===
export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  company: text("company"),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  summary: text("summary").notNull(),
  content: text("content").notNull(), // Markdown content
  coverImage: text("cover_image").notNull(),
  publishedAt: timestamp("published_at").defaultNow(),
});

// === SCHEMAS ===
export const insertContactMessageSchema = createInsertSchema(contactMessages).omit({ 
  id: true, 
  createdAt: true 
});

export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({ 
  id: true, 
  publishedAt: true 
});

// === EXPLICIT API CONTRACT TYPES ===
export type ContactMessage = typeof contactMessages.$inferSelect;
export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;

export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
