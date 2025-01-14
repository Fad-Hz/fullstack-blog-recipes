// Mengimpor dotenv untuk memuat variabel lingkungan dari file .env
require('dotenv').config()

// Mengimpor library yang dibutuhkan
const express = require('express')
const expressEjsLayouts = require('express-ejs-layouts')
const expressFileUpload = require('express-fileupload')
const path = require('path')
const cookieParser = require('cookie-parser')

// Membuat aplikasi Express
const app = express()

// Menggunakan middleware untuk mengurai form data
app.use(express.urlencoded({ extended: true }))
app.use(express.json()) // Menggunakan middleware untuk JSON body parsing
app.use(cookieParser())
app.use(require('./middlewares/authenticate.js'))

// Menggunakan middleware untuk file upload
app.use(expressFileUpload())

// Menggunakan folder static 'public' untuk file-file statis
app.use(express.static(path.join(__dirname, 'public')))

// Menggunakan express-ejs-layouts untuk layout EJS
app.use(expressEjsLayouts)

// Menyeting layout default untuk EJS
app.set('layout', './layouts/main')
app.set('view engine', 'ejs')

// Rute utama aplikasi, mengimpor rute dari file lain
app.use('/', require('./routes/recipeRoute'))
app.use('/', require('./routes/auth.js'))

// Rute untuk menangani 404 (Page Not Found)
app.use((req, res) => {
    res.status(404).render('notfound', {
        url: req.originalUrl,
        title: '404 NotFound',
        href: '/'
    })
})

app.use((err, req, res, next) => {
    console.error(err.stack); // Log error untuk debugging
    res.status(500); // Set status response ke 500
    res.render('500', { error: err, href: '/', title: 'Internal Server Error' }) // Render file views/500.ejs
})

// Menentukan port dan menjalankan server
const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`)
})

// Menghubungkan ke database MongoDB
require('./config/db')()