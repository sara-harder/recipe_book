async function addRecipe (new_recipe) {
// creates a recipe in the database from the provided object. returns recipe if successful, null if not
    let recipe;
    try {
        const response = await fetch("/recipes", {
            method: "POST", 
            body: JSON.stringify(new_recipe),
            headers: {"Content-type": "application/json"}
        })
        recipe = await response.json()
    } catch (error) { console.error(error) }

    return recipe
}


async function getRecipe (recipe_id) {
// returns the recipe based on the provided id
    let recipe;
    try {
        const response = await fetch(`/recipes/${recipe_id}`)
        recipe = await response.json()
    } catch (error) { console.error(error) }

    return recipe
}

async function searchForRecipe (search) {
// returns a list of recipes that match the provided search
    let found_recipes;
    try {
        const response = await fetch(`/recipes/search/${search}`)
        found_recipes = await response.json()
    } catch (error) { console.error(error) }

    return found_recipes
}

async function updateRecipe (recipe_id, updates) {
// updates a recipe based on the provided id using the provided updates. returns recipe if successful, null if not
    let recipe;
    try {
        const response = await fetch(`/recipes/${recipe_id}`, {
            method: "PUT", 
            body: JSON.stringify(updates),
            headers: {"Content-type": "application/json"}
        })
        recipe = await response.json()
    } catch (error) { console.error(error) }

    return recipe
}

async function deleteRecipe (recipe_id) {
// deletes a recipe based on the provided id. returns true if successful, false if not
    try {
        await fetch(`/recipes/${recipe_id}`, {method: "DELETE"})
        return true
    } catch (error) { 
        console.error(error)
        return false
    }
}

export {addRecipe, getRecipe, searchForRecipe, updateRecipe, deleteRecipe}