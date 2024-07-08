require('dotenv').config();    

// connect to the server
server = require('../server')
const mongoose = require('mongoose');

// retrieve the recipe_cat's model for testing and recipes and categories for use
const recipe_cats = require('../recipe_in_category/recipe_cat_model');
const recipes = require('../recipes/recipes_model');
const categories = require('../categories/categories_model');

const proxy = `http://localhost:${process.env.PORT}`

jest.setTimeout(60000);

beforeAll(async () => {
    // create the connection to mongodb
    await mongoose.connect(
        process.env.MONGODB_CONNECT_STRING
    );

    const db = mongoose.connection;

    db.once("open", () => {
        console.log("Successfully connected to MongoDB using Mongoose!");
    });
})


// close connection to MongoDB after all tests are performed
afterAll(async () => {
    mongoose.connection.close()
    server.closeServer()
})





// source for sequential test code: https://stackoverflow.com/questions/51250006/jest-stop-test-suite-after-first-fail
// accessed 2 July 2024
let create_failed = false;
const performSyncTest = (test_name, test_func) => {
    test(test_name, async () => {  
        if(create_failed){
          console.warn(`[skipped]: ${test_name}`)} 
        else {
            try {         
              await test_func()
            } 
            catch (error) {           
              if (test_name.includes("Create")) create_failed = true
              throw error
            }            
        }
      })
}



// create the sample data

class Ingredient {
    constructor(name, quantity, unit=null) {
      this.name = name;
      this.quantity = quantity;
      this.unit = unit;
    }
}

const recipe_1 = {
    _id: "recipe1_id",
    name: "Tomato Pasta",
    portions: 4,
    ingredients: [new Ingredient("Pasta", 360, "g"), new Ingredient("Tomato Sauce", 100, "g")],
    directions: ["Boil water", "Add salt", "Cook the pasta", "Heat up the tomato sauce"],
}
const recipe_2 = {
    _id: "recipe2_id",
    name: "Carbonara",
    image: "image_1",
    portions: 4,
    ingredients: [new Ingredient("Pasta", 360, "g"), new Ingredient("Pecorino", 100, "g")],
    directions: ["Boil water", "Add salt", "Cook the pasta", "Grate the cheese"],
    source: "website/carbonara"
}

const category = {
    _id: "category_id",
    name: "Pasta",
    flavor_type: "Savory"
}

const recipe_in_cat_1 = {
    recipe: String(recipe_1._id),
    category: String(category._id)
}

const recipe_in_cat_2 = {
    recipe: String(recipe_2._id),
    category: String(category._id)
}


// Test the recipe in category model
describe("RECIPE_CAT MODEL TESTS", () => {
    let id_1;
    let id_2;

    performSyncTest("Connect recipe_1 to category", async () => {
        const recipe_cat = await recipe_cats.createRecipeCategory(recipe_1._id, category._id)
        expect(
            recipe_cat
        ).toMatchObject(
            recipe_in_cat_1
        )
        id_1 = recipe_cat._id
    })

    performSyncTest("Connect recipe_2 to category", async () => {
        const recipe_cat = await recipe_cats.createRecipeCategory(recipe_2._id, category._id)
        expect(
            recipe_cat
        ).toMatchObject(
            recipe_in_cat_2
        )
        id_2 = recipe_cat._id
    })

    performSyncTest("Fail recipe_cat creation", async () => {
        await expect(
            recipe_cats.createRecipeCategory(recipe_1._id)
        ).rejects.toThrow('RecipeCategory validation failed')
    })

    performSyncTest("Get all recipe_cats for a category", async () => {
        const results = await recipe_cats.getAllRecipeCategories({category: category._id})
        expect(
            results
        ).toMatchObject(
            [recipe_in_cat_1, recipe_in_cat_2]
        )
    })

    performSyncTest("Get all recipe_cats for a recipe", async () => {
        const results = await recipe_cats.getAllRecipeCategories({recipe: recipe_1._id})
        expect(
            results
        ).toMatchObject(
            [recipe_in_cat_1]
        )
    })

    performSyncTest("Get all recipe_cats for non-existant category", async () => {
        const results = await recipe_cats.getAllRecipeCategories({category: "633b47e164a80559f146166c"})
        expect(
            results
        ).toMatchObject(
            []
        )
    })

    performSyncTest("Fail delete recipe_cat", async () => {
        const delete_count = await recipe_cats.deleteRecipeCategory({_id: "633b47e164a80559f146166c"})
        expect(
            delete_count
        ).toEqual(
            0
        )
    })


    performSyncTest("Delete recipe_cat 1", async () => {
        const delete_count = await recipe_cats.deleteRecipeCategory({_id: id_1})
        expect(
            delete_count
        ).toEqual(
            1
        )
    })

    performSyncTest("Delete recipe_cat 2", async () => {
        const delete_count = await recipe_cats.deleteRecipeCategory({_id: id_2})
        expect(
            delete_count
        ).toEqual(
            1
        )
    })

    create_failed = false
})



