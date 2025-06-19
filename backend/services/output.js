const fs = require('fs')
const path = require('path')

exports.buildOutput = (items) => ({
  team_id: 'aline123',
  items: items.flat()
})

exports.saveToJsonFile = (data, filename = 'result.json') => {
  const filePath = path.join(__dirname, '../output', filename)
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
}

exports.saveToMarkdown = (items, filename = 'result.md') => {
  const markdown = items.map((item, i) =>
    `## ${i + 1}. ${item.title}\n\n${item.content}\n\n---\n\n`
  ).join('')

  const filePath = path.join(__dirname, '../output', filename)
  fs.writeFileSync(filePath, markdown)
}