require('dotenv').config();    

// connect to the server
server = require('../server')
const mongoose = require('mongoose');

// retrieve the user's model for testing
const users = require('../users/users_model');
const proxy = `http://localhost:${process.env.PORT}`

jest.setTimeout(60000);

beforeAll(async () => {
    // create the connection to mongodb
    await mongoose.connect(
        "mongodb+srv://harders:admin@recipes.fvmleot.mongodb.net/"
    );

    const db = mongoose.connection;

    db.once("open", () => {
        console.log("Successfully connected to MongoDB using Mongoose!");
    });
})


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

const username = "gamer"
const username2 = "goirl"
const fullname = "Sara H"
const favorites = ["id_1"]
const favorites2 = ["id_2"]

// Test the user model
describe("USER MODEL TESTS", () => {
    let user_id;

    performSyncTest("Create user", async () => {
        const user = await users.createUser(username, fullname)
        user_id = user._id
        expect(
            {username: user.username, fullname: user.fullname}
        ).toEqual(
            {username: username, fullname: fullname}
        )
    })

    performSyncTest("Fail user creation", async () => {
        await expect(
            users.createUser(username)
        ).rejects.toThrow('User validation failed')
    })

    performSyncTest("Get user", async () => {
        const user = await users.getUser({_id: user_id})
        expect(
            {username: user.username, fullname: user.fullname}
        ).toEqual(
            {username: username, fullname: fullname}
        )
    })

    performSyncTest("Fail get user", async () => {
        const user = await users.getUser({_id: "633b47e164a80559f146166c"})
        expect(
            user
        ).toBeNull()
    })

    performSyncTest("Update username", async () => {
        const user = await users.updateUser({_id: user_id}, {username: username2})
        expect(
            {username: user.username, fullname: user.fullname}
        ).toEqual(
            {username: username2, fullname: fullname}
        )
    })

    performSyncTest("Fail get user for update", async () => {
        const user = await users.updateUser({_id: "633b47e164a80559f146166c"}, {favorites: favorites})
        expect(
            user
        ).toBeNull()
    })

    performSyncTest("Update user favorites", async () => {
        const user = await users.updateUser({_id: user_id}, {favorites: favorites})
        expect(
            {username: user.username, fullname: user.fullname, favorites: user.favorites}
        ).toEqual(
            {username: username2, fullname: fullname, favorites: favorites}
        )
    })

    performSyncTest("Update user favorites again", async () => {
        const user = await users.updateUser({_id: user_id}, {favorites: favorites2})
        expect(
            {username: user.username, fullname: user.fullname, favorites: user.favorites}
        ).not.toEqual(
            {username: username2, fullname: fullname, favorites: favorites}
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

    performSyncTest("Create user", async () => {
        const new_user = {username: username, fullname: fullname}
        const response = await fetch(`${proxy}/users`, {
                            method: "POST", 
                            body: JSON.stringify(new_user),
                            headers: {"Content-type": "application/json"}
        })
        const user = await response.json()

        user_id = user._id
        expect(
            {username: user.username, fullname: user.fullname}
        ).toEqual(
            {username: username, fullname: fullname}
        )
    })

    performSyncTest("Fail user creation", async () => {
        const new_user = {username: username}
        const response = await fetch(`${proxy}/users`, {
                            method: "POST", 
                            body: JSON.stringify(new_user),
                            headers: {"Content-type": "application/json"}
        })
        expect(
            response.status
        ).toEqual(
            500
        )
    })

    performSyncTest("Get user", async () => {
        const response = await fetch(`${proxy}/users/${user_id}`)
        const user = await response.json()
        expect(
            {username: user.username, fullname: user.fullname}
        ).toEqual(
            {username: username, fullname: fullname}
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
        const response = await fetch(`${proxy}/users/${user_id}`, {
                            method: "PUT", 
                            body: JSON.stringify({username: username2}),
                            headers: {"Content-type": "application/json"}
        })
        const user = await response.json()
        expect(
            {username: user.username, fullname: user.fullname}
        ).toEqual(
            {username: username2, fullname: fullname}
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
        const response = await fetch(`${proxy}/users/${user_id}`, {
                            method: "PUT", 
                            body: JSON.stringify({favorites: favorites}),
                            headers: {"Content-type": "application/json"}
        })
        const user = await response.json()
        expect(
            {username: user.username, fullname: user.fullname, favorites: user.favorites}
        ).toEqual(
            {username: username2, fullname: fullname, favorites: favorites}
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
            {username: user.username, fullname: user.fullname, favorites: user.favorites}
        ).not.toEqual(
            {username: username2, fullname: fullname, favorites: favorites}
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