// Test the recipe in category controller
describe("RECIPE_CAT CONTROLLER TESTS", () => {
    let id_1;
    let id_2;

    performSyncTest("Connect recipe_1 to category", async () => {
        const response = await fetch(`${proxy}/recipe-in-category`, {
                            method: "POST", 
                            body: JSON.stringify(recipe_in_cat_1),
                            headers: {"Content-type": "application/json"}
        })
        const recipe_cat = await response.json()

        expect(
            recipe_cat
        ).toMatchObject(
            recipe_in_cat_1
        )
        id_1 = recipe_cat._id
    })

    performSyncTest("Connect recipe_2 to category", async () => {
        const response = await fetch(`${proxy}/recipe-in-category`, {
                            method: "POST", 
                            body: JSON.stringify(recipe_in_cat_2),
                            headers: {"Content-type": "application/json"}
        })
        const recipe_cat = await response.json()

        expect(
            recipe_cat
        ).toMatchObject(
            recipe_in_cat_2
        )
        id_2 = recipe_cat._id
    })

    performSyncTest("Fail recipe_cat creation", async () => {
        const new_recipe_cat = {recipe: recipe_1._id}
        const response = await fetch(`${proxy}/recipe-in-category`, {
                            method: "POST", 
                            body: JSON.stringify(new_recipe_cat),
                            headers: {"Content-type": "application/json"}
        })
        expect(
            response.status
        ).toEqual(
            500
        )
    })

    performSyncTest("Get all recipes for a category", async () => {
        const response = await fetch(`${proxy}/recipe-in-category/recipes/${category._id}`)
        const recipes = await response.json()
        expect(
            recipes
        ).toMatchObject(
            [recipe_in_cat_1.recipe, recipe_in_cat_2.recipe]
        )
    })

    performSyncTest("Get all categories for a recipe", async () => {
        const response = await fetch(`${proxy}/recipe-in-category/categories/${recipe_1._id}`)
        const categories = await response.json()
        expect(
            categories
        ).toMatchObject(
            [recipe_in_cat_1.category]
        )
    })

    performSyncTest("Get all recipes for non-existant category", async () => {
        const response = await fetch(`${proxy}/recipe-in-category/recipes/633b47e164a80559f146166c`)
        expect(
            response.status
        ).toEqual(
            404
        )
    })

    performSyncTest("Fail delete recipe_cat", async () => {
        const response = await fetch(`${proxy}/recipe-in-category/${"633b47e164a80559f146166c"}`, {method: "DELETE"})
        expect(
            response.status
        ).toEqual(
            404
        )
    })

    performSyncTest("Delete recipe_cat 1", async () => {
        const response = await fetch(`${proxy}/recipe-in-category/${id_1}`, {method: "DELETE"})
        expect(
            response.status
        ).toEqual(
            204
        )
    })

    performSyncTest("Delete recipe_cat 2", async () => {
        const response = await fetch(`${proxy}/recipe-in-category/${id_2}`, {method: "DELETE"})
        expect(
            response.status
        ).toEqual(
            204
        )
    })

    

    create_failed = false
})



