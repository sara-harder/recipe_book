# Running the program

To run the web version of the program as it stands now:

Start by installing the packages. From the root folder, run `npm install`.

Once the packages have finished installing, run the program using `npm start`.
Running `npm start`from the root directory will initiate a connection to MongoDB, launch the web page, and start the flask connection that waits for users to upload pdfs (to add recipes).
In order for the MongoDB connection to work, it is necessary to have the `MONGODB_CONNECT_STRING` env var in a `.env` file, in the `backend` directory. It is recommended to also have a `PORT` var defined.


# TODO

### Important Features:

User log in

Editing recipes



### Bug Fixes:

Start cooking page sous chef mode: ensure the ingredient quantities and names don't overlap



### Visual Improvements:

Add a home button

Add a recipe to recent recipes after it has been created

Change the mouse symbols when hovering

Highlight the option currently being hovered over, in the search bar options and hamburger menu options

Add more emphasis to the `See All` buttons on the main page

Show a bar indicating how many steps have been completed (out of how many) on the start cooking page

Display the source and estimated time for each recipe (base the time on the portions?)



### Code Improvements:

Improve variable and function names by using larger names rather than vague ones (ex. individual instead of indiv, recipes_in_category_funcs instead of rec_cat_funcs)

Ensure that database tests are completely independent (note: need to investigate exactly what this was referencing)

Instead of using separate model files (for categories, recipes, etc. in backend), have one model file with the basic create, update, etc. functions. Pass the appropriate object and schema as needed. 
Ex: createObject = async(object, Schema) => {
  const res = new Schema(object) 
  return res.save()
}



### Stretch Goals:

Change the ingredient units from metric to imperial and back

~Change the number of portions~

Checkbox to filter items by seasonal vegetables only 

Add recipes into multiple categories, so you can find it anywhere you think of (including vegan, vegetarian, and gluten free)

Add all ingredients for a recipe to a shopping list (Bring!)

Coordination with Alexa for adding ingredients (and reading recipes?)

Use AI tool to auto-add recipes based on picture input

Create a public section of the app where users can download other users' recipes

Allow users to add notes to their own personal recipes (toggle on or off to show original vs. updated). Allows the user to say "Set oven to 180°" instead of "175°" becasue their oven runs low, for example
