import express from 'express';
import asyncHandler from 'express-async-handler';
import * as recipes from './recipes_model.mjs';

const bodyParser = require('body-parser');
const recipesRouter = express.Router();
recipesRouter.use(bodyParser.json());


export default recipesRouter;