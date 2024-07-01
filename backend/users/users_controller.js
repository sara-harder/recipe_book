const express = require('express');
const asyncHandler = require('express-async-handler')
const users = require('./users_model.js');

const bodyParser = require('body-parser');
const usersRouter = express.Router();
usersRouter.use(bodyParser.json());


usersRouter.post("/", asyncHandler(async(req, res, next) => {
    // creates a user in the database
    const user = await users.createUser(req.body.username, req.body.fullname, [], [])

    if (user == null) res.type("application/json").status(500).send({Error: "Could not create user"})
    res.type("application/json").status(201).send(user)
}))

usersRouter.get("/:id", asyncHandler(async(req, res, next) => {
    // get the user based on the provided id
    const id = {_id: req.params.id}
    const user = await users.getUser(id)

    if (user == null) res.type("application/json").status(404).send({Error: "User not found"})
    else res.type("application/json").status(200).send(user)
}))

usersRouter.put("/:id", asyncHandler(async(req, res, next) => {
    // updates the user based on the provided id using the provided update data
    const id = {_id: req.params.id}
    const user = await users.updateUser(id, req.body)

    if (user == null) res.type("application/json").status(404).send({Error: "User not found"})
    else res.type("application/json").status(200).send(user)
}))

usersRouter.delete("/:id", asyncHandler(async(req, res, next) => {
    // delete the user with provided id
    const id = {_id: req.params.id}
    const count = await users.deleteUser(id)

    if (count === 0) res.type("application/json").status(404).send({Error: "User not found"})
    else res.status(204).send()
}))

module.exports = {usersRouter};