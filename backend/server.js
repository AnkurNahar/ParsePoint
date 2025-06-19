const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const blogRoutes = require('./routes/blog')
const pdfRoutes = require('./routes/pdf')
const downloadRoutes = require('./routes/download')

const app = express()
const PORT = 4000

app.use(cors())
app.use(bodyParser.json())

// Routes
app.use('/api/blogs', blogRoutes)
app.use('/api/pdf', pdfRoutes)
app.use('/api/download', downloadRoutes)

// Health
app.get('/', (req, res) => {
  res.send('🚀 ParsePoint APIs are running!')
})

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`)
})