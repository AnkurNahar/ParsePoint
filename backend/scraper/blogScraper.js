const puppeteer = require('puppeteer');
const { JSDOM } = require('jsdom');
const { Readability } = require('@mozilla/readability');
const cheerio = require('cheerio');
const TurndownService = require('turndown');
const fs = require('fs');
const path = require('path');

// Markdown converter
const turndownService = new TurndownService();

/**
 * Launches Puppeteer and retrieves page HTML
 */
async function fetchHTML(url) {
  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
    const html = await page.content();
    await browser.close();
    return html;
  } catch (err) {
    console.error(`Error fetching ${url}:`, err.message);
    return null;
  }
}

/**
 * Extracts readable content using Readability, falls back to cheerio
 */
function extractContent(html, url) {
  try {
    const dom = new JSDOM(html, { url });
    const reader = new Readability(dom.window.document);
    const article = reader.parse();

    if (article && article.content) {
      return {
        title: article.title || 'Untitled',
        htmlContent: article.content,
      };
    }

    throw new Error('Readability failed');
  } catch {
    // Fallback with Cheerio
    const $ = cheerio.load(html);
    const paragraphs = $('p').map((_, el) => $(el).text()).get().join('\n\n');
    return {
      title: $('title').text() || 'Untitled',
      htmlContent: `<div>${paragraphs}</div>`,
    };
  }
}

/**
 * Converts HTML to Markdown
 */
function convertToMarkdown(html) {
  return turndownService.turndown(html);
}

/**
 * Builds the final knowledgebase item
 */
function buildItem({ title, markdown, url, contentType = 'blog' }) {
  return {
    title,
    content: markdown,
    content_type: contentType,
    source_url: url,
    author: "",
    user_id: ""
  };
}

/**
 * Main function to scrape a list of blog URLs
 */
async function scrapeBlogs(urls = []) {
  const items = [];

  for (const url of urls) {
    console.log(`Processing: ${url}`);
    const html = await fetchHTML(url);
    if (!html) continue;

    const { title, htmlContent } = extractContent(html, url);
    const markdown = convertToMarkdown(htmlContent);

    const item = buildItem({ title, markdown, url });
    items.push(item);
  }

  const finalOutput = {
    team_id: "aline123",
    items
  };

  const outputDir = path.join(__dirname, '../output');
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

  const outPath = path.join(outputDir, 'result.json');
  fs.writeFileSync(outPath, JSON.stringify(finalOutput, null, 2));

  console.log(`✅ Scraping complete. Output written to ${outPath}`);
}

module.exports = {
  scrapeBlogs,
};

