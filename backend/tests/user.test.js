// retrieve the user's model for testing
const users = require('../users/users_model');

// set up the servers
const { openServer } = require('./server');   

let PORT = 5002;
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


const username2 = "goirl"
const favorites = ["id_1"]
const favorites2 = ["id_2"]

// Test the user model
describe("USER MODEL TESTS", () => {
    let user_id;
    const user_1 = {
        username: "gamer",
        fullname: "Sara H",
    }

    performSyncTest("Create user", async () => {
        const user = await users.createUser(user_1.username, user_1.fullname)
        expect(
            user
        ).toMatchObject(
            user_1
        )
        user_id = user._id
    })

    performSyncTest("Fail user creation", async () => {
        await expect(
            users.createUser(user_1.username)
        ).rejects.toThrow('User validation failed')
    })

    performSyncTest("Get user", async () => {
        const user = await users.getUser({_id: user_id})
        expect(
            user
        ).toMatchObject(
            user_1
        )
    })

    performSyncTest("Fail get user", async () => {
        const user = await users.getUser({_id: "633b47e164a80559f146166c"})
        expect(
            user
        ).toBeNull()
    })

    performSyncTest("Update username", async () => {
        user_1.username = username2
        const user = await users.updateUser({_id: user_id}, {username: user_1.username})
        expect(
            user
        ).toMatchObject(
            user_1
        )
    })

    performSyncTest("Fail get user for update", async () => {
        const user = await users.updateUser({_id: "633b47e164a80559f146166c"}, {favorites: favorites})
        expect(
            user
        ).toBeNull()
    })

    performSyncTest("Update user favorites", async () => {
        user_1.favorites = favorites
        const user = await users.updateUser({_id: user_id}, {favorites: user_1.favorites})
        expect(
            user
        ).toMatchObject(
            user_1
        )
    })

    performSyncTest("Update user favorites again", async () => {
        const user = await users.updateUser({_id: user_id}, {favorites: favorites2})
        expect(
            user
        ).not.toMatchObject(
            user_1
        )
    })

    performSyncTest("Fail delete user", async () => {
        const delete_count = await users.deleteUser({_id: "633b47e164a80559f146166c"})
        expect(
            delete_count
        ).toEqual(
            0
        )
    })


    performSyncTest("Delete user", async () => {
        const delete_count = await users.deleteUser({_id: user_id})
        expect(
            delete_count
        ).toEqual(
            1
        )
    })

    create_failed = false
})



// Test the user controller
describe("USER CONTROLLER TESTS", () => {
    let user_id;
    const user_1 = {
        username: "gamer",
        fullname: "Sara H",
    }

    performSyncTest("Create user", async () => {
        const response = await fetch(`${proxy}/users`, {
                            method: "POST", 
                            body: JSON.stringify(user_1),
                            headers: {"Content-type": "application/json"}
        })
        const user = await response.json()

        user_id = user._id
        expect(
            user
        ).toMatchObject(
            user_1
        )
    })

    performSyncTest("Fail user creation", async () => {
        const new_user = {username: user_1.username}
        const response = await fetch(`${proxy}/users`, {
                            method: "POST", 
                            body: JSON.stringify(new_user),
                            headers: {"Content-type": "application/json"}
        })
        expect(
            response.status
        ).toEqual(
            400
        )
    })

    performSyncTest("Get user", async () => {
        const response = await fetch(`${proxy}/users/${user_id}`)
        const user = await response.json()
        expect(
            user
        ).toMatchObject(
            user_1
        )
    })

    performSyncTest("Fail get user", async () => {
        const response = await fetch(`${proxy}/users/${"633b47e164a80559f146166c"}`)
        expect(
            response.status
        ).toEqual(
            404
        )
    })

    performSyncTest("Update username", async () => {
        user_1.username = username2
        const response = await fetch(`${proxy}/users/${user_id}`, {
                            method: "PUT", 
                            body: JSON.stringify({username: user_1.username}),
                            headers: {"Content-type": "application/json"}
        })
        const user = await response.json()
        expect(
            user
        ).toMatchObject(
            user_1
        )
    })

    performSyncTest("Fail get user for update", async () => {
        const response = await fetch(`${proxy}/users/${"633b47e164a80559f146166c"}`, {
                            method: "PUT", 
                            body: JSON.stringify({favorites: favorites}),
                            headers: {"Content-type": "application/json"}
        })
        expect(
            response.status
        ).toEqual(
            404
        )
    })

    performSyncTest("Update user favorites", async () => {
        user_1.favorites = favorites
        const response = await fetch(`${proxy}/users/${user_id}`, {
                            method: "PUT", 
                            body: JSON.stringify({favorites: user_1.favorites}),
                            headers: {"Content-type": "application/json"}
        })
        const user = await response.json()
        expect(
            user
        ).toMatchObject(
            user_1
        )
    })

    performSyncTest("Update user favorites again", async () => {
        const response = await fetch(`${proxy}/users/${user_id}`, {
                            method: "PUT", 
                            body: JSON.stringify({favorites: favorites2}),
                            headers: {"Content-type": "application/json"}
        })
        const user = await response.json()
        expect(
            user
        ).not.toMatchObject(
            user_1
        )
    })

    performSyncTest("Fail delete user", async () => {
        const response = await fetch(`${proxy}/users/${"633b47e164a80559f146166c"}`, {method: "DELETE"})
        expect(
            response.status
        ).toEqual(
            404
        )
    })

    performSyncTest("Delete user", async () => {
        const response = await fetch(`${proxy}/users/${user_id}`, {method: "DELETE"})
        expect(
            response.status
        ).toEqual(
            204
        )
    })

    

    create_failed = false
})



