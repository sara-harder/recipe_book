import express from 'express';
import asyncHandler from 'express-async-handler';
import * as intersections from './recipe_cat_model.mjs';

const bodyParser = require('body-parser');
const reccatRouter = express.Router();
reccatRouter.use(bodyParser.json());


export default reccatRouter;