require('dotenv').config();

// connect to the server
const server = require('../server')
const mongoose = require('mongoose');

// retrieve the recipe's model for testing
const recipes = require('../recipes/recipes_model');
const proxy = `http://localhost:${process.env.PORT}`

jest.setTimeout(60000);



// close connection to MongoDB after all tests are performed
afterAll(() => {
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

class Ingredient {
    constructor(name, quantity, unit) {
      this.name = name;
      this.quantity = quantity;
      this.unit = unit
    }
}


// Test the recipe model
describe.only("RECIPE MODEL TESTS", () => {
    let id_1;
    const recipe_1 = {
        name: "Tomato Pasta",
        portions: 4,
        ingredients: [new Ingredient("Pasta", 360, "g"), new Ingredient("Tomato Sauce", 100, "g")],
        directions: ["Boil water", "Add salt", "Cook the pasta", "Heat up the tomato sauce"],
    }
    let id_2;
    const recipe_2 = {
        name: "Carbonara",
        image: "image_1",
        portions: 4,
        ingredients: [new Ingredient("Pasta", 360, "g"), new Ingredient("Pecorino", 100, "g")],
        directions: ["Boil water", "Add salt", "Cook the pasta", "Grate the cheese"],
        source: "website/carbonara"
    }

    performSyncTest("Create recipe (no img or src)", async () => {
        const recipe = await recipes.createRecipe(recipe_1.name, recipe_1.portions, recipe_1.ingredients, recipe_1.directions)
        expect(
            recipe
        ).toMatchObject(
            recipe_1
        )
        id_1 = recipe.id
    })

    performSyncTest("Create recipe (w/ img and src)", async () => {
        const recipe = await recipes.createRecipe(recipe_2.name, recipe_2.portions, recipe_2.ingredients, recipe_2.directions, recipe_2.image, recipe_2.source)
        expect(
            recipe
        ).toMatchObject(
            recipe_2
        )
        id_2 = recipe.id
    })

    performSyncTest("Fail recipe creation", async () => {
        await expect(
            recipes.createRecipe(recipe_1.name, recipe_1.portions, recipe_1.ingredients)
        ).rejects.toThrow('Recipe validation failed')
    })

    performSyncTest("Get recipe 1", async () => {
        const recipe = await recipes.getRecipe({_id: id_1})
        expect(
            recipe
        ).toMatchObject(
            recipe_1
        )
    })

    performSyncTest("Get recipe 2", async () => {
        const recipe = await recipes.getRecipe({_id: id_2})
        expect(
            recipe
        ).toMatchObject(
            recipe_2
        )
    })

    performSyncTest("Fail get recipe", async () => {
        const recipe = await recipes.getRecipe({_id: "633b47e164a80559f146166c"})
        expect(
            recipe
        ).toBeNull()
    })

    performSyncTest("Search for recipe 2", async () => {
        const recipe_results = await recipes.searchForRecipe("Carbonara")
        expect(
            recipe_results
        ).toMatchObject(
            [recipe_2]
        )
    })

    performSyncTest("Search for recipe 2 (shortened start)", async () => {
        const recipe_results = await recipes.searchForRecipe("carb")
        expect(
            recipe_results
        ).toMatchObject(
            [recipe_2]
        )
    })

    performSyncTest("Search for recipe 2 (shortened end)", async () => {
        const recipe_results = await recipes.searchForRecipe("ara")
        expect(
            recipe_results
        ).toMatchObject(
            [recipe_2]
        )
    })

    performSyncTest("No search results", async () => {
        const recipe = await recipes.searchForRecipe("Mushroom")
        expect(
            recipe
        ).toMatchObject(
            []
        )
    })

    performSyncTest("Update portions", async () => {
        recipe_1.portions = 6
        const recipe = await recipes.updateRecipe({_id: id_1}, {portions: recipe_1.portions})
        expect(
            recipe
        ).toMatchObject(
            recipe_1
        )
    })

    performSyncTest("Fail get recipe for update", async () => {
        const recipe = await recipes.updateRecipe({_id: "633b47e164a80559f146166c"}, {portions: recipe_1.portions})
        expect(
            recipe
        ).toBeNull()
    })

    performSyncTest("Update ingredients", async () => {
        recipe_2.ingredients.push([new Ingredient("guanciale", 75, "g")])
        const recipe = await recipes.updateRecipe({_id: id_2}, {ingredients: recipe_2.ingredients})
        expect(
            recipe
        ).toMatchObject(
            recipe_2
        )
    })

    performSyncTest("Update recipe portions again", async () => {
        const recipe = await recipes.updateRecipe({_id: id_1}, {portions: 4})
        expect(
            recipe
        ).not.toEqual(
            recipe_1
        )
    })

    performSyncTest("Fail delete recipe", async () => {
        const delete_count = await recipes.deleteRecipe({_id: "633b47e164a80559f146166c"})
        expect(
            delete_count
        ).toEqual(
            0
        )
    })


    performSyncTest("Delete recipe 1", async () => {
        const delete_count = await recipes.deleteRecipe({_id: id_1})
        expect(
            delete_count
        ).toEqual(
            1
        )
    })

    performSyncTest("Delete recipe 2", async () => {
        const delete_count = await recipes.deleteRecipe({_id: id_2})
        expect(
            delete_count
        ).toEqual(
            1
        )
    })

    create_failed = false
})



