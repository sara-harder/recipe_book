// react imports
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';

// page imports
import HomePage from './pages/Home';
import Categories from './pages/Categories';
import RecipeList from './pages/RecipeList';
import ViewRecipe from './pages/ViewRecipe';

import StartCooking from './pages/StartCooking';

import AddRecipe from './pages/AddRecipe/AddRecipe';
import MapPage from './pages/AddRecipe/RecipeMap';

// component imports
import ScrollToTop from './components/ScrollToTop';
import Header from './components/Header';

// style imports
import './styling/App.css';


function App() {
  const [header, setHeader] = useState("")
  
  const [favorite, setFavorite] = useState(false)
  const [recipe, setRecipe] = useState()

  return (
    <div className="App">
      <Router>
        <Header header={header} favorite={favorite} setFavorite={setFavorite} recipe={recipe} />

        <body className="App-body container-fluid pt-7">
          <ScrollToTop />
          <Routes>
            <Route path="/" exact element={<HomePage setHeader={setHeader}/>} />
            <Route path="/categories" element={<Categories setHeader={setHeader}/>} />
            <Route path="/recipes" element={<RecipeList setHeader={setHeader}/>} />
            <Route path="/view-recipe" element={<ViewRecipe setHeader={setHeader} setRecipe={setRecipe} setFavorite={setFavorite}/>} />

            <Route path="/cooking" element={<StartCooking setHeader={setHeader}/>} />

            <Route path="/add-recipe" element={<AddRecipe setHeader={setHeader}/>} />
            <Route path="/add-recipe/map-recipe" element={<MapPage setHeader={setHeader}/>} />
          </Routes>
        </body>
      </Router>
    </div>
  );
}

export default App;
