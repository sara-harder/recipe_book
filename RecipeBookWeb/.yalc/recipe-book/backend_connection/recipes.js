const URL = require("./connection")

let url = URL;

function resetPort (port) {
// used to set the correct port during testing
    url = "http://localhost:" + port
}

async function addRecipe (name, portions, ingredients, directions, image=null, source=null) {
// creates a recipe in the database from the provided params. returns recipe if successful, undef if not
    const new_recipe = {
        name: name,
        image: image,
        portions: portions,
        ingredients: ingredients,
        directions: directions,
        source: source
    }

    let recipe;
    try {
        const response = await fetch(url + "/recipes", {
            method: "POST", 
            body: JSON.stringify(new_recipe),
            headers: {"Content-type": "application/json"}
        })
        recipe = await response.json()

        if (recipe.Error) {throw (recipe.Error)}
    } catch (error) { 
        console.error(error)
        recipe = undefined
    }

    return recipe
}


async function getRecipe (recipe_id) {
// returns the recipe based on the provided id
    let recipe;
    try {
        const response = await fetch(url + `/recipes/${recipe_id}`)
        recipe = await response.json()

        if (recipe.Error) {throw (recipe.Error)}
    } catch (error) { 
        console.error(error)
        recipe = undefined
    }

    return recipe
}

async function searchForRecipe (search) {
// returns a list of recipes that match the provided search
    let found_recipes;
    if (search.length == 0) return undefined
    try {
        const response = await fetch(url + `/recipes/search/${search}`)
        found_recipes = await response.json()

        if (found_recipes.Error) {throw (found_recipes.Error)}
    } catch (error) { 
        console.error(error)
        found_recipes = undefined
    }

    return found_recipes
}

async function updateRecipe (recipe_id, updates) {
// updates a recipe based on the provided id using the provided updates. returns recipe if successful, undef if not
    let recipe;
    try {
        const response = await fetch(url + `/recipes/${recipe_id}`, {
            method: "PUT", 
            body: JSON.stringify(updates),
            headers: {"Content-type": "application/json"}
        })
        recipe = await response.json()

        if (recipe.Error) {throw (recipe.Error)}
    } catch (error) { 
        console.error(error)
        recipe = undefined
    }

    return recipe
}

async function deleteRecipe (recipe_id) {
// deletes a recipe based on the provided id. returns true if successful, false if not
    try {
        const res = await fetch(url + `/recipes/${recipe_id}`, {method: "DELETE"})
        
        if (res.status == 204) return true
        else {
            const response = await res.json()
            throw (response.Error)
        }
    } catch (error) { 
        return false
    }
}

module.exports = {addRecipe, getRecipe, searchForRecipe, updateRecipe, deleteRecipe, resetPort}