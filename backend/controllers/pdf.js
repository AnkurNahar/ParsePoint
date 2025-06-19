const pdfService = require('../services/pdf')

exports.handlePdfUpload = async (req, res) => {
  const file = req.file

  if (!file) {
    return res.status(400).json({ error: 'PDF file is required' })
  }

  try {
    const output = await pdfService.processAndBuildOutput(file.path)
    res.status(200).json(output)
  } catch (err) {
    return res.status(500).json({ error: 'PDF processing failed' })
  }
}