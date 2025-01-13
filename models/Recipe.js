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
