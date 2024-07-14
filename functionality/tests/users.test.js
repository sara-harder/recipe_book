// import the user functions to be tested
const user_funcs = require("../backend_connection/users")

// set up the servers
const { openServer } = require('../../backend/tests/server'); 

let PORT = 5002

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
const user_1 = {
    username: "gamer",
    fullname: "Sara H",
}
const username2 = "goirl"
const favorites = ["user_id"]
const favorites2 = ["id_2"]


describe("RECIPES FUNCTIONALITY TESTS", () => {
    let user_id;

    performSyncTest("Create user", async () => {
        const user = await user_funcs.addUser(user_1)
        expect(
            user
        ).toMatchObject(
            user_1
        )
        user_id = user._id
    })

    performSyncTest("Fail user creation", async () => {
        const new_user = {username: user_1.username}
        const response = await user_funcs.addUser(new_user)
        expect(response).toBeUndefined()
    })

    performSyncTest("Get user", async () => {
        const user = await user_funcs.getUser(user_id)
        expect(
            user
        ).toMatchObject(
            user_1
        )
    })

    performSyncTest("Fail get user", async () => {
        const response = await user_funcs.getUser('633b47e164a80559f146166c')
        expect(response).toBeUndefined()
    })

    performSyncTest("Update username", async () => {
        user_1.username = username2
        const user = await user_funcs.updateUser(user_id, {username: user_1.username})
        expect(
            user
        ).toMatchObject(
            user_1
        )
    })

    performSyncTest("Fail get user for update", async () => {
        const response = await user_funcs.updateUser("633b47e164a80559f146166c", {favorites: favorites})
        expect(response).toBeUndefined()
    })

    performSyncTest("Update user favorites", async () => {
        user_1.favorites = favorites
        const user = await user_funcs.updateUser(user_id, {favorites: user_1.favorites})
        expect(
            user
        ).toMatchObject(
            user_1
        )
    })

    performSyncTest("Update user favorites again", async () => {
        const user = await user_funcs.updateUser(user_id, {favorites: favorites2})
        expect(
            user
        ).not.toMatchObject(
            user_1
        )
    })

    performSyncTest("Fail delete user", async () => {
        const response = await user_funcs.deleteUser("633b47e164a80559f146166c")
        expect(
            response
        ).toBe(false)
    })

    performSyncTest("Delete user", async () => {
        const response = await user_funcs.deleteUser(user_id)
        expect(
            response
        ).toBe(true)
    })

    

    create_failed = false
})
