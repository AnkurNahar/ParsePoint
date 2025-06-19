# ParsePoint: Website & PDF Scraper with Markdown Normalization

This project allows you to scrape content from blog URLs or uploaded PDF files, convert the content to Markdown format, and download the results as JSON or Markdown files. Built with a Node.js backend and a Next.js + Tailwind CSS frontend.

---

## 🚀 Features

- 📄 **Scrape Blogs**: Enter one or more blog URLs, extract readable content, and convert it to Markdown.
- 📘 **Upload PDF**: Upload a PDF and extract chapters as Markdown.
- 💾 **Download Output**: Get the scraped results in `.json` or `.md` formats.
- ⚡ **Optimized Scraper**: Uses `node-fetch` by default and `puppeteer` as fallback for dynamic content.
- 🎨 **Frontend**: Clean UI built with Tailwind CSS and toast notifications via `react-hot-toast`.

---

## 🛠 Tech Stack

**Backend:**
- `express`: API server
- `multer`: for handling file uploads
- `puppeteer`: headless browser for JS-rendered pages
- `jsdom`, `@mozilla/readability`: parsing readable blog content
- `cheerio`: fallback HTML parsing
- `turndown`: HTML to Markdown conversion

**Frontend:**
- `next.js`: React-based framework
- `tailwindcss`: utility-first CSS
- `axios`: for API calls
- `react-hot-toast`: toast notifications

---

## 🧪 Run Locally

Follow these steps to run the project on your local machine:

### 🔧 Backend Setup

1. **Clone or download** the repository

```bash
git clone https://github.com/AnkurNahar/ParsePoint.git
cd parsepoint
```

2. **Install root dependencies**
```bash
npm install
```

3. **Navigate to the backend folder**
```bash
cd backend
```

4. **Run the backend server**
```bash
node server.js
```

By default, the API runs on `http://localhost:4000`

---

### 🎨 Frontend Setup

5. **Navigate to the frontend folder**
```bash
cd ../frontend
```

6. **Install frontend dependencies**
```bash
npm install
```

7. **Start the frontend server**
```bash
npm run dev
```

Your frontend should be running at:
```
http://localhost:3000
```

---

## 📂 API Endpoints

### 1. **Scrape Blogs**
```
POST /api/blogs/scrape
```
**Body (JSON):**
```json
{
  "urls": ["https://example.com/blog1", "https://example.com/blog2"]
}
```

### 2. **Upload PDF**
```
POST /api/pdf/upload
```
**Form-data:**
- `pdf`: (attach file)

### 3. **Download Output**
```
GET /api/download/{filename}
```
Example:
```
GET /api/download/blogs.json
```

---

## 🙌 Credits
Built with ❤️ by Ankur.
