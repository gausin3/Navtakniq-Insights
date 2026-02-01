import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage.js";
import { api } from "../shared/routes.js";
import { insertBlogPostSchema, changePasswordSchema, updateUserRoleSchema } from "../shared/schema.js";
import { z } from "zod";
import multer from "multer";
import path from "path";
import fs from "fs";
import { hashPassword, comparePasswords } from "./auth.js";

// Configure multer for disk storage
const uploadDir = path.join(process.cwd(), "client", "public", "uploads");

// Ensure the upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storageConfig = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storageConfig });

import passport from "passport";

/**
 * @fileoverview Server-side Route Definitions.
 * Maps API endpoints to their handler logic using the shared API contract.
 */

/**
 * Seeds the database with initial blog posts if empty.
 */
async function seedDatabase() {
  const existingPosts = await storage.getBlogPosts();
  if (existingPosts.length === 0) {
    console.log("Seeding blog posts...");
    // ... seed data ...
    console.log("Seeding complete.");
  }
}

/**
 * Registers all API routes on the Express application.
 * @param httpServer - The HTTP server instance.
 * @param app - The Express app instance.
 * @returns The HTTP server instance.
 */
export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Seed the database on startup
  seedDatabase().catch((err) => {
    console.error("Failed to seed database:", err);
  });

  // Image Upload Endpoint
  app.post("/api/upload", upload.single("image"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const imageUrl = `/uploads/${req.file.filename}`;
      const image = await storage.createImage({
        url: imageUrl,
        altText: req.body.altText || req.file.originalname,
      });

      res.status(201).json(image);
    } catch (err) {
      console.error("Upload error:", err);
      res.status(500).json({ message: "Failed to upload image" });
    }
  });

  // Get Images List Endpoint
  app.get("/api/images", async (req, res) => {
    try {
      const images = await storage.getImages();
      res.json(images);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch images" });
    }
  });

  app.post("/api/register", async (req, res, next) => {
    try {
      const existingUser = await storage.getUserByUsername(req.body.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      const hashedPassword = await hashPassword(req.body.password);
      const user = await storage.createUser({
        ...req.body,
        password: hashedPassword,
      });
      req.login(user, (err) => {
        if (err) return next(err);
        res.status(201).json(user);
      });
    } catch (err) {
      next(err);
    }
  });

  app.post("/api/login", passport.authenticate("local"), (req, res) => {
    res.json(req.user);
  });

  app.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });

  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    res.json(req.user);
  });

  app.post("/api/user/password", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    try {
      const { currentPassword, newPassword } = changePasswordSchema.parse(req.body);
      const user = req.user as any;

      // Verify current password
      const dbUser = await storage.getUser(user.id);
      if (!dbUser) return res.sendStatus(401);

      if (!(await comparePasswords(currentPassword, dbUser.password))) {
        return res.status(400).json({ message: "Incorrect current password" });
      }

      const hashedPassword = await hashPassword(newPassword);
      await storage.updateUserPassword(user.id, hashedPassword);

      res.sendStatus(200);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid input", errors: err.errors });
      } else {
        res.status(500).json({ message: "Failed to update password" });
      }
    }
  });

  // --- Admin User Management Routes ---

  // Get all users
  app.get("/api/users", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const user = req.user as any;
    if (user.role !== "admin") return res.sendStatus(403);

    const users = await storage.getUsers();
    res.json(users);
  });

  // Create new user (Admin)
  app.post("/api/users", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const currentUser = req.user as any;
    if (currentUser.role !== "admin") return res.sendStatus(403);

    try {
      const existingUser = await storage.getUserByUsername(req.body.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      const hashedPassword = await hashPassword(req.body.password);
      const newUser = await storage.createUser({
        ...req.body,
        password: hashedPassword,
      });
      res.status(201).json(newUser);
    } catch (err) {
      res.status(500).json({ message: "Failed to create user" });
    }
  });

  // Update user role
  app.patch("/api/users/:id/role", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const currentUser = req.user as any;
    if (currentUser.role !== "admin") return res.sendStatus(403);

    try {
      const id = parseInt(req.params.id);
      const { role } = updateUserRoleSchema.parse(req.body);

      // Prevent changing own role to user (lockout protection)
      if (currentUser.id === id && role === "user") {
        return res.status(400).json({ message: "Cannot remove your own admin privileges" });
      }

      await storage.updateUserRole(id, role);
      res.sendStatus(200);
    } catch (err) {
      res.status(500).json({ message: "Failed to update role" });
    }
  });

  // Admin Reset Password
  app.patch("/api/users/:id/password", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const currentUser = req.user as any;
    if (currentUser.role !== "admin") return res.sendStatus(403);

    try {
      const id = parseInt(req.params.id);
      const { newPassword } = changePasswordSchema.pick({ newPassword: true }).parse(req.body);

      const hashedPassword = await hashPassword(newPassword);
      await storage.updateUserPassword(id, hashedPassword);
      res.sendStatus(200);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid input", errors: err.errors });
      } else {
        res.status(500).json({ message: "Failed to reset password" });
      }
    }
  });


  // Contact Form Endpoint
  app.post(api.contact.submit.path, async (req, res) => {
    try {
      const input = api.contact.submit.input.parse(req.body);
      const message = await storage.createContactMessage(input);
      res.status(200).json(message);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  // Get Contact Messages Endpoint
  app.get(api.contact.list.path, async (req, res) => {
    try {
      const messages = await storage.getContactMessages();
      res.json(messages);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch contact messages" });
    }
  });

  // Blog Posts List Endpoint
  app.get(api.posts.list.path, async (req, res) => {
    const publishedOnly = req.query.published === 'true';
    const posts = await storage.getBlogPosts(publishedOnly);
    res.json(posts);
  });

  // Blog Post Detail Endpoint
  app.get(api.posts.get.path, async (req, res) => {
    const slug = req.params.slug;
    if (typeof slug !== 'string') {
      return res.status(400).json({ message: "Invalid slug" });
    }
    const post = await storage.getBlogPostBySlug(slug);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.json(post);
  });

  // Create Blog Post Endpoint
  app.post(api.posts.list.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    try {
      const input = insertBlogPostSchema.parse(req.body);
      const user = req.user as any;

      // Force draft if not admin
      if (user.role !== "admin") {
        input.isPublished = false;
      }

      const newPost = await storage.createBlogPost(input);
      res.status(201).json(newPost);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid input", errors: err.errors });
      } else {
        res.status(500).json({ message: "Failed to create post" });
      }
    }
  });

  // Update Blog Post Endpoint
  app.patch(api.posts.list.path + "/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const user = req.user as any;

    // Only Admin can update posts (approval workflow)
    // Theoretically users could edit their own drafts, but keeping it simple as per request
    if (user.role !== "admin") return res.sendStatus(403);

    try {
      const id = parseInt(req.params.id as string);
      if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });

      const input = insertBlogPostSchema.partial().parse(req.body);
      const updatedPost = await storage.updateBlogPost(id, input);
      res.json(updatedPost);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid input", errors: err.errors });
      } else {
        res.status(404).json({ message: "Post not found or failed to update" });
      }
    }
  });

  // Delete Blog Post Endpoint
  app.delete(api.posts.list.path + "/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const user = req.user as any;

    if (user.role !== "admin") return res.sendStatus(403);

    try {
      const id = parseInt(req.params.id as string);
      if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });

      await storage.deleteBlogPost(id);
      res.status(204).end();
    } catch (err) {
      res.status(500).json({ message: "Failed to delete post" });
    }
  });

  return httpServer;
}
