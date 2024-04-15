import express from 'express';

import usersRouter from './users/users_controller.mjs';
import recipesRouter from './recipes/recipes_controller.mjs';
import categoriesRouter from './categories/categories_controller.mjs';
import reccatRouter from './recipe_in_category/recipe_cat_controller.mjs';

const router = module.exports = express.Router();

router.use('/users', usersRouter);
router.use('/recipes', recipesRouter);
router.use('/categories', categoriesRouter);
router.use('/recipe-in-category', reccatRouter);
