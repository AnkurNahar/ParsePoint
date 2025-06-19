const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const { scrapeBlogs } = require('./scraper/blogScraper');
const fs = require('fs');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const { processPdfFile } = require('./scraper/pdfProcessor');

const app = express();
const PORT = 4000;

app.use(cors());
app.use(bodyParser.json());

// Health check
app.get('/', (req, res) => {
  res.send('🚀 Aline Scraper API is running!');
});

// POST /scrape/blogs
// Accepts JSON: { urls: [array of blog URLs] }
app.post('/scrape/blogs', async (req, res) => {
  const { urls } = req.body;

  if (!Array.isArray(urls) || urls.length === 0) {
    return res.status(400).json({ error: 'Please provide an array of blog URLs.' });
  }

  try {
    await scrapeBlogs(urls);

    const outputPath = path.join(__dirname, 'output', 'result.json');
    const result = fs.readFileSync(outputPath, 'utf-8');

    return res.status(200).json(JSON.parse(result));
    
  } catch (error) {
    console.error('Scrape failed:', error.message);
    return res.status(500).json({ error: 'Internal scraping error.' });
  } finally {
    fs.unlinkSync(file.path);
  }
});

app.post('/upload/pdf', upload.single('pdf'), async (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).json({ error: 'PDF file is required.' });
  }

  try {
    const items = await processPdfFile(file.path);
    const result = {
      team_id: "aline123",
      items
    };

    fs.writeFileSync(path.join(__dirname, 'output/pdf_result.json'), JSON.stringify(result, null, 2));
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: 'PDF processing failed.' });
  } finally {
    fs.unlinkSync(file.path);
  }
});


app.get('/download/result.json', (req, res) => {
  const filePath = path.join(__dirname, 'output', 'result.json');
  if (!fs.existsSync(filePath)) return res.status(404).send('No result found');
  res.download(filePath, 'aline_knowledge.json');
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
})