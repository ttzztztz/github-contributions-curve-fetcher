import chrome from "chrome-aws-lambda";
import { NextApiRequest, NextApiResponse } from "next";
import puppeteer from "puppeteer-core";
import { cacheGet, cacheSet } from "../../../../lib/store";

const ENDPOINT = `https://github-contributions-curve.ttzztztz.vercel.app/`;
const NODE_ENV = process.env.NODE_ENV;

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { window, username } = req.query;
  const key = `${window}-${username}`;
  const _cache = cacheGet(key);

  if (_cache) {
    res.setHeader("Content-Type", "image/png");
    res.send(_cache);
    return;
  }

  const browser = await puppeteer.launch(
    NODE_ENV === "development"
      ? {
          executablePath: "/usr/bin/chromium",
        }
      : {
          args: chrome.args,
          executablePath: await chrome.executablePath,
          headless: chrome.headless,
        }
  );
  const page = await browser.newPage();
  await page.goto(`${ENDPOINT}/image/${window}/${username}`);

  const canvasURL = await page.evaluate(() => {
    const element: HTMLCanvasElement = document.querySelector(
      "#chart-area canvas"
    );
    return element.toDataURL('image/png', 1.0);
  });
  await page.close();

  const canvasBuffer = Buffer.from(
    canvasURL.replace("data:image/png;base64,", ""),
    "base64"
  );
  res.setHeader("Content-Type", "image/png");
  cacheSet(key, canvasBuffer, Date.now() + 2 * 60 * 60 * 1000);
  res.send(canvasBuffer);
};
