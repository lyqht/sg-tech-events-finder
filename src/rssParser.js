import Parser from 'rss-parser'
import dayjs from 'dayjs';
const parser = new Parser();

export const parseRSS = async (url) => {
  try {
    let feed = await parser.parseURL(url);
  
    if (!feed.items) {
      console.warn(`No items found for ${feed.title}, skipping this feed.`)
    }
  
    return {
      events: feed.items || []
    } 
  } catch (error) {
    console.warn(`${error.message} for ${url}`)
    return {
      events: []
    }
  }
};

export const getOnlyUpcomingEvents = (items) => {
  return items.filter(item => dayjs(item.pubDate).isAfter(dayjs()))
}