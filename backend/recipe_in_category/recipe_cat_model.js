const mongoose = require('mongoose');

const recipeCategorySchema = mongoose.Schema({
    // creates a Schema for the recipe_category table in the database
    recipe: { type: String, required: true },
    category: { type: String, required: true }
})

// creates a RecipeCategory model class based on the precreated Schema
const RecipeCategory = mongoose.model("RecipeCategory", recipeCategorySchema)


const createRecipeCategory = async(recipe, category) => {
    // uses the RecipeCategory class to create a new recipe_category object
    const recipe_category = new RecipeCategory({recipe, category})
    return recipe_category.save()
}

const getAllRecipeCategories = async(filter) => {
    // finds all recipes in a specified category or all categories in a specified recipe
    const query = RecipeCategory.find(filter)
    return query.exec()
}

const deleteRecipeCategory = async(filter) => {
    // finds the recipe_category based on id and deletes it if in existence
    const response = await RecipeCategory.deleteOne(filter)
    return response.deletedCount
}