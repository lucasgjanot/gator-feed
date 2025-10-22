import { fetchFeed, RSSFeed } from "src/lib/rss";

export async function handlerAgg(cmdName:string, ...args: string[]) {
  if (args.length !== 0) {
    throw new Error("Reset command expects no arguments");
  }
  const feed: RSSFeed = await fetchFeed("https://www.wagslane.dev/index.xml");
  console.log(JSON.stringify(feed, null, 2));
}