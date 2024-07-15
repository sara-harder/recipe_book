const express = require('express');

const {usersRouter} = require('./users/users_controller.js');
const {recipesRouter} = require('./recipes/recipes_controller.js');
const {categoriesRouter} = require('./categories/categories_controller.js');
const {reccatRouter} = require('./recipe_in_category/recipe_cat_controller.js');

const router = module.exports = express.Router();

router.use('/users', usersRouter);
router.use('/recipes', recipesRouter);
router.use('/categories', categoriesRouter);
router.use('/recipe-in-category', reccatRouter);
