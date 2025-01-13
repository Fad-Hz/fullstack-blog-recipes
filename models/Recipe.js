// models/Recipe.js
const mongoose = require('mongoose');
const Category = require('./Category'); // Import model Category

const recipeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        match: /.+\@.+\..+/ // Validasi format email
    },
    ingredients: {
        type: [String], // Array of ingredients
        required: true
    },
    images: {
        type: String,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,  // Referencing Category model
        ref: 'Category',
        required: true
    }
})

const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe;
