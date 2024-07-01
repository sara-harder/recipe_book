const mongoose = require('mongoose');

const recipeSchema = mongoose.Schema({
    // creates a Schema for the recipe table in the database
    name: { type: String, required: true },
    image: { type: String, required: false },
    portions: { type: Number, required: true },
    ingredients: { type: Object, required: true },
    directions: { type: Object, required: true },
    source: { type: String, required: false },
})

// creates a Recipe model class based on the precreated Schema
const Recipe = mongoose.model("Recipe", recipeSchema)


const createRecipe = async(name, image, portions, ingredients, directions, source) => {
    // uses the Recipe class to create a new recipe object
    const recipe = new Recipe({name, image, portions, ingredients, directions, source})
    return recipe.save()
}

const getRecipe = async(filter) => {
    // finds the recipe based on id
    const query = Recipe.findOne(filter)
    return query.exec()
}

const searchForRecipe = async(filter) => {
    // finds the recipe based on search for name
    const query = Recipe.find({ name: {$regex: filter} })
    return query.exec()
}

const updateRecipe = async(filter, update) => {
    // finds the recipe based on id, then updates the provided criteria for that recipe
    await Recipe.updateOne(filter, update)
    const query = Recipe.findOne(filter)
    return query.exec()
}


const deleteRecipe = async(filter) => {
    // finds the recipe based on id and deletes it if in existence
    const response = await Recipe.deleteOne(filter)
    return response.deletedCount
}