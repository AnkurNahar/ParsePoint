const fs = require('fs');
const pdfParse = require('pdf-parse');
const TurndownService = require('turndown');

const turndownService = new TurndownService();

const processPdfFile = async (filePath) => {
    try {
        const buffer = fs.readFileSync(filePath);
        const data = await pdfParse(buffer);

        // Split by chapters (if clearly marked), otherwise every X pages/paragraphs
        const chunks = chunkByChapters(data.text);
        
        return chunks.map((chunk, index) => ({
            title: `Book Chapter ${index + 1}`,
            content: turndownService.turndown(chunk),
            content_type: 'book',
            source_url: '',
            author: '',
            user_id: ''
        }));
    } catch (error) {
        console.log(error);  
    }
}

function chunkByChapters(text) {
  const lines = text.split('\n');
  const chapters = [];
  let current = [];

  for (let line of lines) {
    if (/chapter\s+\d+/i.test(line)) {
      if (current.length > 0) chapters.push(current.join('\n'));
      current = [line];
    } else {
      current.push(line);
    }
  }

  if (current.length > 0) chapters.push(current.join('\n'));
  return chapters.slice(0, 8); // First 8 chapters only
}

module.exports = {
  processPdfFile
};
