'use client'

import { useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'

export default function Home() {
  const [urls, setUrls] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [jsonOutput, setJsonOutput] = useState<any>(null)

  const handleScrape = async () => {
    try {
      const urlArray = urls.split('\n').map(line => line.trim()).filter(Boolean)
      const res = await axios.post('http://localhost:4000/api/blogs/scrape', { urls: urlArray })
      toast.success(`✅ Scraped ${res.data.items.length} blog(s) successfully.`)
      setJsonOutput(res.data)
    } catch (err) {
      toast.error('❌ Failed to scrape blogs.')
    }
  }

  const handleUpload = async () => {
    if (!file) return toast.error('Please choose a PDF file')
    try {
      const formData = new FormData()
      formData.append('pdf', file)
      const res = await axios.post('http://localhost:4000/api/pdf/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      toast.success(`✅ Processed PDF: ${res.data.items.length} chapters extracted.`)
      setJsonOutput(res.data)
    } catch (err) {
      toast.error('❌ PDF processing failed.')
    }
  }

  const handleDownload = async (filename: string) => {
    try {
      const res = await axios.get(`http://localhost:4000/api/download/${filename}`, {
        responseType: 'blob'
      })
      const url = window.URL.createObjectURL(new Blob([res.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', filename)
      document.body.appendChild(link)
      link.click()
      link.remove()
      toast.success(`✅ Downloaded ${filename}`)
    } catch (err) {
      toast.error('❌ Download failed.')
    }
  }

  return (
    <main className="p-8 max-w-3xl mx-auto bg-white rounded-2xl shadow-xl mt-12 border border-purple-200">
      <h2 className="text-4xl font-extrabold mb-10 text-center text-purple-700 drop-shadow">✨ ParsePoint Interface</h2>

      <section className="mb-10">
        <h3 className="text-xl font-semibold mb-3 text-blue-800">📝 Blog Scraper</h3>
        <textarea
          rows={6}
          placeholder='Enter blog URLs, one per line'
          value={urls}
          onChange={e => setUrls(e.target.value)}
          className="w-full p-4 border border-blue-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 bg-blue-50"
        />
        <button onClick={handleScrape} className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold shadow">
          🚀 Scrape Blogs
        </button>
      </section>

      <section className="mb-10">
        <h3 className="text-xl font-semibold mb-3 text-green-800">📄 PDF Upload</h3>
        <input
          type='file'
          accept='application/pdf'
          onChange={e => setFile(e.target.files?.[0] || null)}
          className="block w-full mb-3 text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-100 file:text-green-700 hover:file:bg-green-200"
        />
        <button onClick={handleUpload} className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold shadow">
          ⬆️ Upload PDF
        </button>
      </section>

      <section className="mb-10">
        <h3 className="text-xl font-semibold mb-3 text-gray-800">📥 Download Outputs</h3>
        <div className="flex flex-wrap gap-3">
          {['blogs.json', 'blogs.md', 'pdf_result.json', 'pdf_result.md'].map(name => (
            <button
              key={name}
              onClick={() => handleDownload(name)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium shadow"
            >
              {name}
            </button>
          ))}
        </div>
      </section>

      {jsonOutput && (
        <section className="mt-6">
          <h4 className="text-lg font-semibold mb-2 text-indigo-800">📦 JSON Output:</h4>
          <pre className="bg-indigo-50 border border-indigo-200 p-4 rounded-md text-sm overflow-auto max-h-[400px] whitespace-pre-wrap">
            {JSON.stringify(jsonOutput, null, 2)}
          </pre>
        </section>
      )}
    </main>
  )
}