exports.validatePdfUpload = (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ error: 'PDF file is required' })
  }
  next()
}

exports.validateBlogUrls = (req, res, next) => {
  const { urls } = req.body
  if (!Array.isArray(urls) || urls.length === 0) {
    return res.status(400).json({ error: 'Please provide an array of blog URLs' })
  }
  next()
}