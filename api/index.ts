/**
 * @fileoverview Vercel Serverless Function Entry Point.
 * Adapts the Express application to run as a serverless handler.
 * Caches the app instance for performance.
 */
import { createApp } from "../server/app_factory.js";
import type { Request, Response } from "express";

let appPromise: Promise<any> | null = null;

export default async function handler(req: Request, res: Response) {
    if (!appPromise) {
        appPromise = createApp().then((data) => data.app);
    }
    const app = await appPromise;
    app(req, res);
}
