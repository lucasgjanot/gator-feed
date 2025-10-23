import { db } from "..";
import { asc, desc, inArray } from "drizzle-orm";
import { NewPost, posts } from "../schema";
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

export async function getPostsForUser(userName: string) {
    const following = await getFollowing(userName);
    if (following.length === 0) {
        console.log('User does not follow any feeds');
        return;
    }
    const result = await db
        .select()
        .from(posts)
        .where(inArray(posts.feedId, following.map((feed) => feed.feedId)))
        .orderBy(desc(posts.publishedAt));
}