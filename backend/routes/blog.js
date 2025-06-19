const express = require('express')
const router = express.Router()
const blogController = require('../controllers/blog')

router.post('/scrape', blogController.scrapeBlogs)

module.exports = router