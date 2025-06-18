require("dotenv").config();
const express = require('express')
const app = express()
const cors = require('cors')
const router = require('./routes/router')
const errorHandler = require('./middlewares/errorHandler')
const path = require('path')
const fs = require('fs')
const port = 1987

// Decode GCP key from base64 env variable (for cloud/hosting)
if (process.env.GOOGLE_CLOUD_KEY_JSON_BASE64) {
    const keyPath = path.join(__dirname, 'gcp-key.json');
    const json = Buffer.from(process.env.GOOGLE_CLOUD_KEY_JSON_BASE64, 'base64').toString('utf8');
    fs.writeFileSync(keyPath, json);
    process.env.GOOGLE_CLOUD_KEY_FILE = keyPath;
}

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
