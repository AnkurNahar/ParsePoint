const downloadService = require('../services/download')

exports.downloadFile = (req, res) => {
  try {
    const { filename } = req.params
    const filePath = downloadService.resolveFilePath(filename)

    if (!filePath) {
      return res.status(404).json({ error: 'File not found' })
    }

    res.download(filePath)
  } catch (err) {
    return res.status(404).json({ error: 'Failed to download file' })
  }
}