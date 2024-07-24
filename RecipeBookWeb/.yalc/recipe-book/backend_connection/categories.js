let PORT = 5001;
let url = "http://localhost:" + PORT

function resetPort (port) {
// used to set the correct port during testing
    url = "http://localhost:" + port
}

async function addCategory (name, flavor_type) {
// creates a category in the database from the provided params. returns category if successful, undef if not
    const new_category = {
        name: name,
        flavor_type: flavor_type
    }

    let category;
    try {
        const response = await fetch(url + "/categories", {
            method: "POST", 
            body: JSON.stringify(new_category),
            headers: {"Content-type": "application/json"}
        })
        category = await response.json()

        if (category.Error) {throw (category.Error)}
    } catch (error) { 
        console.error(error)
        category = undefined
    }

    return category
}


async function getCategory (category_id) {
// returns the category based on the provided id
    let category;
    try {
        const response = await fetch(url + `/categories/indiv/${category_id}`)
        category = await response.json()

        if (category.Error) {throw (category.Error)}
    } catch (error) { 
        console.error(error)
        category = undefined
    }

    return category
}

async function getFlavorType (flavor_type) {
// returns a list of categories in the specified flavor type (sweet or savory)
    let categories;
    try {
        const response = await fetch(url + `/categories/${flavor_type}`)
        categories = await response.json()

        if (categories.Error) {throw (categories.Error)}
    } catch (error) { 
        console.error(error)
        categories = undefined
    }

    return categories
}

async function deleteCategory (category_id) {
// deletes a category based on the provided id. returns true if successful, false if not
    try {
        const res = await fetch(url + `/categories/${category_id}`, {method: "DELETE"})
        
        if (res.status == 204) return true
        else {
            const response = await res.json()
            throw (response.Error)
        }
    } catch (error) { 
        return false
    }
}

module.exports = {addCategory, getCategory, getFlavorType, deleteCategory, resetPort}