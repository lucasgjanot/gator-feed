import { ConsoleLogWriter } from "drizzle-orm";
import { url } from "inspector";
import { threadCpuUsage } from "process";
import { readConfig } from "src/config";
import { createFeed, Feed, getFeedByUrl, getFeeds } from "src/lib/db/queries/feeds";
import { createFeedFollow, deleteFeedFollow, getFollowing } from "src/lib/db/queries/feedfollow";
import { getUserById, User } from "src/lib/db/queries/users";

export async function handlerFollowing(cmdName: string, user: User, ...args: string[]) {
  if (args.length !== 0) {
      throw new Error(`usage: ${cmdName}`);
  }
  const feeds = await getFollowing(user.name);
  if (feeds.length === 0) {
    console.log(`User: ${user.name} is not following any feeds`);
    return;
  }
  for (const feed of feeds) {
    console.log(`* ${feed.feedName}`);
  }
}

export async function handlerUnfollow(cmdName: string, user: User, ...args: string[]) {
  if (args.length !== 1) {
      throw new Error(`usage: ${cmdName} <url>`);
  }
  const url = args[0];
  const feed = await getFeedByUrl(url);
  if (!feed) {
    throw Error(`Feed for ${url} not found`);
  }
  const result = await deleteFeedFollow(user.id, url)
  if (!result) {
    console.log(`User ${user.name} does not follow ${feed.name}`);
    return;
  }
  console.log(`${user.name} unfollowed feed ${feed.name}`);
}


export async function handlerFollow(cmdName: string, user: User, ...args: string[]) {
  if (args.length !== 1) {
      throw new Error(`usage: ${cmdName} <url>`);
  }
  const url = args[0];

  const feed = await getFeedByUrl(url);
  if (!feed) {
    throw new Error(`Feed for ${url} not found`);
  }

  const result = await createFeedFollow(user.id,feed.id);
  if (!result) {
    throw new Error(`Error to follow feed ${url}`);
  }
  console.log(`User: ${result.userName} is now following Feed: ${result.feedName} `);
}


export async function handlerAddFeed(cmdName: string, user: User ,...args: string[]) {
  if (args.length !== 2) {
    throw new Error(`usage: ${cmdName} <feed_name> <url>`);
  }

  const feedName = args[0];
  const url = args[1];

  const feed = await createFeed(feedName,url,user.id);
  if (!feed) {
    throw new Error(`Failed to create feed`);
  }
  console.log("Feed created successfully:");
  printFeed(feed, user);
  const result = await createFeedFollow(user.id, feed.id)
  if (!result) {
    throw new Error(`Error to follow feed ${url} for ${user.name}`);
  }
  console.log(`User: ${result.userName} is now following Feed: ${result.feedName}`);
}

function printFeed(feed: Feed, user: User) {
  console.log(`* ID:            ${feed.id}`);
  console.log(`* Created:       ${feed.createdAt}`);
  console.log(`* Updated:       ${feed.updatedAt}`);
  console.log(`* name:          ${feed.name}`);
  console.log(`* URL:           ${feed.url}`);
  console.log(`* User:          ${user.name}`);
}

export async function handlerFeeds(cmdName: string, ...args: string[]) {
    if (args.length != 0) {
        throw new Error(`usage: ${cmdName}`);
    }
    const result = await getFeeds();
    if (result.length === 0) {
        throw new Error("There are no feeds in the database");
    }
    for (const feed of result) {
        const user = await getUserById(feed.userId);
        console.log(`* Name: ${feed.name}\n  Url: ${feed.url}\n  Createdby: ${user?.name}\n`);
    }
}

