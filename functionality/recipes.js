require('dotenv').config();

let PORT = process.env.PORT || 5004;
let url = "http://localhost:" + PORT

async function addRecipe (new_recipe) {
// creates a recipe in the database from the provided object. returns recipe if successful, undef if not
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

module.exports = {addRecipe, getRecipe, searchForRecipe, updateRecipe, deleteRecipe}