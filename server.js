// Mengimpor dotenv untuk memuat variabel lingkungan dari file .env
require('dotenv').config()

// Mengimpor library yang dibutuhkan
const express = require('express')
const expressEjsLayouts = require('express-ejs-layouts')
const expressFileUpload = require('express-fileupload')
const path = require('path')

// Membuat aplikasi Express
const app = express()

// Menggunakan middleware untuk mengurai form data
app.use(express.urlencoded({ extended: true }))
app.use(express.json()) // Menggunakan middleware untuk JSON body parsing

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
app.use('/', require('./routes/recipe.routes'))

// Rute untuk menangani 404 (Page Not Found)
app.use((req, res) => {
    res.status(404).render('notfound', {
        url: req.originalUrl,
        title: '404 NotFound',
        href: '/'
    })
})

// Menentukan port dan menjalankan server
const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`)
})

// Menghubungkan ke database MongoDB
require('./config/db')()
