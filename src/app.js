import 'dotenv/config';
import { cacheExists, eventsFromRssPath, eventsPath, getFromCache, groupsPath, writeToCache } from "./cache.js";
import { parseRSS } from "./rssParser.js";
import { fetchMeetupGroups } from "./scraper.js";
import { getEventDetails } from "./eventParser.js"
import axios from 'axios'

if (process.env.NODE_ENV === "development") {
    axios.interceptors.request.use(request => {
        console.debug('Starting Request to:', request.url)
        return request
    })

    axios.interceptors.response.use(response => {
        console.debug('Received response: ', response.status)
        return response
    })
}

let groupsWithRss = {};
let groupEvents = {};
let allEvents = [];

if (cacheExists(groupsPath)) {
    groupsWithRss = getFromCache(groupsPath)
    console.log(`Retrieving group details from cache: ${Object.keys(groupsWithRss).length}`)
} else {
    groupsWithRss = await fetchMeetupGroups();
    writeToCache(groupsPath, groupsWithRss)
}

if (cacheExists(eventsFromRssPath)) {
    groupEvents = getFromCache(eventsFromRssPath)
    console.log(`Retrieving events sorted by groups from cache: ${Object.keys(groupsWithRss).length}`)
} else {
    for (const [groupName, groupDetails] of Object.entries(groupsWithRss)) {
        const result = await parseRSS(groupDetails.eventsUrl)
        groupEvents[groupName] = result.events
    }
    console.log(JSON.stringify(groupEvents))
    writeToCache(eventsFromRssPath, groupEvents)
}

if (cacheExists(eventsPath)) {
    allEvents = getFromCache(eventsPath)
    console.log(`Retrieving all events from cache: ${Object.keys(formattedGroupEvents).length}`)
} else {

    const requestsToMake = []

    for (const listsOfGroupEvents of Object.values(groupEvents)) {
        for (const event of listsOfGroupEvents) {
            console.log(`Getting event details for ${event.title}`)
            requestsToMake.push(getEventDetails(event.guid))
        }
    }

    Promise.all(requestsToMake).then(allEventDetails => {
        allEvents = allEventDetails
        console.log(`Total events parsed: ${allEvents.length}`)
        writeToCache(eventsPath, allEvents)
    })
}

