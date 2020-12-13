import { NextApiRequest, NextApiResponse } from "next";
import puppeteer from "puppeteer";

const ENDPOINT = `https://github-contributions-curve.ttzztztz.vercel.app/`;

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { window, username } = req.query;

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(`${ENDPOINT}/image/${window}/${username}`);
  const binary = await page.screenshot({ encoding: "binary" });
  await browser.close();

  res.write(binary);
};
