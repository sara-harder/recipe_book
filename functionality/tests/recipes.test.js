// import the recipe functions to be tested
const recipe_funcs = require("../backend_connection/recipes")

// set up the servers
const { openServer } = require('../../backend/tests/server'); 

let PORT = 5004
recipe_funcs.resetPort(PORT)

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
    connections: {2: [0], 3: [1]}
}
const recipe_2 = {
    name: "Fake",
    image: "image_1",
    portions: 4,
    ingredients: [new Ingredient("Pasta", 360, "g"), new Ingredient("Pecorino", 100, "g")],
    directions: ["Boil water", "Add salt", "Cook the pasta", "Grate the cheese"],
    connections: {2: [0], 3: [1]},
    source: "website/fake"
}
const recipe_3 = {
    name: "Teriyaki",
    portions: 6,
    ingredients: [new Ingredient("Rice", 300, "g"), new Ingredient("Chicken", 550, "g"), new Ingredient("Spices", 2, 'tsp')],
    directions: ["Boil water", "Add rice", "Cook on low", "Cook the chicken with the spices"],
    connections: {1: [0], 3: [1, 2]},
    source: "website/teriyaki-sauce"
}

describe("RECIPES FUNCTIONALITY TESTS", () => {
    let id_1;
    let id_2;
    let id_3;

    performSyncTest("Create recipe (no img or src)", async () => {
        const recipe = await recipe_funcs.addRecipe(recipe_1.name, recipe_1.portions, recipe_1.ingredients, recipe_1.directions, recipe_1.connections)
        expect(
            recipe
        ).toMatchObject(
            recipe_1
        )
        id_1 = recipe._id
    })

    performSyncTest("Create recipe (w/ img and src)", async () => {
        const recipe = await recipe_funcs.addRecipe(recipe_2.name, recipe_2.portions, recipe_2.ingredients, recipe_2.directions, recipe_2.connections, recipe_2.image, recipe_2.source)
        expect(
            recipe
        ).toMatchObject(
            recipe_2
        )
        id_2 = recipe._id
    })

    performSyncTest("Create recipe (w/ src and no img)", async () => {
        const recipe = await recipe_funcs.addRecipe(recipe_3.name, recipe_3.portions, recipe_3.ingredients, recipe_3.directions, recipe_3.connections, null, recipe_3.source)
        expect(
            recipe
        ).toMatchObject(
            recipe_3
        )
        id_3 = recipe._id
    })

    performSyncTest("Fail recipe creation", async () => {
        const response = await recipe_funcs.addRecipe("Spaghetti")
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
        const recipe_results = await recipe_funcs.searchForRecipe("Fake")
        expect(
            recipe_results
        ).toMatchObject(
            [recipe_2]
        )
    })

    performSyncTest("Search for recipe 2 (shortened end)", async () => {
        const recipe_results = await recipe_funcs.searchForRecipe("ke")
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

    performSyncTest("Empty search", async () => {
        const response = await recipe_funcs.searchForRecipe("")
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
        ).not.toMatchObject(
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

    performSyncTest("Delete recipe 3", async () => {
        const response = await recipe_funcs.deleteRecipe(id_3)
        expect(
            response
        ).toBe(true)
    })

    

    create_failed = false
})
