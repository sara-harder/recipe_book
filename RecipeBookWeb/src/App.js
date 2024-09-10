// react imports
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';

// page imports
import HomePage from './pages/Home';
import Categories from './pages/Categories';
import RecipeList from './pages/RecipeList';
import ViewRecipe from './pages/ViewRecipe';

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
      <Header header={header} favorite={favorite} setFavorite={setFavorite} recipe={recipe} />

      <body className="App-body container-fluid pt-7">
        <Router>
          <ScrollToTop />
          <Routes>
            <Route path="/" exact element={<HomePage setHeader={setHeader}/>} />
            <Route path="/categories" element={<Categories setHeader={setHeader}/>} />
            <Route path="/recipes" element={<RecipeList setHeader={setHeader}/>} />
            <Route path="/view-recipe" element={<ViewRecipe setHeader={setHeader} setRecipe={setRecipe} setFavorite={setFavorite}/>} />
          </Routes>
        </Router>
      </body>
    </div>
  );
}

export default App;
