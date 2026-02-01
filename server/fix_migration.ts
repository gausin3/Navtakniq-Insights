
import { db } from "./db";
import { sql } from "drizzle-orm";

async function main() {
    console.log("Fixing migration...");
    // Drop the default value first to avoid issues with type change if default checks conflict
    await db.execute(sql`ALTER TABLE blog_posts ALTER COLUMN is_published DROP DEFAULT`);

    // Alter type using casting
    await db.execute(sql`ALTER TABLE blog_posts ALTER COLUMN is_published TYPE boolean USING is_published::boolean`);

    // Set default back to true
    await db.execute(sql`ALTER TABLE blog_posts ALTER COLUMN is_published SET DEFAULT true`);

    console.log("Migration fixed.");
    process.exit(0);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
