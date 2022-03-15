import axios from "axios"
import { JSDOM } from 'jsdom'

export const getEventDetails = async (eventGuid) => {
    const response = await axios.get(eventGuid)
    if (response.status != 200) {
        return
    }
    const {data} = response
    const dom = new JSDOM(data)
    const nextData = JSON.parse(dom.window.document.getElementById("__NEXT_DATA__").innerHTML)
    
    const { title, eventUrl, dateTime, endTime, isOnline, howToFindUs, group } = nextData.props.pageProps.event;

    return {
        title,
        eventUrl,
        startTime: dateTime,
        endTime: endTime,
        isOnline,
        venue: howToFindUs,
        groupName: group.name
    }
}