const express = require('express')
const router = express.Router()
const blogController = require('../controllers/blog')
const { validateBlogUrls } = require('../middleware/validate')

router.post('/scrape', validateBlogUrls, blogController.scrapeBlogs)

module.exports = router