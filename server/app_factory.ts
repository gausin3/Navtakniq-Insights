import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes.js";
import { serveStatic } from "./static.js";
import { createServer, type Server } from "http";

/**
 * @fileoverview Express Application Factory.
 * Creates and configures the Express application instance.
 * Separated from the entry point to allow usage in both local server and Vercel serverless functions.
 */

declare module "http" {
    interface IncomingMessage {
        rawBody: unknown;
    }
}

export function log(message: string, source = "express") {
    const formattedTime = new Date().toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
    });

    console.log(`${formattedTime} [${source}] ${message}`);
}

/**
 * Creates the Express application and HTTP server.
 * Sets up middleware (logging, JSON parsing) and registers routes.
 * @returns An object containing the Express app and the HTTP server instance.
 */
export async function createApp() {
    const app = express();
    const httpServer = createServer(app);

    app.use(
        express.json({
            verify: (req, _res, buf) => {
                req.rawBody = buf;
            },
        }),
    );

    app.use(express.urlencoded({ extended: false }));

    app.use((req, res, next) => {
        const start = Date.now();
        const path = req.path;
        let capturedJsonResponse: Record<string, any> | undefined = undefined;

        const originalResJson = res.json;
        res.json = function (bodyJson, ...args) {
            capturedJsonResponse = bodyJson;
            return originalResJson.apply(res, [bodyJson, ...args]);
        };

        res.on("finish", () => {
            const duration = Date.now() - start;
            if (path.startsWith("/api")) {
                let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
                if (capturedJsonResponse) {
                    logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
                }

                log(logLine);
            }
        });

        next();
    });

    await registerRoutes(httpServer, app);

    app.use((err: any, _req: Request, res: Response, next: NextFunction) => {
        const status = err.status || err.statusCode || 500;
        const message = err.message || "Internal Server Error";

        console.error("Internal Server Error:", err);

        if (res.headersSent) {
            return next(err);
        }

        return res.status(status).json({ message });
    });

    // importantly only setup vite in development and after
    // setting up all the other routes so the catch-all route
    // doesn't interfere with the other routes
    if (process.env.NODE_ENV === "production") {
        serveStatic(app);
    } else {
        // We only import vite setup in development to avoid bundling it in production
        // if we were to strictly separate dev/prod deps. 
        // However, for Vercel, NODE_ENV is usually production.
        const { setupVite } = await import("./vite.js");
        await setupVite(httpServer, app);
    }

    return { app, httpServer };
}
