Process:

I started by creating empty react and react native projects in two separate folders, for web and mobile.

I decided to start working on mobile. I created empty mobile pages with basic components. They contained no data (except some placeholder text) and no style, it was just a framework of React Native (and custom) components.

I added some basic navigation functions, to allow movement between pages by pressing on the basic text components.


After creating the framework pages for mobile, I started work on the web portion. I followed the same process, starting with adding empty pages and creating the basic components. A lot of the components could be copied from mobile, then changed to follow HTML instead of React Native. I enabled navigation to each of the pages as well.


Next, I wanted to start adding some basic style. The components are there, but they're a mess on the page. Starting again with mobile, I created a style sheet and started placing the components where I wanted them. I gave them dimensions, borders, and padding. I added a basic color scheme to be updated later. I also added a basic header.


While working on the styles, I ran into an issue with sharing functions between mobile and web. I had created a function that smoothed out the layout of the categories when selecting the type of recipe you want (function: createFlexTable). I wanted to use this same function to smooth out the way that ingredients looked on mobile for the page where you view the actual recipe. However, this wasn't as simple as I thought it would be. I expected to be able to put the functions into an external folder that both web and mobile could access. Both sides refused to access it, so I realized that I needed to make it into a package instead, then import this package into the pages where I needed it. Unfortunately, this did not completely resolve the issue with mobile. React native did not like my custom-made package. I did some research which led me to a package called yalc, which would enable me to access my package easily, without having to maintain duplicate folders for web and mobile. This resolved my issue, enabling access to shared functionality for both the mobile and web versions.


Having finished with the layout, it was time to start setting up a basic database. I created a new folder where I could run the backend, which both mobile and web would be able to connect to. I set up a database with mongo-db and connected it to server.js in the backend folder. I designed a schema that includes tables for Users, Recipes, Categories, and an intersection table between Recipes and Categories. For each of these tables, I created empty model and controller files. I added the schemas and some basic functions to each of the models. In each of the controllers, I added HTTP functions to correspond with the model functions. 


Naturally, all of these functions needed to be tested. Unit Testing is useful for making sure that all of these functions are producing the desired results. It is also useful for ensuring that nothing breaks further down the line when performing integration between front and back end. Using jest, I set up 4 different unit test files, for each of the 4 tables. Each file is divided into two test suites, one for the model and one for the controller. The model tests call the model file functions directly, whereas the controller tests use REST API to access the data.


I believe that continuous integration is important, especially for ensuring that nothing breaks in later stages. As such, I decided to incorporate my tests into GitHub actions, so that the tests would always run before I push any code to the main branch. This helps me identify any issues right when they arise, instead of discovering them later and having to dig for the code that caused the issue. It was challenging to create the GitHub actions yml file correctly. While I had previously used GitHub actions for some python tests, these tests are more complex becauses they involve server connections, to MongoDB and to the backend server when calling through REST API. Although it was complex to set up these servers, I was able to get them both running in the end. 


With the back end all set up, I started working on integrating it with the front end. I set up a folder within the functionality folder to use for backend connection files. These functions in these files use REST API to connect to the backend, thus enabling the frontend to access the basic database functions. While working on these functions, I also set up tests to ensure the functions were running correctly. The tests are set up to automatically start the backend server, so that they could be incorporated into GitHub Actions as well.


After adding some real data into MongoDB, the integration between back and front end was the next step. I had some small difficulties connecting to the backend server from the mobile app. First, the use of the dotenv file wasn't working, so the port had to be hard coded into the functionality folder. Then, I had to make sure I was using http://10.0.2.2: instead of http://localhost: for my connection URL, since that's the computer's local server when connecting from mobile.


Once the connection was running properly, I started adding some random savory and sweet recipes to the mobile home page. I created a function to pick random recipes, then I use the function to display the recipes on the home page. I updated the navigation to the view recipe page from the home page and ensured it was showing real data. I updated the Categories and the Recipe List pages as well, so that they used real data and the navigation between all pages functioned smoothly. 


Half of the home page was set up, but I still needed to add the Favorites and the Recents. I wasn't ready to incorportate the user database data yet, so I started with a mock object instead. I added a user state into redux, so that the user's attributes can be accessed at any time. From there, I added functionality so that when a user opens a recipe, it adds it to their recents, and when they click on the heart in the corner, it adds it to their favorites. 


I repeated the same steps with the web version. Then, I updated the style to make both versions of the app more visually appealing. At this point, the app has some basic functionality, so I made the GitHub repository officially public.


The web version was still having some style issues, and a friend had previously recommended to me that I try using the Bootstrap framework. I decided to test it out, and instantly noticed some improvements. With the proper setup, I could now scroll on the Home page when the browser was smaller. Shrinking the browser shrank the elements on the web page as well, allowing for much better readability. On the pages where you select categories or recipes, I could easily create a grid that adjusted with the browser as well. Instead of 5 columns, shrinking the browser would adapt the page to use 4, 3, etc. columns. I no longer needed the clunky algorithm that I had created for this. Overall, everything was an improvement, and the style is much nicer and more readable thanks to bootstrap. 


I decided to work on a navbar next. Instead of just displaying the title, I wanted the header to also have a search function and a popup menu. Adding these on web was simple enough thanks to bootstrap. On mobile, I had to do a bit more work to get the styles that I wanted:

I decided to separate the header into two components, one with the title and one with the icons for the hamburger menu and magnifying glass, and with the back button. The title I wanted to move together with the page animation, but it was disorienting to see the icons move with it as well. By separating the header, I could keep the icons in the same place, even when switching pages. I also learned some useful things about React Native nested Stack Navigators along the way.

Another difficulty was getting the popup to function. On web, it was easy to use the OffCanvas component (part of the NavBar component). I could base my code on the bootstrap documentation: https://react-bootstrap.netlify.app/docs/components/navbar/#offcanvas. On mobile, I had to install the react-native-modal, and figure out what settings to use to get it to appear correctly. All the extra effort was worth it though, because both the mobile and web styles and navigation look very smooth.


Once the style for the new navbar components was set up, I just had to add the functionality. The navigation was simple to add on the hamburger menu, since (for now) I was only navigating to the home page. I also already had a function that searched through the recipes, so adding that functionality onto the search bar was relatively simple as well. I did come across an issue with empty strings, because the request to the backend registered as a 'get("/:id")' request (with "search" as the id) instead of a 'get("/search/:search")' request. This emphasizes the importance of using thorough test cases. I added a new test case in the functionality tests to verify that sending an empty string functioned correctly. 



Stretch Goals:

Have the ingredients follow along with the directions. When the user clicks a direction, the ingredients jump next to it, and highlight the ingredients needed for the direction

Change the ingredient units from metric to imperial and back

Change the number of portions

Checkbox to filter items by seasonal vegetables only 

Add recipes into multiple categories, so you can find it anywhere you think of (including vegan, vegetarian, and gluten free)

Search for recipes

Add all ingredients for a recipe to a shopping list (Bring!)

Coordination with Alexa for adding ingredients (and reading recipes?)

Use AI tool to auto-add recipes based on picture or website input
