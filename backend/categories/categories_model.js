const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
    // creates a Schema for the category table in the database
    name: { type: String, required: true },
    flavor_type: { type: String, required: true }
})

// creates a Category model class based on the precreated Schema
const Category = mongoose.model("Category", categorySchema)


const createCategory = async(name, flavor_type) => {
    // uses the Category class to create a new category object
    const category = new Category({name, flavor_type})
    return category.save()
}

const getCategory = async(filter) => {
    // finds the category based on id or name
    const query = Category.findOne(filter)
    return query.exec()
}

const getAllCategories = async(filter) => {
    // retrieves all the categories marked with the specified flavor_type
    const query = Category.find(filter)
    return query.exec()
}

const deleteCategory = async(filter) => {
    // finds the category based on id and deletes it if in existence
    const response = await Category.deleteOne(filter)
    return response.deletedCount
}

module.exports = {createCategory, getCategory, getAllCategories, deleteCategory};