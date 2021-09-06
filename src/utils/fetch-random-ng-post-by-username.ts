import puppeteer, { Page } from "puppeteer";
import { promisify } from "util";

export interface NGPostData {
  imgPath?: string;
  postContent: string;
  postLink?: string;
  userImgURL?: string;
  userHomeUrl?: string;
  threadName?: string;
}

const wait = promisify(setTimeout);

/**
 * Fetches content of a specified Newgrounds user's random BBS post.
 * @param username A valid newgrounds username.
 * @returns Content of a random post the user has made.
 */
export async function GetSomeBitches(
  username: string
): Promise<NGPostData | null> {
  const imgPath = "pod-content/pod-body.png";
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
  // ! There doesn't necesarily have to be pagination on a page
  let hasPagination = false;
  const pageNavSelector = ".pagenav";
  try {
    await page.waitForSelector(pageNavSelector, {
      timeout: selctorTimeoutDuration,
    });

    hasPagination = true;
  } catch (e) {
    // await browser.close();
    console.error(e);

    // throw new Error(timeoutErrResponse);
  }
  if (hasPagination) {
    const pagenavElHandle = await page.$(pageNavSelector);
    if (!pagenavElHandle) return null; // TODO: handle the case if a page doesn't exist
    // Get an array of all the pagination elements, we'll need to use the last one to determine what's the max amount of
    // pages to choose from randomly

    const pagenavAnchorsSpansSelector = "a span";
    try {
      await page.waitForSelector(pagenavAnchorsSpansSelector, {
        timeout: selctorTimeoutDuration,
      });
    } catch (e) {
      await browser.close();
      console.error(e);

      throw new Error(timeoutErrResponse);
    }
    const pagenavAnchorsSpansText = await pagenavElHandle.$$eval(
      pagenavAnchorsSpansSelector,
      (anchorsSpans) => anchorsSpans.map((anchorSpan) => anchorSpan.textContent)
    );

    console.log(
      `Max num pages: ${
        pagenavAnchorsSpansText[pagenavAnchorsSpansText.length - 1]
      }`
    );
    //TODO: might want to handle case if something goes wrong fetching the max number of pages
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
      `https://www.newgrounds.com/bbs/search/author/${username}/${randomPageNum}`,
      { waitUntil: "networkidle0" }
    );
  }

  // * select a random post

  // get all the pod bodies with ql-posts then shift the first one because currently it's just the pagination
  const podbodiesSelector = ".body-guts > .column .pod .pod-body";
  try {
    await page.waitForSelector(podbodiesSelector, {
      timeout: selctorTimeoutDuration,
    });
  } catch (e) {
    await browser.close();
    console.error(e);

    throw new Error(timeoutErrResponse);
  }
  const podbodies = await page.$$(podbodiesSelector);
  // remove the first and last podBodies because they contain pagination and not anything post related
  podbodies.shift();
  podbodies.pop();
  console.log(podbodies);

  const randomPodInd = Math.floor(Math.random() * podbodies.length);

  // get a randomPostBody
  const randomPodBody = podbodies[randomPodInd];

  if (!randomPodBody) return null; // TODO handle the case where the postBody is null

  // Depending on when a post was made the selector for a bbs post content could either be .ql-body or .bbs-post-body
  // The logic from here is used to determine whcih one is available for use
  let validContentBodySelector;
  // try for the qlbody
  const qlbodySelector = ".ql-body";
  try {
    await page.waitForSelector(qlbodySelector, {
      timeout: 3000, // keep it short for now
    });

    validContentBodySelector = qlbodySelector;
  } catch (e) {
    // await browser.close();
    console.error(e);
    console.log("uh");

    // ! throw error on fallback
    // throw new Error(timeoutErrResponse);
  }

  //else try for bbs-post-body
  const bbsPostBodySelector = ".bbs-post-body";
  if (!validContentBodySelector) {
    try {
      await page.waitForSelector(bbsPostBodySelector, {
        timeout: selctorTimeoutDuration,
      });
      validContentBodySelector = bbsPostBodySelector;
    } catch (e) {
      await browser.close();
      console.error(e);

      // ! all known selectors have been tried but not found, throw error and exit this function
      throw new Error(timeoutErrResponse);
    }
  }

  if (!validContentBodySelector) {
    throw new Error(
      "A valid selector couldn't be found to fetch the post content from."
    );
  }

  // currently just get the content of the post
  const postContent = await randomPodBody.$eval(
    validContentBodySelector,
    (contentBody) => {
      contentBody.scrollIntoView();
      return contentBody.textContent;
    }
  );
  // conveniently enough the thread name is also directly in the anchor tage
  const { postLink, threadName } = await randomPodBody.$eval("a", (a) => ({
    postLink: (a as HTMLLinkElement).href,
    threadName: a.textContent!,
  }));

  // give a second for the image to load
  await wait(1000);
  const podBodyContent = await randomPodBody.screenshot({
    path: imgPath,
  });

  // we've got whatn we wanted, close everything
  // const exampleContent = await page.screenshot({ path: "example.png" });

  await browser.close();

  // Return the cotent of the post for later use
  if (!postContent) return null;
  return {
    ...{ postContent, imgPath, postLink, threadName },
  };
}

async function autoScroll(page: Page) {
  await page.evaluate(
    `(async () => {
      await new Promise((resolve, reject) => {
          var totalHeight = 0;
          var distance = 100;
          var timer = setInterval(() => {
              var scrollHeight = document.body.scrollHeight;
              window.scrollBy(0, distance);
              totalHeight += distance;

              if(totalHeight >= scrollHeight){
                  clearInterval(timer);
                  resolve();
              }
          }, 500);
      });
  })()`
  );
}
