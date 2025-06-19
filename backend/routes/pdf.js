const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const pdfController = require('../controllers/pdf')

const upload = multer({ dest: path.join(__dirname, '../uploads') })

router.post('/upload', upload.single('pdf'), pdfController.handlePdfUpload)

module.exports = router