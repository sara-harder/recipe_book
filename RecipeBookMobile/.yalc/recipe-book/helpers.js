import * as category_funcs from "./backend_connection/categories.js"
import * as rec_cat_funcs from "./backend_connection/recipes_in_categories.js"

function createFlexTable (num_columns, data_length) {
    // determine the num of rows required based on num columns
    const num_rows = Math.floor(data_length / num_columns)
    const row_idxs = []
    let n = 0
    for (let i=0; i < num_rows; i+=1) {
        // push the idx to slice from the data for each row
        row_idxs.push([n, n+num_columns])
        n += num_columns
    }

    // add one last row for remainders
    const i = data_length % num_columns
    if (i !== 0) {
        row_idxs.push([data_length-i, data_length])
    }

    return row_idxs
}

function generateRandoms(int, result_length) {
// returns an array length result_length with random numbers between 0 and int
    const rands = []

    for (let i = 0; i < result_length; i++) {
        let r = Math.floor(Math.random() * int)
        while (rands.includes(r)){
            r = Math.floor(Math.random() * int)
        }
        
        rands.push(r)
    }

    return (rands)
}

async function getRandomRecipes(flavor_type) {
// takes a flavor type and returns 5 random recipes from random categories in that flavor_type
    const categories = await category_funcs.getFlavorType(flavor_type)

    let len = 5
    if (categories.length < len) len = categories.length

    const rands = generateRandoms(categories.length, len)
    const res = []
    const ids = []

    for (const r of rands) {
        const cat = categories[r]
        const recipes = await rec_cat_funcs.getRecipes(cat._id)

        if (recipes == undefined) continue

        let i = Math.floor(Math.random() * recipes.length)
        let recipe = recipes[i]
        let id = recipe._id

        while (ids.includes(id)) {
            recipes.splice(i, 1)

            if (recipes.length == 0) break

            i = Math.floor(Math.random() * recipes.length)
            recipe = recipes[i]
            id = recipe._id
        }
        if (recipes.length == 0) continue

        ids.push(id)
        res.push(recipe)
    }

    return res
}

export {createFlexTable, getRandomRecipes}