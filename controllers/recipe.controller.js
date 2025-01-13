const path = require('path'); 
const fs = require('fs');
const Category = require('../models/Category');
const Recipe = require('../models/Recipe');

exports.homePage = async (req, res) => {
    try {
        const recipes = await Recipe.find().limit(5);

        const categories = await Category.find().limit(4);

        res.status(200).render('index', {
            title: 'Home Page',
            categories,
            recipes,
            href: '/'
        });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.exploreCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).render('category', { title: 'Categories Page', categories, href: '/#categories' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, message: 'Some error occurred', error: err.message });
    }
};

exports.exploreRecipes = async (req, res) => {
    try {
        const { categoryId } = req.query;
        let recipes;

        if (categoryId) {
            recipes = await Recipe.find({ category: categoryId });
        } else {
            recipes = await Recipe.find();
        }

        const categories = await Category.find();

        res.status(200).render('exploreRecipes', {
            title: 'Explore Recipes',
            recipes,
            categories,
            href: '/#recipes',
            selectedCategoryId: categoryId
        });
    } catch (error) {
        console.error('Error fetching recipes or categories:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.filterByCategory = async (req, res) => {
    try {
        const { categoryId } = req.query;
        let recipes;

        if (categoryId) {
            recipes = await Recipe.find({ category: categoryId });
        } else {
            recipes = await Recipe.find();
        }

        const categories = await Category.find();

        res.status(200).render('exploreRecipes', {
            title: 'Explore Recipes',
            recipes,
            categories,
            selectedCategoryId: categoryId,
            href: '/#categories'
        });
    } catch (error) {
        console.error('Error fetching recipes or categories:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.createRecipe = async (req, res) => {
    try {
        if (!req.files || !req.files.images) {
            return res.status(400).send('No image file uploaded');
        }

        const imageFile = req.files.images;

        const uploadPath = path.join(__dirname, '../public/uploads', Date.now() + '-' + imageFile.name);

        imageFile.mv(uploadPath, async (err) => {
            if (err) {
                return res.status(500).send(err);
            }

            const { name, description, email, ingredients, category } = req.body;

            const recipe = new Recipe({
                name,
                description,
                email,
                ingredients: ingredients.split(','), // Mengonversi string ingredients menjadi array
                images: `/uploads/${path.basename(uploadPath)}`, // Path gambar
                category
            });

            await recipe.save();

            res.status(200).redirect('/explore-recipes');
        });
    } catch (error) {
        console.error('Error creating recipe:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.getCreateRecipeForm = async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).render('createRecipe', {
            title: 'Create New Recipe',
            categories,
            href: '/'
        });
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).send('Internal Server Error');
    }
};


exports.getRecipeById = async (req, res) => {
    try {
        const { id } = req.params; // Mendapatkan ID dari URL parameter
        const recipe = await Recipe.findById(id).populate('category'); // Menemukan resep berdasarkan ID dan populasi kategori

        if (!recipe) {
            return res.status(404).send('Recipe not found');
        }

        res.status(200).render('recipeDetail', {
            title: `Recipe - ${recipe.name}`,
            recipe, // Mengirim data resep ke tampilan
            href: '/#recipes'
        });
    } catch (error) {
        console.error('Error fetching recipe:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.getRecipesByCategory = async (req, res) => {
    try {
        const { id } = req.params  // Ambil ID kategori dari URL
        const category = await Category.findById(id)  // Cari kategori berdasarkan ID

        if (!category) {
            return res.status(404).send('Category not found')
        }

        // Temukan resep berdasarkan kategori ID
        const recipes = await Recipe.find({ category: id })

        // Kirim data kategori dan resep ke tampilan
        res.status(200).render('recipesByCategory', {
            title: `Recipes in ${category.name}`,
            category,
            recipes,
            href: '/'
        })
    } catch (error) {
        console.error('Error fetching category recipes:', error)
        res.status(500).send('Internal Server Error')
    }
}

exports.searchRecipesAndCategories = async (req, res) => {
    try {
        const { searchTerm } = req.body;

        // Pencarian resep berdasarkan nama atau deskripsi
        const recipes = await Recipe.find({
            $or: [
                { name: { $regex: searchTerm, $options: 'i' } }, // Pencarian tidak sensitif huruf besar/kecil
                { description: { $regex: searchTerm, $options: 'i' } }
            ]
        });

        // Pencarian kategori berdasarkan nama
        const categories = await Category.find({
            name: { $regex: searchTerm, $options: 'i' } // Pencarian kategori berdasarkan nama
        });

        // Menampilkan hasil pencarian
        res.status(200).render('searchResults', {
            title: 'Search Results',
            recipes,
            categories,
            searchTerm,
            href: '/#categories'
        });
    } catch (error) {
        console.error('Error searching for recipes and categories:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.testController = async (req, res) => {
    const data = await Category.insertMany([
        {
            name: 'Indonesian',
            image: '/img/nasigoreng.jpeg'
        },
        {
            name: 'American',
            image: '/img/american-food.jpg'
        },
        {
            name: 'Indian',
            image: '/img/indian-food.jpg'
        },
        {
            name: 'Thai',
            image: '/img/thai-food.jpg'
        },
        {
            name: 'Chinese',
            image: '/img/chinese-food.jpg'
        },
        {
            name: 'Mexican',
            image: '/img/mexican-food.jpg'
        },
        {
            name: 'Spanish',
            image: '/img/spanish-food.jpg'
        }
    ])
    res.status(200).json({ message: 'OK', data })
}

exports.getEditRecipe = async (req, res) => {
    try {
        const recipeId = req.params.id; // Mengambil ID dari URL
        const recipe = await Recipe.findById(recipeId); // Mencari resep berdasarkan ID

        if (!recipe) {
            return res.status(404).send('Recipe not found');
        }

        const categories = await Category.find(); // Mendapatkan semua kategori untuk dropdown
        res.render('editRecipe', {
            recipe,
            categories,
            title: 'Edit Recipe',
            href: '/#recipes'
        }); // Mengirim data ke template edit-recipe.ejs
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
};


exports.updateRecipe = async (req, res) => {
    try {
        const recipeId = req.params.id;
        const { name, description, email, ingredients, category } = req.body;

        // Temukan resep berdasarkan ID
        const recipe = await Recipe.findById(recipeId);
        if (!recipe) {
            return res.status(404).send('Recipe not found');
        }

        // Update field yang tidak terkait dengan gambar
        recipe.name = name;
        recipe.description = description;
        recipe.email = email;
        recipe.ingredients = ingredients.split(',').map(ingredient => ingredient.trim());
        recipe.category = category;

        // Cek apakah file baru diunggah
        if (req.file) {
            // Hapus gambar lama (jika ada)
            if (recipe.images) {
                const oldImagePath = path.join(__dirname, '../public/uploads/', recipe.images);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }

            // Simpan path gambar baru
            recipe.images = req.file.filename;
        }

        // Simpan perubahan
        await recipe.save();

        res.redirect(`/recipe/${recipeId}`);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
};

exports.deleteRecipe = async (req, res) => {
    try {
        const recipeId = req.params.id;

        // Temukan resep berdasarkan ID
        const recipe = await Recipe.findById(recipeId);
        if (!recipe) {
            return res.status(404).send('Recipe not found');
        }

        // Hapus gambar yang terkait (jika ada)
        if (recipe.images) {
            const imagePath = path.join(__dirname, '../public/uploads/', recipe.images);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        // Hapus resep dari database
        await Recipe.findByIdAndDelete(recipeId);

        // Redirect ke halaman utama atau daftar resep
        res.redirect('/explore-recipes');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
};

// Fungsi untuk menampilkan resep acak
exports.getRandomRecipe = async (req, res) => {
    try {
        // Mengambil semua resep dari database
        const count = await Recipe.countDocuments();
        const randomIndex = Math.floor(Math.random() * count);
        const randomRecipe = await Recipe.findOne().skip(randomIndex);  // Mengambil resep berdasarkan index acak

        res.render('randomRecipe', { recipe: randomRecipe, title: 'Random Recipe', href: '/#recipes' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Something went wrong');
    }
};