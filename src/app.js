import 'dotenv/config';
import { cacheExists, eventsPath, getFromCache, groupsPath, writeToCache } from "./cache.js";
import { parseRSS } from "./rssParser.js";
import { fetchMeetupGroups } from "./scraper.js";

let groupsWithRss = {};
let groupEvents = {};

if (cacheExists(groupsPath)) {
    groupsWithRss = getFromCache(groupsPath)
    console.log(`Retrieving groups from cache: ${Object.keys(groupsWithRss).length}`)
} else {
    groupsWithRss = await fetchMeetupGroups();
    writeToCache(groupsPath, groupsWithRss)
}

if (cacheExists(eventsPath)) {
    groupEvents = getFromCache(eventsPath)
    console.log(`Retrieving events from cache: ${Object.keys(groupsWithRss).length}`)
} else {
    for (const [groupName, groupDetails] of Object.entries(groupsWithRss)) {
        const result = await parseRSS(groupDetails.eventsUrl)
        groupEvents[groupName] = result.events
    }
    console.log(JSON.stringify(groupEvents))
    writeToCache(eventsPath, groupEvents)
}



