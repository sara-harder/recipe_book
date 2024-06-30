Process:

I started by creating empty react and react native projects in two separate folders, for web and mobile.

I decided to start working on mobile. I created empty mobile pages with basic components. They contained no data (except some placeholder text) and no style, it was just a framework of React Native (and custom) components.

I added some basic navigation functions, to allow movement between pages by pressing on the basic text components.


After creating the framework pages for mobile, I started work on the web portion. I followed the same process, starting with adding empty pages and creating the basic components. A lot of the components could be copied from mobile, then changed to follow HTML instead of React Native. I enabled navigation to each of the pages as well.


Next, I wanted to start adding some basic style. The components are there, but they're a mess on the page. Starting again with mobile, I created a style sheet and started placing the components where I wanted them. I gave them dimensions, borders, and padding. I added a basic color scheme to be updated later. I also added a basic header.


While working on the styles, I ran into an issue with sharing functions between mobile and web. I had created a function that smoothed out the layout of the categories when selecting the type of recipe you want (function: createFlexTable). I wanted to use this same function to smooth out the way that ingredients looked on mobile for the page where you view the actual recipe. However, this wasn't as simple as I thought it would be. I expected to be able to put the functions into an external folder that both web and mobile could access. Both sides refused to access it, so I realized that I needed to make it into a package instead, then import this package into the pages where I needed it. Unfortunately, this did not completely resolve the issue with mobile. React native did not like my custom-made package. I did some research which led me to a package called yalc, which would enable me to access my package easily, without having to maintain duplicate folders for web and mobile. This resolved my issue, enabling access to shared functionality for both the mobile and web versions.

Having finished with the layout, it was time to start setting up a basic database. I created a new folder where I could run the backend, which both mobile and web would be able to connect to. I set up a database with mongo-db and connected it to server.js in the backend folder. I designed a schema and created empty models and controllers for each of the tables. I added the schemas and some basic functions to each of the models. 


Stretch Goals:

Have the ingredients follow along with the directions. When the user clicks a direction, the ingredients jump next to it, and highlight the ingredients needed for the direction

Change the ingredient units from metric to imperial and back

Change the number of portions

Checkbox to filter items by seasonal vegetables only 

Add recipes into multiple categories, so you can find it anywhere you think of (including vegan, vegetarian, and gluten free)

Search for recipes

Add all ingredients for a recipe to a shopping list (Bring!)

Coordination with Alexa for adding ingredients (and reading recipes?)
