const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    // creates a Schema for the user table in the database
    username: { type: String, required: true },
    fullname: { type: String, required: true },
    favorites: { type: Object, required: true },
    recents: { type: Object, required: true },
})

// creates a User model class based on the precreated Schema
const User = mongoose.model("User", userSchema)


const createUser = async(username, fullname) => {
    // uses the User class to create a new user object
    const user = new User({username, fullname, favorites: [], recents: []})
    return user.save()
}

const getUser = async(filter) => {
    // finds the user based on id
    const query = User.findOne(filter)
    return query.exec()
}


const updateUser = async(filter, update) => {
    // finds the user based on id, then updates the provided criteria for that user
    await User.updateOne(filter, update)
    const query = User.findOne(filter)
    return query.exec()
}


const deleteUser = async(filter) => {
    // finds the user based on id and deletes them if in existence
    const response = await User.deleteOne(filter)
    return response.deletedCount
}

module.exports = {createUser, getUser, updateUser, deleteUser};