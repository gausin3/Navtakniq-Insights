import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage.js";
import { api } from "../shared/routes.js";
import { z } from "zod";

async function seedDatabase() {
  const existingPosts = await storage.getBlogPosts();
  if (existingPosts.length === 0) {
    console.log("Seeding blog posts...");
    await storage.createBlogPost({
      slug: "importance-of-data-governance-in-ai",
      title: "The Importance of Data Governance in AI",
      summary: "Why robust data governance is critical for successful AI implementation.",
      content: `
# The Importance of Data Governance in AI

Artificial Intelligence is only as good as the data it is trained on. In today's data-driven world, organizations are rushing to implement AI solutions, but many overlook the foundational element: **Data Governance**.

## Why It Matters

Without proper governance, AI models can become biased, inaccurate, or even dangerous. Data governance ensures that data is:
- **Accurate**: Free from errors and inconsistencies.
- **Secure**: Protected from unauthorized access.
- **Compliant**: Adhering to regulations like GDPR and CCPA.

## Key Pillars

1. **Data Quality**: Ensuring data is fit for purpose.
2. **Data Stewardship**: Assigning accountability for data assets.
3. **Data Security**: Protecting data integrity and privacy.

At **Navtakniq**, we help you build a robust data governance framework that empowers your AI initiatives.
      `,
      coverImage: "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?auto=format&fit=crop&q=80&w=1000",
    });

    await storage.createBlogPost({
      slug: "master-data-management-foundation",
      title: "Master Data Management: The Foundation",
      summary: "How MDM serves as the backbone of your digital transformation journey.",
      content: `
# Master Data Management: The Foundation

Master Data Management (MDM) is the process of defining and managing the critical data of an organization to provide a single point of reference.

## The Single Source of Truth

In a complex enterprise, data is often siloed across different departments. Sales has one view of the customer, marketing has another, and support has a third. MDM consolidates these views into a **Golden Record**.

## Benefits of MDM

- **Improved Decision Making**: Reliable data leads to better insights.
- **Operational Efficiency**: Streamlined processes and reduced errors.
- **Regulatory Compliance**: Easier reporting and auditing.

Don't let data silos hold you back. Let **Navtakniq** guide your MDM strategy.
      `,
      coverImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1000",
    });

    await storage.createBlogPost({
      slug: "navigating-data-quality-challenges",
      title: "Navigating Data Quality Challenges",
      summary: "Strategies for identifying and resolving data quality issues in your organization.",
      content: `
# Navigating Data Quality Challenges

Bad data costs organizations millions of dollars every year. From lost revenue to damaged reputation, the impact of poor data quality is far-reaching.

## Common Data Quality Issues

- **Incompleteness**: Missing values in critical fields.
- **Inconsistency**: Different formats for the same data (e.g., date formats).
- **Duplication**: Multiple records for the same entity.

## Our Approach

We use advanced tools and methodologies to profile, cleanse, and monitor your data. Our goal is to ensure your data is a strategic asset, not a liability.

Contact **Navtakniq** today to start your data quality journey.
      `,
      coverImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000",
    });
    console.log("Seeding complete.");
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Seed the database on startup
  seedDatabase().catch((err) => {
    console.error("Failed to seed database:", err);
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

  // Blog Posts List Endpoint
  app.get(api.posts.list.path, async (req, res) => {
    const posts = await storage.getBlogPosts();
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

  return httpServer;
}
