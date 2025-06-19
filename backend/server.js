const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const blogRoutes = require('./routes/blog')

const app = express()
const PORT = 4000

app.use(cors())
app.use(bodyParser.json())

// Routes
app.use('/api/blogs', blogRoutes)

// Health
app.get('/', (req, res) => {
  res.send('🚀 Aline Scraper API is running!')
})

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`)
})