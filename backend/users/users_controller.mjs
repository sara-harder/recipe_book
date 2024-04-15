import express from 'express';
import asyncHandler from 'express-async-handler';
import * as users from './users_model.mjs';

const bodyParser = require('body-parser');
const usersRouter = express.Router();
usersRouter.use(bodyParser.json());


export default usersRouter;