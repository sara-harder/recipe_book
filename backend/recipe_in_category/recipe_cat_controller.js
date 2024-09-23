const express = require('express');
const asyncHandler = require('express-async-handler')
const recipe_cats = require('./recipe_cat_model.js');
const recipes = require('../recipes/recipes_model.js')
const categories = require('../categories/categories_model.js')

const bodyParser = require('body-parser');
const reccatRouter = express.Router();
reccatRouter.use(bodyParser.json());

reccatRouter.post("/", asyncHandler(async(req, res, next) => {
    // creates a connection between recipe and category in the database
    const recipe_cat = await recipe_cats.createRecipeCategory(req.body.recipe, req.body.category)

    if (recipe_cat == null) res.type("application/json").status(500).send({Error: "Could not create connection between recipe and category"})
    res.type("application/json").status(201).send(recipe_cat)
}))

reccatRouter.get('/recipes/count/:category', asyncHandler(async(req, res, next) => {
    // checks if a category is empty of recipes, returns num of recipes in category
    const results = await recipe_cats.getAllRecipeCategories({category: req.params.category})
    res.type("application/json").status(200).send({count: results.length})
}))

reccatRouter.get("/recipes/:category", asyncHandler(async(req, res, next) => {
    // returns the all of the recipes in the specified category
    const results = await recipe_cats.getAllRecipeCategories({category: req.params.category})

    if (results.length == 0) res.type("application/json").status(404).send({Error: "No recipes found in this category"})
    else {
        const recipe_objs = []
        for (const obj of results) {
            const recipe = await recipes.getRecipe({_id: obj.recipe})
            recipe_objs.push(recipe)
        }
        res.type("application/json").status(200).send(recipe_objs)
    }
}))

reccatRouter.get("/categories/:recipe", asyncHandler(async(req, res, next) => {
    // returns the ids for all of the categories for the specified recipe
    const results = await recipe_cats.getAllRecipeCategories({recipe: req.params.recipe})

    if (results.length == 0) res.type("application/json").status(404).send({Error: "No categories found for this recipe"})
    else {
        const category_objs = []
        for (const obj of results) {
            const category = await categories.getCategory({_id: obj.category})
            category_objs.push(category)
        }
        res.type("application/json").status(200).send(category_objs)
    }
}))

reccatRouter.delete("/:id", asyncHandler(async(req, res, next) => {
    // delete the connection between recipe and category with provided id
    const id = {_id: req.params.id}
    const count = await recipe_cats.deleteRecipeCategory(id)

    if (count === 0) res.type("application/json").status(404).send({Error: "Connection between recipe and category not found"})
    else res.status(204).send()
}))

module.exports = {reccatRouter};