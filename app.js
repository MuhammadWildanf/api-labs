require("dotenv").config();
const express = require('express')
const app = express()
const cors = require('cors')
const router = require('./routes/router')
const errorHandler = require('./middlewares/errorHandler')
const path = require('path')
const fs = require('fs')
const port = 1987

// Pastikan folder uploads ada
const uploadDir = path.join(__dirname, 'uploads')
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true })
}

// Konfigurasi untuk upload file besar
app.use(express.json({ limit: '100mb' }))
app.use(express.urlencoded({ extended: true, limit: '100mb' }))
app.use(cors())
app.use('/uploads', express.static('uploads'))
app.use(express.static('public'))
app.use(router)
app.use(errorHandler)

app.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}/`)
})
