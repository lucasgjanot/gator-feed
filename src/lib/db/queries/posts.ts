import { db } from "..";
import { asc, desc, eq, inArray } from "drizzle-orm";
import { feedFollows, feeds, NewPost, posts } from "../schema";
import { getFollowing } from "./feedfollow";

export type Post = typeof posts.$inferSelect;

export async function createPost(post: NewPost) {
    const [result] = await db
        .insert(posts)
        .values({...post})
        .onConflictDoNothing({ target: posts.url })
        .returning();

    if (!result) {
    throw new Error(`Post with URL "${post.url}" already exists`);
    }

    return result; 
}

export async function getPostsForUser(userId: string, limit: number) {
  const result = await db
    .select({
      id: posts.id,
      createdAt: posts.createdAt,
      updatedAt: posts.updatedAt,
      title: posts.title,
      url: posts.url,
      description: posts.description,
      publishedAt: posts.publishedAt,
      feedId: posts.feedId,
      feedName: feeds.name,
    })
    .from(posts)
    .innerJoin(feedFollows, eq(posts.feedId, feedFollows.feedId))
    .innerJoin(feeds, eq(posts.feedId, feeds.id))
    .where(eq(feedFollows.userId, userId))
    .orderBy(desc(posts.publishedAt))
    .limit(limit);
  return result;
}