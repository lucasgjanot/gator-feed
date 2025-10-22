import { db } from "..";
import { feedFollows, feeds, users } from "../schema";
import { eq } from "drizzle-orm";

export async function createFeedFollow(userId: string, feedId: string) {
    const [newFeedFollow] = await db.insert(feedFollows).values({userId,feedId})
    const query = await db
        .select({userId:feedFollows.userId, feedId: feedFollows.feedId, userName: users.name, feedName: feeds.name, feedUrl: feeds.url})
        .from(feedFollows)
        .innerJoin(feeds, eq(feedFollows.feedId, feeds.id))
        .innerJoin(users, eq(feedFollows.userId, users.id))
    return query
}