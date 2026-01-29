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
