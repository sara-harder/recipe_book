// retrieve the recipe_cat's model for testing and recipes and categories for use
const recipe_cats = require('../recipe_in_category/recipe_cat_model');
const recipes = require('../recipes/recipes_model');
const categories = require('../categories/categories_model');

// set up the servers
const { openServer } = require('./server');

let PORT = 5005;
const proxy = `http://localhost:${PORT}`

jest.setTimeout(60000);

let closeServer = () => {};

beforeAll(async () => {
    closeServer = await openServer(PORT)
})


// close connection to MongoDB after all tests are performed
afterAll(async () => {
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
        const recipe = await recipes.createRecipe(recipe_1.name, recipe_1.portions, recipe_1.ingredients, recipe_1.directions)
        expect(
            recipe
        ).toMatchObject(
            recipe_1
        )
        recipe_1_id = recipe._id
    })

    performSyncTest("Create recipe_2", async () => {
        const recipe = await recipes.createRecipe(recipe_2.name, recipe_2.portions, recipe_2.ingredients, recipe_2.directions, recipe_2.image, recipe_2.source)
        expect(
            recipe
        ).toMatchObject(
            recipe_2
        )
        recipe_2_id = recipe._id
    })

    performSyncTest("Create category", async () => {
        const cat = await categories.createCategory(category.name, category.flavor_type)
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




// Test the recipe in category model
describe("RECIPE_CAT MODEL TESTS", () => {
    let id_1;
    let id_2;

    performSyncTest("Connect recipe_1 to category", async () => {
        const recipe_cat = await recipe_cats.createRecipeCategory(recipe_1_id, category_id)
        expect(
            recipe_cat
        ).toMatchObject(
            recipe_in_cat_1
        )
        id_1 = recipe_cat._id
    })

    performSyncTest("Connect recipe_2 to category", async () => {
        const recipe_cat = await recipe_cats.createRecipeCategory(recipe_2_id, category_id)
        expect(
            recipe_cat
        ).toMatchObject(
            recipe_in_cat_2
        )
        id_2 = recipe_cat._id
    })

    performSyncTest("Fail recipe_cat creation", async () => {
        await expect(
            recipe_cats.createRecipeCategory(recipe_1_id)
        ).rejects.toThrow('RecipeCategory validation failed')
    })

    performSyncTest("Get all recipe_cats for a category", async () => {
        const results = await recipe_cats.getAllRecipeCategories({category: category_id})
        expect(
            results
        ).toMatchObject(
            [recipe_in_cat_1, recipe_in_cat_2]
        )
    })

    performSyncTest("Get all recipe_cats for a recipe", async () => {
        const results = await recipe_cats.getAllRecipeCategories({recipe: recipe_1_id})
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
        const new_recipe_cat = {recipe: recipe_1_id}
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
        const response = await fetch(`${proxy}/recipe-in-category/recipes/${category_id}`)
        const recipes = await response.json()
        expect(
            recipes
        ).toMatchObject(
            [recipe_1, recipe_2]
        )
    })

    performSyncTest("Get all categories for a recipe", async () => {
        const response = await fetch(`${proxy}/recipe-in-category/categories/${recipe_1_id}`)
        const categories = await response.json()
        expect(
            categories
        ).toMatchObject(
            [category]
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


// Delete the test data
describe("DELETE TEST DATA", () => {
    performSyncTest("Delete recipe_1", async () => {
        const delete_count = await recipes.deleteRecipe({_id: recipe_1_id})        
        expect(
            delete_count
        ).toEqual(
            1
        )
    })

    performSyncTest("Delete recipe_2", async () => {
        const delete_count = await recipes.deleteRecipe({_id: recipe_2_id})        
        expect(
            delete_count
        ).toEqual(
            1
        )
    })

    performSyncTest("Delete category", async () => {
        const delete_count = await categories.deleteCategory({_id: category_id})
        expect(
            delete_count
        ).toEqual(
            1
        )
    })
})