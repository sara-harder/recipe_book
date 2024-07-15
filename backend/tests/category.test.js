// retrieve the category's model for testing
const categories = require('../categories/categories_model');

// set up the servers
const { openServer } = require('./server');

let PORT = 5003;
const proxy = `http://localhost:${PORT}`

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

const category_1 = {
    name: "Pasta",
    flavor_type: "Savory"
}

const category_2 = {
    name: "Rice",
    flavor_type: "Savory"
}


// Test the category model
describe("CATEGORY MODEL TESTS", () => {
    let id_1;
    let id_2;

    performSyncTest("Create category 1", async () => {
        const category = await categories.createCategory(category_1.name, category_1.flavor_type)
        expect(
            category
        ).toMatchObject(
            category_1
        )
        id_1 = category._id
    })

    performSyncTest("Create category 2", async () => {
        const category = await categories.createCategory(category_2.name, category_2.flavor_type)
        expect(
            category
        ).toMatchObject(
            category_2
        )
        id_2 = category._id
    })

    performSyncTest("Fail category creation", async () => {
        await expect(
            categories.createCategory(category_1.name)
        ).rejects.toThrow('Category validation failed')
    })

    performSyncTest("Get category", async () => {
        const category = await categories.getCategory({_id: id_1})
        expect(
            category
        ).toMatchObject(
            category_1
        )
    })

    performSyncTest("Fail get category", async () => {
        const category = await categories.getCategory({_id: "633b47e164a80559f146166c"})
        expect(
            category
        ).toBeNull()
    })

    performSyncTest("Get all savory categories", async () => {
        const savory_categories = await categories.getAllCategories({flavor_type: "Savory"})
        expect(
            savory_categories
        ).toMatchObject(
            [category_1, category_2]
        )
    })

    performSyncTest("Get all sweet categories", async () => {
        const sweet_categories = await categories.getAllCategories({flavor_type: "Sweet"})
        expect(
            sweet_categories
        ).toMatchObject(
            []
        )
    })

    performSyncTest("Fail delete category", async () => {
        const delete_count = await categories.deleteCategory({_id: "633b47e164a80559f146166c"})
        expect(
            delete_count
        ).toEqual(
            0
        )
    })

    performSyncTest("Delete category 1", async () => {
        const delete_count = await categories.deleteCategory({_id: id_1})
        expect(
            delete_count
        ).toEqual(
            1
        )
    })

    performSyncTest("Delete category 2", async () => {
        const delete_count = await categories.deleteCategory({_id: id_2})
        expect(
            delete_count
        ).toEqual(
            1
        )
    })

    create_failed = false
})



// Test the category controller
describe("CATEGORY CONTROLLER TESTS", () => {
    let id_1;
    let id_2;

    performSyncTest("Create category 1", async () => {
        const response = await fetch(`${proxy}/categories`, {
                            method: "POST", 
                            body: JSON.stringify(category_1),
                            headers: {"Content-type": "application/json"}
        })
        const category = await response.json()

        expect(
            category
        ).toMatchObject(
            category_1
        )
        id_1 = category._id
    })

    performSyncTest("Create category 2", async () => {
        const response = await fetch(`${proxy}/categories`, {
                            method: "POST", 
                            body: JSON.stringify(category_2),
                            headers: {"Content-type": "application/json"}
        })
        const category = await response.json()

        expect(
            category
        ).toMatchObject(
            category_2
        )
        id_2 = category._id
    })

    performSyncTest("Fail category creation", async () => {
        const new_category = {name: "Bread"}
        const response = await fetch(`${proxy}/categories`, {
                            method: "POST", 
                            body: JSON.stringify(new_category),
                            headers: {"Content-type": "application/json"}
        })
        expect(
            response.status
        ).toEqual(
            500
        )
    })

    performSyncTest("Get category", async () => {
        const response = await fetch(`${proxy}/categories/indiv/${id_1}`)
        const category = await response.json()
        expect(
            category
        ).toMatchObject(
            category_1
        )
    })

    performSyncTest("Fail get category", async () => {
        const response = await fetch(`${proxy}/categories/indiv/633b47e164a80559f146166c`)
        expect(
            response.status
        ).toEqual(
            404
        )
    })

    performSyncTest("Get all savory categories", async () => {
        const response = await fetch(`${proxy}/categories/Savory`)
        const savory_categories = await response.json()
        expect(
            savory_categories
        ).toMatchObject(
            [category_1, category_2]
        )
    })

    performSyncTest("Get all sweet categories", async () => {
        const response = await fetch(`${proxy}/categories/Sweet`)
        expect(
            response.status
        ).toEqual(
            404
        )
    })

    performSyncTest("Fail delete category", async () => {
        const response = await fetch(`${proxy}/categories/${"633b47e164a80559f146166c"}`, {method: "DELETE"})
        expect(
            response.status
        ).toEqual(
            404
        )
    })

    performSyncTest("Delete category 1", async () => {
        const response = await fetch(`${proxy}/categories/${id_1}`, {method: "DELETE"})
        expect(
            response.status
        ).toEqual(
            204
        )
    })

    performSyncTest("Delete category 2", async () => {
        const response = await fetch(`${proxy}/categories/${id_2}`, {method: "DELETE"})
        expect(
            response.status
        ).toEqual(
            204
        )
    })

    

    create_failed = false
})



