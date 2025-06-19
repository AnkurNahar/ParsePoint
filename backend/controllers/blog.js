const blogService = require('../services/blog');

exports.scrapeBlogs = async (req, res) => {
  const { urls } = req.body

  try {
    const result = await blogService.scrapeAndBuildOutput(urls)
    return res.status(200).json(result)
  } catch (error) {
    console.error('Blog scrape error:', error.message);
    return res.status(500).json({ error: 'Scraping failed.' })
  }
}