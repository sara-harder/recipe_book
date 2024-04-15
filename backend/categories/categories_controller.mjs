import express from 'express';
import asyncHandler from 'express-async-handler';
import * as categories from './categories_model.mjs';

const bodyParser = require('body-parser');
const categoriesRouter = express.Router();
categoriesRouter.use(bodyParser.json());


export default categoriesRouter;