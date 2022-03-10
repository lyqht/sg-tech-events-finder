# sg-tech-events-finder

This is a simple Node.js app to scrape the Meetup website to find Tech groups in Singapore, and the upcoming events for them.

This is still a WIP.

- [x] Scrape results from Meetup SG Tech Groups
- [ ] Parse events RSS

## Demo

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

You can use the eventsUrl here to check for upcoming events. If you can't find any in the XML file, that means that group has no upcoming events.
## Limitations

A minority of RSS urls the app gives you may say that you don't have auth to access. That is probably something that needs to configured by that group's admin.