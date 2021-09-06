import puppeteer from "puppeteer";

(async () => {
  try {
    console.log(await GetSomeBitches("Homicide"));
  } catch (e) {
    console.error(`Whoops, something went wrong`);
    console.error(e);
  }
})();

async function GetSomeBitches(username: string): Promise<string> {
  const selctorTimeoutDuration = 10000;
  const TempErrorResponse =
    "An error occured.  You could've entered an invalid name, Newgrounds could be down or one tiny thing on the site changed causing everyhing to fail 🤷‍♀️";
  const timeoutErrResponse =
    `The page took too long to load and timed out.  Current timeout duration: ${
      selctorTimeoutDuration / 1000
    } seconds ` + TempErrorResponse;
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(`https://www.newgrounds.com/bbs/search/author/${username}`);

  // select a random page
  const pageNavSelector = ".pagenav";
  try {
    await page.waitForSelector(pageNavSelector, {
      timeout: selctorTimeoutDuration,
    });
  } catch (e) {
    await browser.close();
    return timeoutErrResponse;
  }

  const pagenavElHandle = await page.$(pageNavSelector);
  if (!pagenavElHandle) return TempErrorResponse; // TODO: handle the case if a page doesn't exist
  // Get an array of all the pagination elements, we'll need to use the last one to determine what's the max amount of
  // pages to choose from randomly

  const pagenavAnchorsSpansSelector = "a span";
  try {
    await page.waitForSelector(pagenavAnchorsSpansSelector, {
      timeout: selctorTimeoutDuration,
    });
  } catch (e) {
    await browser.close();
    return timeoutErrResponse;
  }
  const pagenavAnchorsSpansText = await pagenavElHandle.$$eval(
    pagenavAnchorsSpansSelector,
    (anchorsSpans) => anchorsSpans.map((anchorSpan) => anchorSpan.textContent)
  );

  // console.log(
  //   `Max num pages: ${
  //     pagenavAnchorsSpansText[pagenavAnchorsSpansText.length - 1]
  //   }`
  // );
  //TODO: might want to handle case if something goes wrong fetching the max number of pages
  if (!pagenavAnchorsSpansText[pagenavAnchorsSpansText.length - 1])
    return TempErrorResponse;
  // Parse the last pagination element as a number so it can be later used to select a random page
  const maxNumPages = parseInt(
    pagenavAnchorsSpansText[pagenavAnchorsSpansText.length - 1]!
  );
  // Getting random index from the range of pages available
  const randomPageNum = Math.ceil(
    Math.random() * pagenavAnchorsSpansText.length
  );

  // Go to a random page
  await page.goto(
    `https://www.newgrounds.com/bbs/search/author/${username}/${randomPageNum}`
  );

  // * select a random post

  // get all the pod bodies with ql-posts then shift the first one because currently it's just the pagination
  const podbodySelector = ".body-guts > .column .pod .pod-body";
  try {
    await page.waitForSelector(podbodySelector, {
      timeout: selctorTimeoutDuration,
    });
  } catch (e) {
    await browser.close();
    return timeoutErrResponse;
  }
  const podbodies = await page.$$(".body-guts > .column .pod .pod-body");
  podbodies.shift();

  // get a randomPostBody
  const randomPostBody =
    podbodies[Math.floor(Math.random() * podbodies.length)];

  // currently just get the content of the post
  if (!randomPostBody) return TempErrorResponse; // TODO handle the case where the postBody is null
  const postContent = await randomPostBody.$eval(
    ".ql-body",
    (qlBody) => qlBody.textContent
  );
  // we've got whatn we wanted, close everything
  const exampleContent = await page.screenshot({ path: "example.png" });

  await browser.close();

  // Return the cotent of the post for later use
  if (!postContent)
    return TempErrorResponse;
  return postContent;
}
