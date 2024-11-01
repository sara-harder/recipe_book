const url = require("./flask_connection")

async function uploadPDF (file) {
// takes a pdf file and sends it to the backend python script. script reads the recipe and sends back recipe object. 
// returns recipe object
    let recipe;

    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch(url + "/upload", {
            method: 'POST',
            body: formData,
        });

        recipe = await response.json();
        if (recipe.Error) {throw (recipe.Error)};
    } catch (error) {
        console.error('Error uploading the file:', error);
    }

    return recipe
}


module.exports = {uploadPDF}
