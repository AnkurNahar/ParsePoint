const { processPdfFile } = require('../services/scraper/pdfProcessor')
const { buildOutput, saveToJsonFile, saveToMarkdown } = require('./output')
const fs = require('fs')

exports.processAndBuildOutput = async (filePath) => {
  const items = await processPdfFile(filePath)

  const output = buildOutput(items)

  saveToJsonFile(output, 'pdf_result.json')
  saveToMarkdown(output.items, 'pdf_result.md')

  fs.unlinkSync(filePath) // cleanup uploaded file

  return output
}