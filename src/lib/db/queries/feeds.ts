
import { db } from "..";
import { feeds } from "../schema";
import { eq, notBetween, sql } from "drizzle-orm";
import { firstOrUndefined } from "./utils";
import { syncBuiltinESMExports } from "module";
import { debugPort } from "process";
import { resourceLimits } from "worker_threads";


export async function markFeedFetched(feedId: string) {
    const result = await db
        .update(feeds).set({lastFetchedAt: new Date()}).where(eq(feeds.id,feedId)).returning();
    return firstOrUndefined(result);
}

export async function getNextFeedToFetch() {
    const result = await db
        .select()
        .from(feeds)
        .orderBy(sql`${feeds.lastFetchedAt} desc nulls first`)
        .limit(1);
    return firstOrUndefined(result);
}

export async function createFeed(name: string, url: string, userId: string) {

    const [result] = await db
        .insert(feeds)
        .values({name,url,userId})
        .onConflictDoNothing({ target: feeds.url })
        .returning();

    if (!result) {
    throw new Error(`Feed with URL "${url}" already exists`);
    }

    return result;
}

export async function getFeeds() {
    const result = await db.select().from(feeds);
    return result;
}


export async function getFeedByUrl(url: string) {
    const result = await db.select().from(feeds).where(eq(feeds.url,url));
    return firstOrUndefined(result);
}

export async function getFeedById(id: string) {
    const result = await db.select().from(feeds).where(eq(feeds.id,id));
    return firstOrUndefined(result);
}

export type Feed = typeof feeds.$inferSelect;


