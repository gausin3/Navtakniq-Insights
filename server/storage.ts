import { db } from "./db.js";
import {
  contactMessages,
  blogPosts,
  type ContactMessage,
  type InsertContactMessage,
  type BlogPost,
  type InsertBlogPost
} from "../shared/schema.js";
import { eq, desc } from "drizzle-orm";

/**
 * @fileoverview Data Access Layer (Storage).
 * Abstract interface and concrete implementation for database operations.
 */

/**
 * Interface defining all storage operations.
 * Allows for easy mocking/testing if needed.
 */
export interface IStorage {
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  getBlogPosts(): Promise<BlogPost[]>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
}

/**
 * Concrete implementation of IStorage using Drizzle ORM and Postgres.
 */
export class DatabaseStorage implements IStorage {
  async createContactMessage(message: InsertContactMessage): Promise<ContactMessage> {
    const [newMessage] = await db
      .insert(contactMessages)
      .values(message)
      .returning();
    return newMessage;
  }

  async getBlogPosts(): Promise<BlogPost[]> {
    return await db
      .select()
      .from(blogPosts)
      .orderBy(desc(blogPosts.publishedAt));
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    const [post] = await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.slug, slug));
    return post;
  }

  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    const [newPost] = await db
      .insert(blogPosts)
      .values(post)
      .returning();
    return newPost;
  }
}

export const storage = new DatabaseStorage();
