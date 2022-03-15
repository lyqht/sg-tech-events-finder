<!-- omit in toc -->
# sg-tech-events-finder

This is a simple Node.js app to scrape the Meetup website to find Tech groups in Singapore, and the upcoming events for them. 

This is still a WIP.

- [x] Scrape results from Meetup SG Tech Groups
- [x] Parse events RSS to retrieve upcoming events
- [x] Determine event details
- [ ] Sort events by specific date

---

Table of contents

- [Project Goal](#project-goal)
- [Demo](#demo)
  - [Scrape results from Meetup SG Tech Groups](#scrape-results-from-meetup-sg-tech-groups)
  - [Parse events RSS to retrieve upcoming events](#parse-events-rss-to-retrieve-upcoming-events)
  - [Determine event details](#determine-event-details)
    - [Option 1 — Nextjs hydration data](#option-1--nextjs-hydration-data)
    - [Option 2 - Web Scraping](#option-2---web-scraping)
- [Limitations](#limitations)

## Project Goal

In Singapore, many devs rely upon the [DevSG_Skills events telegram](https://t.me/joinchat/BGedIEXk14wejiRXgH7BGw) to search for upcoming events. 

An example of a notification is shown below.

```
🗓 7 Upcoming Events for 03 Jul 2020, Fri 
⏰ 7:00 pm - Improve Monitoring and Observability for Kubernetes with OSS tools (Azure, Office and Data Community (Singapore)) - 📍Online event
⏰ 6:00 pm - Social Coding (Women Who Code Singapore) - 📍GeoHall @ GeoWorks, PSA Building, 460 Alexandra Road #07-01
```

However, since Meetup API has changed to require a paid subscription, the telegram group has stopped showing any events for some time. 

This projects aims to spike and **implement an alternative way to retrieve events from the tech meetup groups in Singapore**.

Before, the backend app [events-api](https://github.com/engineersftw/events-api) has a fetchEvents route for the telegram bot to call to retrieve data of the following format.

```js
{
    id: event.platform_identifier,
    name: event.name,
    description: htmlToText.fromString(event.description),
    location: event.location,
    url: event.url,
    group_id: event.group_id,
    group_name: event.group_name,
    group_url: event.group_url,
    formatted_time: moment(event.start_time).tz('Asia/Singapore').format('DD MMM YYYY, ddd, h:mm a'),
    unix_start_time: moment(event.start_time).unix(),
    start_time: moment(event.start_time).tz('Asia/Singapore').format(),
    end_time: moment(event.end_time).tz('Asia/Singapore').format(),
    platform: event.platform,
    rsvp_count: event.rsvp_count
}
```

## Demo

### Scrape results from Meetup SG Tech Groups

Scrape results can be found in `/demo`. The formatted result is in `groups.json`.

An example of an item found in the list of formatted results

```json
{
    "Tech Talks Thoughtworks Singapore": {
        "groupUrl": "https://www.meetup.com/Tech-Talks-Thoughtworks-Singapore",
        "eventsUrl": "https://www.meetup.com/Tech-Talks-Thoughtworks-Singapore/events/rss"
    },
}
```

They are pretty self-explanatory what they are.

You can use the `eventsUrl` here to check for upcoming events. If you can't find any in the RSS feed, this means that group has no upcoming events.

### Parse events RSS to retrieve upcoming events

The parsed events from the `eventsUrl` result is in `eventsFromRss.json` 

An example of an item found in the list of results 

```json
"Singapore Kafka Meetup": [
        {
            "title": "Cloud Native Apache Kafka®",
            "pubDate": "Wed, 09 Mar 2022 02:51:40 EST",
            "content": "<p><img style=\"float:left; margin-right:4px\" src=\"https://secure.meetupstatic.com/photos/event/6/b/f/1/event_465087633.jpeg\" alt=\"photo\" class=\"photo\" />Singapore Apache Kafka® Meetup by Confluent</p> <p><p>Hello Streamers!</p> <p>Our friends from Serverless Singapore will be hosting this fun and informative meetup!</p> <p>**RSVP and check the link below for more information:**<br/><a href=\"https://www.meetup.com/Serverless-Singapore/events/284319391/\" class=\"linkified\"><a href=\"https://www.meetup.com/Serverless-Singapore/events/284319391/\">https://www.meetup.co...</a></a></p> <p>Find information about upcoming meetups and tons of content from past Apache Kafka® Meetups all over the world:<br/>(<a href=\"https://cnfl.io/meetup-hub\" class=\"linkified\"><a href=\"https://cnfl.io/meetup-hub\">https://cnfl.io/meetup...</a></a>)</p> <p>\\-\\-\\-\\-\\-<br/>Speaker:<br/>Mark Teehan, Principal Solutions Engineer, Confluent</p> <p>Bio:<br/>Mark Teehan is a systems engineer at Confluent in Singapore. In his day-to-day work, Mark engages with organisations that are interested in event streaming, real-time ETL, or anything related to running Apache Kafka systems. Interest in Apache Kafka spans banks, telcos, airlines, digital natives, government departments, insurance, and manufacturing.</p> <p>Talk:<br/>Cloud Native Apache Kafka®</p> <p>Abstract:<br/>Mark will talk about the lessons learned by the Confluent Cloud engineering team from making Apache Kafka serverless as well as deployment decisions to run mission critical Confluent Cloud clusters on any of the major cloud providers in Singapore (or elsewhere).</p> <p>\\-\\-\\-\\-<br/>If you would like to speak or host our next event please let us know! community@(<a href=\"https://confluent.io/\" class=\"linkified\"><a href=\"https://confluent.io/\">https://confluent.io/...</a></a>)</p> </p> <p>Singapore,    - Singapore</p> <p>Thursday, March 17 at 7:00 PM</p> <p>1</p> <p>https://www.meetup.com/Singapore-Kafka-Meetup/events/284501917/</p> ",
            "contentSnippet": "Singapore Apache Kafka® Meetup by Confluent\n \nHello Streamers!\n Our friends from Serverless Singapore will be hosting this fun and informative meetup!\n **RSVP and check the link below for more information:**\nhttps://www.meetup.co...\n Find information about upcoming meetups and tons of content from past Apache Kafka® Meetups all over the world:\n(https://cnfl.io/meetup...)\n \\-\\-\\-\\-\\-\nSpeaker:\nMark Teehan, Principal Solutions Engineer, Confluent\n Bio:\nMark Teehan is a systems engineer at Confluent in Singapore. In his day-to-day work, Mark engages with organisations that are interested in event streaming, real-time ETL, or anything related to running Apache Kafka systems. Interest in Apache Kafka spans banks, telcos, airlines, digital natives, government departments, insurance, and manufacturing.\n Talk:\nCloud Native Apache Kafka®\n Abstract:\nMark will talk about the lessons learned by the Confluent Cloud engineering team from making Apache Kafka serverless as well as deployment decisions to run mission critical Confluent Cloud clusters on any of the major cloud providers in Singapore (or elsewhere).\n \\-\\-\\-\\-\nIf you would like to speak or host our next event please let us know! community@(https://confluent.io/...)\n  \nSingapore,    - Singapore\n Thursday, March 17 at 7:00 PM\n 1\n https://www.meetup.com/Singapore-Kafka-Meetup/events/284501917/",
            "guid": "https://www.meetup.com/Singapore-Kafka-Meetup/events/284501917/",
            "isoDate": "2022-03-09T07:51:40.000Z"
        }
    ],
```

However, unlike usual RSS feeds for articles where we can just rely on the `pubDate` property to know the article's published date, for these events, we cannot determine the event's actual start & end times from these RSS items. They only tell us that these events are upcoming.

### Determine event details

There are a few ways to get the event details. In this project, option 1 is implemented.

#### Option 1 — Nextjs hydration data

To grab the event details, we can login as an **anonymous** user to meetup.com, and to get the event details from `JSON.parse($('#__NEXT_DATA__').innerHTML)`. This utilizes the fact that the meetup site is created with the Next.js framework, and as to why this data exist in the DOM, if you are interested, you can read up [here](https://github.com/vercel/next.js/discussions/15117#:~:text=With%20__NEXT_DATA__%20%2C%20all,a%20performance%20issue%20or%20not.).

An example of such data can be found in `pageProps.json`. The important filtered parts are shown below.

```json
{
    "props": {
        "pageProps": {
            "event": {
                "title": "Getting started with Kubernetes",
                "eventUrl": "https://www.meetup.com/platform-engineers-nyc/events/284092401",
                "dateTime": "2022-03-24T14:00-04:00",
                "endTime": "2022-03-24T15:00-04:00",
                "isOnline": true,
                "howToFindUs": "https://us02web.zoom.us/webinar/register/6316451792552/WN_2Bzx5STATuaM-iBZEZvE5w",
        }
    }
}
```

After formatting the data for each of the events, the results can be found in `eventsFormatted.json`.

An example of a formatted event item

```json
{
    "title": "Open Source Community Day - OSSDayAPJ",
    "eventUrl": "https://www.meetup.com/TIBCO-Singapore/events/283820568",
    "startTime": "2022-03-24T11:00+08:00",
    "endTime": "2022-03-24T14:00+08:00",
    "isOnline": true,
    "venue": "",
    "groupName": "TIBCO Singapore User Group"
},
```

#### Option 2 - Web Scraping

Since we already have the event url from the parsed RSS, we can also visit it directly and just get the relevant event details there from the webpage. These are the selectors if we want to get event details **without requiring the jsdom library** to parse next_data.

```js
const eventStartDateSelector = 'span.eventTimeDisplay-startDate' // <span>Thursday, March 17, 2022</span>
const eventStartDatetimeSelector = 'span.eventTimeDisplay-startDate-time' // <span class="eventTimeDisplay-endDate-partialTime"><span>7:00 PM</span></span>
const eventEndDatetimeSelector = 'span.eventTimeDisplay-endDate-partialTime' // <span class="eventTimeDisplay-endDate-partialTime"><span>8:00 PM</span><span> SST</span></span>
```

However, this option is more flaky in the sense if Meetup website changes the UI, we will need update these selectors.

## Limitations

A minority of RSS urls the app gives you may say that you don't have auth to access. That is probably something that needs to configured by that group's admin. This project has set it to ignore those RSS urls.