/**
 * @fileoverview Main Entry Point for Local Development.
 * Starts a traditional Node.js server listening on a port.
 * NOT used in Vercel production (see api/index.ts).
 */
import { createApp, log } from "./app_factory.js";

(async () => {
  const { httpServer } = await createApp();

  const port = parseInt(process.env.PORT || "5000", 10);
  httpServer.listen(
    {
      port,
      host: "0.0.0.0",
    },
    () => {
      log(`serving on port ${port}`);
    },
  );
})();
