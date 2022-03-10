import scrape from "website-scraper";
import SaveToExistingDirectoryPlugin from "website-scraper-existing-directory";

const allGroups = {};

class CustomPlugin {
  apply(registerAction) {
    registerAction("saveResource", ({ resource }) => {
      /* this function is added so that the website resources are not actually saved in memory like /cache */
    });
    registerAction("onResourceSaved", ({ resource }) => {
      const { url, filename } = resource;
      if (filename === 'index.html') {
          return;
      }
      const groupKey = filename.replace(".html", "").split("-").join(" ");
      const formattedUrl = url.replace(/\/\?_cookie.*/, "");
      allGroups[groupKey] = {
        groupUrl: formattedUrl,
        eventsUrl: `${formattedUrl}/events/rss`,
      };
    });
  }
}

const options = {
  urls: [
    "https://www.meetup.com/cities/sg/singapore/tech/?country=sg&zipstatecity=singapore&category_names=tech",
  ],
  directory: "./cache",
  plugins: [new SaveToExistingDirectoryPlugin(), new CustomPlugin()],
  sources: [{ selector: ".groupCard.noRatings>div>a", attr: "href" }],
};

export const getMeetupGroups = async () => {
  await scrape(options);
  console.log(
    `Finished scrapping! ${Object.keys(allGroups).length} groups are found.`
  );
  console.debug(`Here is the full list.`);
  console.debug(JSON.stringify(allGroups));
  return allGroups;
};
