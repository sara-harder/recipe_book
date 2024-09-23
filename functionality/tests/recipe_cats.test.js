// import the recipe_cat functions to be tested
const rec_cat_funcs = require("../backend_connection/recipes_in_categories")
const recipe_funcs = require("../backend_connection/recipes")
const category_funcs = require("../backend_connection/categories")

// set up the servers
const { openServer } = require('../../backend/tests/server'); 

let PORT = 5005
rec_cat_funcs.resetPort(PORT)
recipe_funcs.resetPort(PORT)
category_funcs.resetPort(PORT)

jest.setTimeout(60000);

let closeServer = () => {};

beforeAll(async () => {
    closeServer = await openServer(PORT)
})

// close connection to MongoDB after all tests are performed
afterAll(() => {
    closeServer()
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
    name: "Tomato Pasta",
    portions: 4,
    ingredients: [new Ingredient("Pasta", 360, "g"), new Ingredient("Tomato Sauce", 100, "g")],
    directions: ["Boil water", "Add salt", "Cook the pasta", "Heat up the tomato sauce"],
}
const recipe_2 = {
    name: "Carbonara",
    image: "image_1",
    portions: 4,
    ingredients: [new Ingredient("Pasta", 360, "g"), new Ingredient("Pecorino", 100, "g")],
    directions: ["Boil water", "Add salt", "Cook the pasta", "Grate the cheese"],
    source: "website/carbonara"
}
const category = {
    name: "Pasta",
    flavor_type: "Savory"
}

let recipe_1_id, recipe_2_id, category_id;
let recipe_in_cat_1, recipe_in_cat_2;

// Create the test data
describe("CREATE TEST DATA", () => {
    performSyncTest("Create recipe_1", async () => {
        const recipe = await recipe_funcs.addRecipe(recipe_1.name, recipe_1.portions, recipe_1.ingredients, recipe_1.directions)
        expect(
            recipe
        ).toMatchObject(
            recipe_1
        )
        recipe_1_id = recipe._id
    })

    performSyncTest("Create recipe_2", async () => {
        const recipe = await recipe_funcs.addRecipe(recipe_2.name, recipe_2.portions, recipe_2.ingredients, recipe_2.directions, recipe_2.image, recipe_2.source)
        expect(
            recipe
        ).toMatchObject(
            recipe_2
        )
        recipe_2_id = recipe._id
    })

    performSyncTest("Create category", async () => {
        const cat = await category_funcs.addCategory(category.name, category.flavor_type)
        expect(
            cat
        ).toMatchObject(
            category
        )
        category_id = cat._id
    })

    performSyncTest("Create recipe_in_cat_1", () => {
        recipe_in_cat_1 = {
            recipe: String(recipe_1_id),
            category: String(category_id)
        }
        expect(
            recipe_in_cat_1
        ).not.toBeNull
    })

    performSyncTest("Create recipe_in_cat_2", () => {
        recipe_in_cat_2 = {
            recipe: String(recipe_2_id),
            category: String(category_id)
        }
        expect(
            recipe_in_cat_2
        ).not.toBeNull
    })
})


describe("RECIPES IN CATEGORIES FUNCTIONALITY TESTS", () => {
    let id_1;
    let id_2;

    performSyncTest("Connect recipe_1 to category", async () => {
        const recipe_cat = await rec_cat_funcs.connectRecipeCat(recipe_1_id, category_id)
        expect(
            recipe_cat
        ).toMatchObject(
            recipe_in_cat_1
        )
        id_1 = recipe_cat._id
    })

    performSyncTest("Connect recipe_2 to category", async () => {
        const recipe_cat = await rec_cat_funcs.connectRecipeCat(recipe_2_id, category_id)
        expect(
            recipe_cat
        ).toMatchObject(
            recipe_in_cat_2
        )
        id_2 = recipe_cat._id
    })

    performSyncTest("Fail recipe_cat creation", async () => {
        const new_recipe_cat = {recipe: recipe_1_id}
        const response = await rec_cat_funcs.connectRecipeCat(new_recipe_cat)
        expect(response).toBeUndefined()
    })

    performSyncTest("Get all recipes in a category", async () => {
        const count = await rec_cat_funcs.countRecipes(category_id)
        expect(count).toEqual(2)
    })

    performSyncTest("Get all recipes in a category", async () => {
        const results = await rec_cat_funcs.getRecipes(category_id)
        expect(
            results
        ).toMatchObject(
            [recipe_1, recipe_2]
        )
    })

    performSyncTest("Get all categories for a recipe", async () => {
        const results = await rec_cat_funcs.getCategories(recipe_1_id)
        expect(
            results
        ).toMatchObject(
            [category]
        )
    })

    performSyncTest("Get all recipes for non-existant category", async () => {
        const response = await rec_cat_funcs.getCategories("633b47e164a80559f146166c")
        expect(response).toBeUndefined()
    })

    performSyncTest("Fail delete recipe_cat", async () => {
        const response = await rec_cat_funcs.deleteRecipeCat("633b47e164a80559f146166c")
        expect(
            response
        ).toBe(false)
    })

    performSyncTest("Delete recipe_cat 1", async () => {
        const response = await rec_cat_funcs.deleteRecipeCat(id_1)
        expect(
            response
        ).toBe(true)
    })

    performSyncTest("Delete recipe_cat 2", async () => {
        const response = await rec_cat_funcs.deleteRecipeCat(id_2)
        expect(
            response
        ).toBe(true)
    })

    

    create_failed = false
})


// Delete the test data
describe("DELETE TEST DATA", () => {
    performSyncTest("Delete recipe_1", async () => {
        const response = await recipe_funcs.deleteRecipe(recipe_1_id)
        expect(
            response
        ).toBe(true)
    })

    performSyncTest("Delete recipe_2", async () => {
        const response = await recipe_funcs.deleteRecipe(recipe_2_id)
        expect(
            response
        ).toBe(true)
    })

    performSyncTest("Delete category", async () => {
        const response = await category_funcs.deleteCategory(category_id)
        expect(
            response
        ).toBe(true)
    })
})