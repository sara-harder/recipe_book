let PORT = 5001;
let url = "http://10.0.2.2:" + PORT

function resetPort (port) {
// used to set the correct port during testing
    url = "http://localhost:" + port
}

async function connectRecipeCat (recipe, category) {
// connects a recipe to a category in the database from the provided ids. returns recipe_cat if successful, undef if not
    const new_recipe_cat = {
        recipe: recipe, 
        category: category
    }

    let recipe_cat;
    try {
        const response = await fetch(url + "/recipe-in-category", {
            method: "POST", 
            body: JSON.stringify(new_recipe_cat),
            headers: {"Content-type": "application/json"}
        })
        recipe_cat = await response.json()

        if (recipe_cat.Error) {throw (recipe_cat.Error)}
    } catch (error) { 
        console.error(error)
        recipe_cat = undefined
    }

    return recipe_cat
}


async function getRecipes (category_id) {
// returns a list of recipes in the specified category
    let recipes;
    try {
        const response = await fetch(url + `/recipe-in-category/recipes/${category_id}`)
        recipes = await response.json()

        if (recipes.Error) {throw (recipes.Error)}
    } catch (error) { 
        console.error(error)
        recipes = undefined
    }

    return recipes
}

async function getCategories (recipe_id) {
// returns a list of categories for the specified recipe
    let categories;
    try {
        const response = await fetch(url + `/recipe-in-category/categories/${recipe_id}`)
        categories = await response.json()

        if (categories.Error) {throw (categories.Error)}
    } catch (error) { 
        console.error(error)
        categories = undefined
    }

    return categories
}

async function deleteRecipeCat (recipe_cat_id) {
// deletes a recipe_cat based on the provided id. returns true if successful, false if not
    try {
        const res = await fetch(url + `/recipe-in-category/${recipe_cat_id}`, {method: "DELETE"})
        
        if (res.status == 204) return true
        else {
            const response = await res.json()
            throw (response.Error)
        }
    } catch (error) { 
        return false
    }
}

module.exports = {connectRecipeCat, getRecipes, getCategories, deleteRecipeCat, resetPort}