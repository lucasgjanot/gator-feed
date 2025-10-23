import { XMLParser } from "fast-xml-parser";


export type RSSFeed = {
  channel: {
    title: string;
    link: string;
    description: string;
    item: RSSItem[];
  };
};

type RSSItem = {
  title: string;
  link: string;
  description: string;
  pubDate: string;
};

export async function fetchFeed(feedUrl: string) : Promise<RSSFeed> {
    if (!feedUrl) {
        throw new Error("A feddURL must be specified");
    }
    const response = await fetch(feedUrl,{
        headers: {
            "User-Agent":"gator"
        }
    });

    const xml = await response.text();
    const parser = new XMLParser();
    let result = parser.parse(xml);

    const channel = result.rss?.channel;
    if (!channel) {
        throw new Error("failed to parse channel");
    }

    if(!channel||!channel.title || !channel.link || !channel.description) {
        throw new Error("failed to parse channel");
    }

    const items: any[] = Array.isArray(channel.item)
    ? channel.item
    : [channel.item];

    const rssItems: RSSItem[] = [];

    for (const item of items) {
        if (!item.title || !item.link || !item.description || !item.pubDate) {
            continue;
        }

        rssItems.push({
        title: item.title,
        link: item.link,
        description: item.description,
        pubDate: item.pubDate,

        });
    }
    const rss: RSSFeed = {
        channel: {
        title: channel.title,
        link: channel.link,
        description: channel.description,
        item: rssItems,
        },
    };
    return rss;
}