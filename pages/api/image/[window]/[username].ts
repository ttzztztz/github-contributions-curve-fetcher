import chrome from "chrome-aws-lambda";
import { NextApiRequest, NextApiResponse } from "next";
import puppeteer from "puppeteer-core";

const ENDPOINT = `https://github-contributions-curve.ttzztztz.vercel.app/`;

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { window, username } = req.query;

  const browser = await puppeteer.launch({
    // args: chrome.args,
    // executablePath: await chrome.executablePath,
    // headless: chrome.headless,
    executablePath: "/usr/bin/chromium",
  });
  const page = await browser.newPage();
  await page.goto(`${ENDPOINT}/image/${window}/${username}`);
  const binary = await page.screenshot({ encoding: "binary" });
  await page.close();

  res.setHeader("Content-Type", "image/png");
  res.write(binary, () => {
    res.destroy();
  });
};
