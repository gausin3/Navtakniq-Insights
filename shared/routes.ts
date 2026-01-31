import { z } from 'zod';
import { insertContactMessageSchema, insertBlogPostSchema, contactMessages, blogPosts } from './schema.js';

/**
 * @fileoverview Defines the API contract, routes, and shared utilities.
 * Acts as the source of truth for API communication between client and server.
 */

// === SHARED ERROR SCHEMAS ===
export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

// === API CONTRACT ===
/**
 * Centralized API route definitions.
 * Includes paths, methods, input schemas (Zod), and response types.
 */
export const api = {
  contact: {
    submit: {
      method: 'POST' as const,
      path: '/api/contact',
      input: insertContactMessageSchema,
      responses: {
        200: z.custom<typeof contactMessages.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
  },
  posts: {
    list: {
      method: 'GET' as const,
      path: '/api/posts',
      responses: {
        200: z.array(z.custom<typeof blogPosts.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/posts/:slug',
      responses: {
        200: z.custom<typeof blogPosts.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
  },
};

/**
 * Utility to replace path parameters (e.g., :slug) with actual values.
 * @param path - The URL path pattern.
 * @param params - Object containing parameter values.
 * @returns The constructed URL.
 */
export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
