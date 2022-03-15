import fs from 'fs'

export const groupsPath = "demo/groups.json"
export const eventsPath = "demo/eventsFromRss.json"

// NOTE: all of these functions are intended to be used for development to replace the need for saving data to db
// when integrating to events-api, we will have to rewritte these methods to crud from db instead.

export const cacheExists = (path) => fs.existsSync(path)

export const getFromCache = (path) => {
    const data = fs.readFileSync(path)
    return JSON.parse(data)
}

export const writeToCache = (path, obj) => {
    fs.writeFileSync(path, JSON.stringify(obj))
}
