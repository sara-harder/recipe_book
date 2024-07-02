require('dotenv').config();
const mongoose = require('mongoose');

const users = require('../users/users_model');
const recipes = require('../recipes/recipes_model');
const categories = require('../categories/categories_model');
const recipe_category = require('../recipe_in_category/recipe_cat_model');


beforeAll(() => {
    // connect to MongoDB
    mongoose.connect(
        process.env.MONGODB_CONNECT_STRING,
        { useNewUrlParser: true }
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


describe("USER TESTS", () => {

    let user_id;
    performSyncTest("Create user", async () => {
        const user = await users.createUser("gamer", "Sara H")
        user_id = user._id
        expect(
            {username: user.username, fullname: user.fullname}
        ).toEqual(
            {username: "gamer", fullname: "Sara H"}
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
})
