// import the category functions to be tested
const category_funcs = require("../backend_connection/categories")

// set up the servers
const { openServer } = require('../../backend/tests/server'); 

let PORT = 5003
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

// create the data to be tested
const category_1 = {
    name: "Pasta",
    flavor_type: "Savory"
}

const category_2 = {
    name: "Rice",
    flavor_type: "Savory"
}


describe("CATEGORIES FUNCTIONALITY TESTS", () => {
    let id_1;
    let id_2;

    performSyncTest("Create category 1", async () => {
        const category = await category_funcs.addCategory(category_1.name, category_1.flavor_type)
        expect(
            category
        ).toMatchObject(
            category_1
        )
        id_1 = category._id
    })

    performSyncTest("Create category 2", async () => {
        const category = await category_funcs.addCategory(category_2.name, category_2.flavor_type)
        expect(
            category
        ).toMatchObject(
            category_2
        )
        id_2 = category._id
    })

    performSyncTest("Fail category creation", async () => {
        const response = await category_funcs.addCategory(category_1.name)
        expect(response).toBeUndefined()
    })

    performSyncTest("Get category", async () => {
        const category = await category_funcs.getCategory(id_1)
        expect(
            category
        ).toMatchObject(
            category_1
        )
    })

    performSyncTest("Fail get category", async () => {
        const response = await category_funcs.getCategory('633b47e164a80559f146166c')
        expect(response).toBeUndefined()
    })

    performSyncTest("Get all savory categories", async () => {
        const savory_categories = await category_funcs.getFlavorType("Savory")
        expect(
            savory_categories
        ).toMatchObject(
            [category_1, category_2]
        )
    })

    performSyncTest("Get all sweet categories", async () => {
        const sweet_categories = await category_funcs.getFlavorType("Sweet")
        expect(sweet_categories).toBeUndefined()
    })

    performSyncTest("Fail delete category", async () => {
        const response = await category_funcs.deleteCategory("633b47e164a80559f146166c")
        expect(
            response
        ).toBe(false)
    })

    performSyncTest("Delete category 1", async () => {
        const response = await category_funcs.deleteCategory(id_1)
        expect(
            response
        ).toBe(true)
    })

    performSyncTest("Delete category 2", async () => {
        const response = await category_funcs.deleteCategory(id_2)
        expect(
            response
        ).toBe(true)
    })

    

    create_failed = false
})
