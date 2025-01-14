const { Router } = require('express')
const recipeRoute = Router()
const admin = require('../middlewares/admin')

// Mengimpor controller yang dibutuhkan
const {
    homePage,
    exploreCategories,
    testController,
    exploreRecipes,
    filterByCategory,
    createRecipe,
    getCreateRecipeForm,
    getRecipeById,
    getRecipesByCategory,
    searchRecipesAndCategories,
    getEditRecipe,
    updateRecipe,
    deleteRecipe,
    getRandomRecipe
} = require('../controllers/recipe.controller')

// Rute untuk halaman utama
recipeRoute.get('/', homePage)

// Rute untuk kategori
recipeRoute.get('/categories', exploreCategories)

// Rute untuk halaman eksplorasi resep terbaru
recipeRoute.get('/explore-latest', exploreRecipes)

// Rute untuk pengujian (test)
recipeRoute.get('/test', testController)

// Rute untuk eksplorasi resep berdasarkan kategori
recipeRoute.get('/explore-recipes', filterByCategory)

// Rute untuk menampilkan form submit resep
recipeRoute.get('/submit-recipe', getCreateRecipeForm)

// rute untuk menampilkan detail single resep
recipeRoute.get('/recipe/:id', getRecipeById)

// Route untuk menampilkan resep berdasarkan kategori
recipeRoute.get('/categories/:id', getRecipesByCategory)

// Rute untuk menampilkan form edit resep
recipeRoute.get('/edit-recipe/:id', admin, getEditRecipe)

// Rute untuk mendapatkan resep acak
recipeRoute.get('/random-recipe', getRandomRecipe)

// Rute untuk menampilkan About page
recipeRoute.get('/about', (req, res) => {
    res.render('about', { title: 'About Page', href: '/#submit-section' })
})

// Rute untuk menampilkan Contact page
recipeRoute.get('/contact', (req, res) => {
    res.render('contact', { title: 'Contact Us', href: '/#submit-section' })
})

// Rute untuk menangani pengiriman data resep 
recipeRoute.post('/submit-recipe', createRecipe)

// Rute untuk menangani pencarian resep dan kategori
recipeRoute.post('/search', searchRecipesAndCategories)

// Rute untuk menangani edit resep
recipeRoute.post('/edit-recipe/:id', updateRecipe)

// Route untuk menangani delete resep
recipeRoute.post('/delete/:id', admin, deleteRecipe)

module.exports = recipeRoute 