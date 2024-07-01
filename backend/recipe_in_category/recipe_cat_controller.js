const express = require('express');
const asyncHandler = require('express-async-handler')
const recipe_cats = require('./recipe_cat_model.js');

const bodyParser = require('body-parser');
const reccatRouter = express.Router();
reccatRouter.use(bodyParser.json());

module.exports = {reccatRouter};