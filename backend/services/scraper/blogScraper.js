const puppeteer = require('puppeteer')
const { JSDOM } = require('jsdom')
const { Readability } = require('@mozilla/readability')
const cheerio = require('cheerio')
const TurndownService = require('turndown')

const turndownService = new TurndownService()

/**
 * Launch Puppeteer and get raw HTML
 */
async function fetchHTML(url, requiredSelector = null) {
  // Try with node-fetch + JSDOM
  try {
    const res = await fetch(url, { timeout: 15000 })
    if (!res.ok) throw new Error(`Fetch failed: ${res.status} ${res.statusText}`)

    const html = await res.text()
    const dom = new JSDOM(html)
    const document = dom.window.document

    // If requiredSelector is given, check if it exists
    if (!requiredSelector || document.querySelector(requiredSelector)) {
      return html
    } else {
      console.warn(`⚠️ Selector "${requiredSelector}" not found in static HTML. Falling back to Puppeteer.`)
    }
  } catch (err) {
    console.warn(`⚠️ node-fetch failed for ${url}:`, err.message)
  }

  // Fallback to Puppeteer
  try {
    const browser = await puppeteer.launch({ headless: true })
    const page = await browser.newPage()

    await page.setRequestInterception(true)
    page.on('request', req => {
      const blocked = ['stylesheet', 'font', 'image']
      if (blocked.includes(req.resourceType())) {
        req.abort()
      } else {
        req.continue()
      }
    })

    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 })
    const html = await page.content()
    await browser.close()
    return html
  } catch (err) {
    console.error(`❌ Puppeteer failed for ${url}:`, err.message)
    return null
  }
}


/**
 * Try to extract readable content using Readability, fallback to cheerio
 */
function extractContent(html, url) {
  try {
    const dom = new JSDOM(html, { url })

    const reader = new Readability(dom.window.document)
    const article = reader.parse()

    if (article?.content) {
      return {
        title: article.title || 'Untitled',
        htmlContent: article.content
      }
    }

    throw new Error('Readability returned no content')
  } catch (e) {
    const $ = cheerio.load(html)
    const title = $('title').text() || 'Untitled'
    const content = $('p').map((_, el) => $(el).text()).get().join('\n\n')

    return {
      title,
      htmlContent: `<div>${content}</div>`
    }
  }
}

/**
 * Convert HTML string to markdown
 */
function convertToMarkdown(html) {
  return turndownService.turndown(html)
}

/**
 * Construct a knowledgebase item
 */
function buildItem({ title, markdown, url, contentType = 'blog' }) {
  return {
    title,
    content: markdown,
    content_type: contentType,
    source_url: url,
    author: '',
    user_id: ''
  }
}

/**
 * Scrape and build items from a list of blog URLs
 */
async function scrapeBlogs(urls = []) {
  const fetchTasks = urls.map(async (url) => {
    try {
      console.log(`🟡 Scraping: ${url}`)

      const html = await fetchHTML(url)
      if (!html) return null

      const { title, htmlContent } = extractContent(html, url)
      const markdown = convertToMarkdown(htmlContent)

      if (!markdown || markdown.length < 50) {
        console.warn(`⚠️ Skipping ${url} due to insufficient content`)
        return null
      }

      return buildItem({ title, markdown, url })
    } catch (err) {
      console.error(`❌ Error processing ${url}:`, err.message)
      return null
    }
  })

  const results = await Promise.all(fetchTasks)

  // Filter out failed/null entries
  const items = results.filter(Boolean)

  return items
}


module.exports = {
  scrapeBlogs
}
