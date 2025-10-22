
import { db } from "..";
import { feeds } from "../schema";
import { firstOrUndefined } from "./utils";

export async function createFeed(name: string, url: string, userId: string) {
    try {
        const result = await db
            .insert(feeds)
            .values({name,url,userId})
            .returning();

        return firstOrUndefined(result);
    } catch (err) {
        if ((err as Error).message.includes('Failed query: insert into "feeds"')) {
        throw new Error(`Feed already exists`);
        }
        throw err;
  }
}

export async function getFeeds() {
    const result = await db.select().from(feeds);
    return result;
}

export type Feed = typeof feeds.$inferSelect;
