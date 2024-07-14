require('dotenv').config();

let PORT = process.env.PORT || 5002;
let url = "http://localhost:" + PORT

async function addUser (new_user) {
// creates a user in the database from the provided object. returns user if successful, undef if not
    let user;
    try {
        const response = await fetch(url + "/users", {
            method: "POST", 
            body: JSON.stringify(new_user),
            headers: {"Content-type": "application/json"}
        })
        user = await response.json()

        if (user.Error) {throw (user.Error)}
    } catch (error) { 
        console.error(error)
        user = undefined
    }

    return user
}


async function getUser (user_id) {
// returns the user based on the provided id
    let user;
    try {
        const response = await fetch(url + `/users/${user_id}`)
        user = await response.json()

        if (user.Error) {throw (user.Error)}
    } catch (error) { 
        console.error(error)
        user = undefined
    }

    return user
}


async function updateUser (user_id, updates) {
// updates a user based on the provided id using the provided updates. returns user if successful, undef if not
    let user;
    try {
        const response = await fetch(url + `/users/${user_id}`, {
            method: "PUT", 
            body: JSON.stringify(updates),
            headers: {"Content-type": "application/json"}
        })
        user = await response.json()

        if (user.Error) {throw (user.Error)}
    } catch (error) { 
        console.error(error)
        user = undefined
    }

    return user
}

async function deleteUser (user_id) {
// deletes a user based on the provided id. returns true if successful, false if not
    try {
        const res = await fetch(url + `/users/${user_id}`, {method: "DELETE"})
        
        if (res.status == 204) return true
        else {
            const response = await res.json()
            throw (response.Error)
        }
    } catch (error) { 
        return false
    }
}

module.exports = {addUser, getUser, updateUser, deleteUser}