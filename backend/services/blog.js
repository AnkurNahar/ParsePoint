const { scrapeBlogs } = require('../services/scraper/blogScraper')
const { buildOutput, saveToJsonFile, saveToMarkdown } = require('./output')

exports.scrapeAndBuildOutput = async (urls) => {
  const items = await scrapeBlogs(urls) // returns array of blog items
  const output = buildOutput(items)
  saveToJsonFile(output, 'blogs.json')
  saveToMarkdown(output.items, 'blogs.md')
  return output
}