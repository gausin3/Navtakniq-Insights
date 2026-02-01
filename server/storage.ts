import { db } from "./db.js";
import {
  contactMessages,
  blogPosts,
  images,
  type ContactMessage,
  type InsertContactMessage,
  type BlogPost,
  type InsertBlogPost,
  type Image,
  type InsertImage
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
  getContactMessages(): Promise<ContactMessage[]>;
  getBlogPosts(publishedOnly?: boolean): Promise<BlogPost[]>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: number, post: Partial<InsertBlogPost>): Promise<BlogPost>;
  deleteBlogPost(id: number): Promise<void>;
  createImage(image: InsertImage): Promise<Image>;
  getImages(): Promise<Image[]>;
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

  async getContactMessages(): Promise<ContactMessage[]> {
    return await db
      .select()
      .from(contactMessages)
      .orderBy(desc(contactMessages.createdAt));
  }

  async getBlogPosts(publishedOnly = false): Promise<BlogPost[]> {
    const query = db
      .select()
      .from(blogPosts)
      .orderBy(desc(blogPosts.publishedAt));

    if (publishedOnly) {
      query.where(eq(blogPosts.isPublished, true));
    }

    return await query;
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

  async updateBlogPost(id: number, post: Partial<InsertBlogPost>): Promise<BlogPost> {
    const [updatedPost] = await db
      .update(blogPosts)
      .set({ ...post, publishedAt: undefined })
      .where(eq(blogPosts.id, id))
      .returning();

    if (!updatedPost) throw new Error("Post not found");
    return updatedPost;
  }

  async deleteBlogPost(id: number): Promise<void> {
    await db
      .delete(blogPosts)
      .where(eq(blogPosts.id, id));
  }

  async createImage(image: InsertImage): Promise<Image> {
    const [newImage] = await db
      .insert(images)
      .values(image)
      .returning();
    return newImage;
  }

  async getImages(): Promise<Image[]> {
    return await db
      .select()
      .from(images)
      .orderBy(desc(images.createdAt));
  }
}

export const storage = new DatabaseStorage();
