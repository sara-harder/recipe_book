// react imports
import React from 'react';
import {useState} from "react"
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// page imports
import HomePage from './pages/Home';
import RecipeCategories from './pages/RecipeCategories';
import RecipeList from './pages/RecipeList';
import ViewRecipe from './pages/ViewRecipe';

// style imports
import './styling/App.css';

function App() {
  const [header, setHeader] = useState("")

  return (
    <div className="App">
      <header className="App-header">
        <h1>{header}</h1>
      </header>
      <body className="App-body">
        <Router>
          <Routes>
            <Route path="/" exact element={<HomePage setHeader={setHeader}/>} />
            <Route path="/categories" element={<RecipeCategories/>} />
            <Route path="/recipes" element={<RecipeList/>} />
            <Route path="/view-recipe" element={<ViewRecipe/>} />
          </Routes>
        </Router>
      </body>
    </div>
  );
}

export default App;
