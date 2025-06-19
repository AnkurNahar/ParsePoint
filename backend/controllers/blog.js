const blogService = require('../services/blog');

exports.scrapeBlogs = async (req, res) => {
  const { urls } = req.body

  if (!Array.isArray(urls) || urls.length === 0) {
    return res.status(400).json({ error: 'Please provide an array of blog URLs.' })
  }

  try {
    const result = await blogService.scrapeAndBuildOutput(urls)
    return res.status(200).json(result)
  } catch (error) {
    console.error('Blog scrape error:', error.message);
    return res.status(500).json({ error: 'Scraping failed.' })
  }
}