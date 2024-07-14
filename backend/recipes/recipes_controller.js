const express = require('express');
const asyncHandler = require('express-async-handler')
const recipes = require('./recipes_model.js');

const bodyParser = require('body-parser');
const recipesRouter = express.Router();
recipesRouter.use(bodyParser.json());


recipesRouter.post("/", asyncHandler(async(req, res, next) => {
    // creates a recipe in the database
    try {
        const recipe = await recipes.createRecipe(req.body.name, req.body.portions, req.body.ingredients, req.body.directions, req.body.image, req.body.source)

        if (recipe == null) res.type("application/json").status(500).send({Error: "Could not create recipe"})
        res.type("application/json").status(201).send(recipe)
    } catch (ValidationError) {
        res.type("application/json").status(400).send({Error: "Invalid input"})
    }
}))

recipesRouter.get("/:id", asyncHandler(async(req, res, next) => {
    // get the recipe based on the provided id
    const id = {_id: req.params.id}
    const recipe = await recipes.getRecipe(id)

    if (recipe == null) res.type("application/json").status(404).send({Error: "Recipe not found"})
    else res.type("application/json").status(200).send(recipe)
}))

recipesRouter.get("/search/:search", asyncHandler(async(req, res, next) => {
    // get a list of recipes that match the provided search
    const results = await recipes.searchForRecipe(req.params.search)

    if (results.length == 0) res.type("application/json").status(404).send({Error: "No recipes found"})
    else res.type("application/json").status(200).send(results)
}))

recipesRouter.put("/:id", asyncHandler(async(req, res, next) => {
    // updates the recipe based on the provided id using the provided update data
    const id = {_id: req.params.id}
    const recipe = await recipes.updateRecipe(id, req.body)

    if (recipe == null) res.type("application/json").status(404).send({Error: "Recipe not found"})
    else res.type("application/json").status(200).send(recipe)
}))

recipesRouter.delete("/:id", asyncHandler(async(req, res, next) => {
    // delete the recipe with provided id
    const id = {_id: req.params.id}
    const count = await recipes.deleteRecipe(id)

    if (count === 0) res.type("application/json").status(404).send({Error: "Recipe not found"})
    else res.status(204).send()
}))

module.exports = {recipesRouter};