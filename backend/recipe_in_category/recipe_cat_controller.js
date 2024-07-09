const express = require('express');
const asyncHandler = require('express-async-handler')
const recipe_cats = require('./recipe_cat_model.js');

const bodyParser = require('body-parser');
const reccatRouter = express.Router();
reccatRouter.use(bodyParser.json());

reccatRouter.post("/", asyncHandler(async(req, res, next) => {
    // creates a connection between recipe and category in the database
    const recipe_cat = await recipe_cats.createRecipeCategory(req.body.recipe, req.body.category)

    if (recipe_cat == null) res.type("application/json").status(500).send({Error: "Could not create connection between recipe and category"})
    res.type("application/json").status(201).send(recipe_cat)
}))

reccatRouter.get("/recipes/:category", asyncHandler(async(req, res, next) => {
    // returns the ids for all of the recipes in the specified category
    const results = await recipe_cats.getAllRecipeCategories({category: req.params.category})

    if (results.length == 0) res.type("application/json").status(404).send({Error: "No recipes found in this category"})
    else {
        const recipes = []
        for (const obj of results) {
            recipes.push(obj.recipe)
        }
        res.type("application/json").status(200).send(recipes)
    }
}))

reccatRouter.get("/categories/:recipe", asyncHandler(async(req, res, next) => {
    // returns the ids for all of the categories for the specified recipe
    const results = await recipe_cats.getAllRecipeCategories({recipe: req.params.recipe})

    if (results.length == 0) res.type("application/json").status(404).send({Error: "No categories found for this recipe"})
    else {
        const categories = []
        for (const obj of results) {
            categories.push(obj.recipe)
        }
        res.type("application/json").status(200).send(categories)
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