import { db } from "..";
import { feedFollows, feeds, users } from "../schema";
import { eq } from "drizzle-orm";
import { firstOrUndefined } from "./utils";
import { getUserById, getUserByName } from "./users";
import { getFeedById, getFeedByUrl } from "./feeds";

export async function createFeedFollow(userId: string, feedId: string) {
    const [newFeedFollow] = await db
    .insert(feedFollows)
    .values({ userId, feedId })
    .onConflictDoNothing({ target: [feedFollows.userId, feedFollows.feedId] })
    .returning();

    const user = await getUserById(userId);
    if (!user) {
        throw new Error(`User not found`);
    }
    const feed = await getFeedById(feedId);
    if (!feed) {
        throw new Error(`Feed not found`);
    }
    if (!newFeedFollow) {
        throw new Error(`User ${user.name} already follows Feed ${feed.name}`);
    }
    const query = await db
        .select({userId:feedFollows.userId, feedId: feedFollows.feedId, userName: users.name, feedName: feeds.name, feedUrl: feeds.url})
        .from(feedFollows)
        .innerJoin(feeds, eq(feedFollows.feedId, feeds.id))
        .innerJoin(users, eq(feedFollows.userId, users.id))
        .where(eq(users.id,userId));
    return firstOrUndefined(query);
}


export async function getFollowing(userName: string) {
    const query = await db
    .select({feedName:feeds.name, feedId: feeds.id})
    .from(feedFollows)
    .innerJoin(users, eq(feedFollows.userId,users.id))
    .innerJoin(feeds, eq(feedFollows.feedId,feeds.id))
    .where(eq(users.name,userName));

    return query;
}

export async function deleteFeedFollow(userId: string, url: string) {
    const feed = await getFeedByUrl(url);
    if (!feed) {
        throw new Error(`feed for ${url} not found`);
    }
    const result = await db
        .delete(feedFollows).where(eq(feedFollows.userId, userId) && eq(feedFollows.feedId, feed.id)).returning();
    return firstOrUndefined(result);
}
