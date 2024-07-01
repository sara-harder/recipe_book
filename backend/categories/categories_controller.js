const express = require('express');
const asyncHandler = require('express-async-handler')
const categories = require('./categories_model.js');

const bodyParser = require('body-parser');
const categoriesRouter = express.Router();
categoriesRouter.use(bodyParser.json());


categoriesRouter.post("/", asyncHandler(async(req, res, next) => {
    // creates a category in the database
    const category = await categories.createCategory(req.body.name, req.body.flavor_type)

    if (category == null) res.type("application/json").status(500).send({Error: "Could not create category"})
    res.type("application/json").status(201).send(category)
}))

categoriesRouter.get("/:id", asyncHandler(async(req, res, next) => {
    // get the category based on the provided id
    const id = {_id: req.params.id}
    const category = await categories.getCategory(id)

    if (category == null) res.type("application/json").status(404).send({Error: "Category not found"})
    else res.type("application/json").status(200).send(category)
}))

categoriesRouter.get("/:flavor_type", asyncHandler(async(req, res, next) => {
    // gets all of the categories in the specified flavor_type
    const categories = await categories.getAllCategories(req.params.flavor_type)

    if (categories == null) res.type("application/json").status(404).send({Error: "No categories found"})
    else res.type("application/json").status(200).send(categories)
}))

categoriesRouter.delete("/:id", asyncHandler(async(req, res, next) => {
    // delete the category with provided id
    const id = {_id: req.params.id}
    const count = await categories.deleteCategory(id)

    if (count === 0) res.type("application/json").status(404).send({Error: "Category not found"})
    else res.status(204).send()
}))

module.exports = {categoriesRouter};