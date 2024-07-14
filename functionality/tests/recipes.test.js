// import the recipe functions to be tested
const recipe_funcs = require("../recipes")

// set up the servers
const { openServer } = require('../../backend/tests/server'); 

let PORT = 5004

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

// create the data to be tested
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


describe("RECIPES FUNCTIONALITY TESTS", () => {
    let id_1;
    let id_2;

    performSyncTest("Create recipe (no img or src)", async () => {
        const recipe = await recipe_funcs.addRecipe(recipe_1)
        expect(
            recipe
        ).toMatchObject(
            recipe_1
        )
        id_1 = recipe._id
    })

    performSyncTest("Create recipe (w/ img and src)", async () => {
        const recipe = await recipe_funcs.addRecipe(recipe_2)
        expect(
            recipe
        ).toMatchObject(
            recipe_2
        )
        id_2 = recipe._id
    })

    performSyncTest("Fail recipe creation", async () => {
        const new_recipe = {name: "Spaghetti"}
        const response = await recipe_funcs.addRecipe(new_recipe)
        expect(response).toBeUndefined()
    })

    performSyncTest("Get recipe 1", async () => {
        const recipe = await recipe_funcs.getRecipe(id_1)
        expect(
            recipe
        ).toMatchObject(
            recipe_1
        )
    })

    performSyncTest("Fail get recipe", async () => {
        const response = await recipe_funcs.getRecipe('633b47e164a80559f146166c')
        expect(response).toBeUndefined()
    })

    performSyncTest("Search for recipe 2", async () => {
        const recipe_results = await recipe_funcs.searchForRecipe("Carbonara")
        expect(
            recipe_results
        ).toMatchObject(
            [recipe_2]
        )
    })

    performSyncTest("Search for recipe 2 (shortened start)", async () => {
        const recipe_results = await recipe_funcs.searchForRecipe("ara")
        expect(
            recipe_results
        ).toMatchObject(
            [recipe_2]
        )
    })

    performSyncTest("No search results", async () => {
        const response = await recipe_funcs.searchForRecipe("Mushroom")
        expect(response).toBeUndefined()
    })

    performSyncTest("Update portions", async () => {
        recipe_1.portions = 2
        const recipe = await recipe_funcs.updateRecipe(id_1, {portions: recipe_1.portions})
        expect(
            recipe
        ).toMatchObject(
            recipe_1
        )
    })

    performSyncTest("Fail get recipe for update", async () => {
        const response = await recipe_funcs.updateRecipe("633b47e164a80559f146166c", {portions: recipe_1.portions})
        expect(response).toBeUndefined()
    })

    performSyncTest("Update ingredients", async () => {
        recipe_2.ingredients.push([new Ingredient("Eggs", 2)])
        const recipe = await recipe_funcs.updateRecipe(id_2, {ingredients: recipe_2.ingredients})
        expect(
            recipe
        ).toMatchObject(
            recipe_2
        )
    })

    performSyncTest("Update recipe portions again", async () => {
        const recipe = await recipe_funcs.updateRecipe(id_1, {portions: 4})
        expect(
            recipe
        ).not.toEqual(
            recipe_1
        )
    })

    performSyncTest("Fail delete recipe", async () => {
        const response = await recipe_funcs.deleteRecipe("633b47e164a80559f146166c")
        expect(
            response
        ).toBe(false)
    })

    performSyncTest("Delete recipe 1", async () => {
        const response = await recipe_funcs.deleteRecipe(id_1)
        expect(
            response
        ).toBe(true)
    })

    performSyncTest("Delete recipe 2", async () => {
        const response = await recipe_funcs.deleteRecipe(id_2)
        expect(
            response
        ).toBe(true)
    })

    

    create_failed = false
})
