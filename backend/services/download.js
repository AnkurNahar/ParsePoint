const fs = require('fs')
const path = require('path')

exports.resolveFilePath = (filename) => {
  const fullPath = path.join(__dirname, '../output', filename)

  // Check if file exists
  if (!fs.existsSync(fullPath)) {
    return null
  }

  return fullPath
}