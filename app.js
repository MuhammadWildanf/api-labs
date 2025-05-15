const express = require('express')
const app = express()
const cors = require('cors')
const router = require('./routes/router')
const errorHandler = require('./middlewares/errorHandler')
const port = 1987

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use('/uploads', express.static('uploads'));
app.use(router)
app.use(errorHandler)
app.use(express.static('public'))

app.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}/`)
})
