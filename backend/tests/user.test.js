require('dotenv').config();
const mongoose = require('mongoose');

const users = require('../users/users_model');
const recipes = require('../recipes/recipes_model');
const categories = require('../categories/categories_model');
const recipe_category = require('../recipe_in_category/recipe_cat_model');

jest.setTimeout(10000);

beforeAll(() => {
    // connect to MongoDB
    mongoose.connect(
        process.env.MONGODB_CONNECT_STRING
    );

    const db = mongoose.connection;

    db.once("open", () => {
        console.log("Successfully connected to MongoDB using Mongoose!");
    });
})

afterAll(() => {
    // close connection to MongoDB
    mongoose.connection.close()
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


describe("USER MODEL TESTS", () => {
    let user_id;
    const username = "gamer"
    const username2 = "goirl"
    const fullname = "Sara H"
    const favorites = ["id_1"]
    const favorites2 = ["id_2"]

    performSyncTest("Create user", async () => {
        const user = await users.createUser(username, fullname)
        user_id = user._id
        expect(
            {username: user.username, fullname: user.fullname}
        ).toEqual(
            {username: username, fullname: fullname}
        )
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
