import * as category_funcs from "./backend_connection/categories.js"
import * as rec_cat_funcs from "./backend_connection/recipes_in_categories.js"

import fractionUnicode from 'fraction-unicode';

function twoColumns(data) {
// separates data into two columns, one by one instead of split in half
    const col_1 = []
    const col_2 = []

    for (const elem of data) {
        if (data.indexOf(elem) % 2 == 0){
            col_1.push(elem)
        } else col_2.push(elem)
    }

    return [col_1, col_2]
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
    const data = await category_funcs.getFlavorType(flavor_type)

    const categories = []
    for (const category of data) {
        const len = await rec_cat_funcs.countRecipes(category._id)
        if (len != 0) categories.push(category)
    }

    let len = 6
    if (categories.length < len) len = categories.length

    const rands = generateRandoms(categories.length, len)
    const res = []
    const ids = []

    for (const r of rands) {
        const cat = categories[r]
        const recipes = await rec_cat_funcs.getRecipes(cat._id)

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

const getFraction = (num) => {
// evaluates a number less than one and determines what fraction it is based on predetermined fractions
    if (Math.abs(num - 0.75)    < 0.01) return [3, 4]
    if (Math.abs(num - 0.666)   < 0.01) return [2, 3]
    if (Math.abs(num - 0.5)     < 0.01) return [1, 2]
    if (Math.abs(num - 0.333)   < 0.01) return [1, 3]
    if (Math.abs(num - 0.25)    < 0.01) return [1, 4]
    if (Math.abs(num - 0.166)   < 0.01) return [1, 6]
    if (Math.abs(num - 0.125)   < 0.01) return [1, 8]
    return [num, 1]
}

const checkFraction = (num) => {
// checks if a number needs to be converted to a fraction. if it does, returns the unicode form
    if (num == undefined) return undefined
    if (num < 1) {
        const res = getFraction(num)
        return `${fractionUnicode(res[0], res[1])} `
    }
    // if fraction required but it's greater than 1, combine whole number with unicode fraction
    if (num % 1 !== 0) {
        const res = getFraction(num % 1)
        return `${Math.floor(num/1)}${fractionUnicode(res[0], res[1])} `
    }
    return num
}

export {twoColumns, getRandomRecipes, checkFraction}