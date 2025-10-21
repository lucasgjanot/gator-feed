import { channel } from "diagnostics_channel";
import { XMLParser } from "fast-xml-parser";
import { nextTick } from "process";

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
    const text = await response.text();
    const xmlparser = new XMLParser()
    const xml = xmlparser.parse(text)

    if(!xml.channel) {
        throw new Error("xml must have a channel field");
    }

    if(!(xml.channel.title) || !(xml.channel.link) || !(xml.channel.description)) {
        throw new Error("xml.channel must hava title,link and description fields");
    }

    const title = xml.channel.title;
    const link = xml.channel.link;
    const description = xml.channel.description;

    const items_info: RSSItem[] = []

    if (("item" in xml.channel)) {
        if (!(Array.isArray(xml.channel.item))) {
            xml.channel.item = [];
        }

        for (const item of xml.channel.item) {
            if (!item.title || !item.link || !item.description || !item.pubDate) {
                continue;
            }
            items_info.push({title: item.title, link: item.link, description: item.description, pubDate: item.pubDate})
        }
    }

    return {
        channel: {
            title,
            link,
            description,
            item: items_info,
        }
    }
}