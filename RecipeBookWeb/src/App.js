// react imports
import React from 'react';
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// page imports
import HomePage from './pages/Home';
import Categories from './pages/Categories';
import RecipeList from './pages/RecipeList';
import ViewRecipe from './pages/ViewRecipe';

// component imports
import ScrollToTop from './components/ScrollToTop';

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
          <ScrollToTop />
          <Routes>
            <Route path="/" exact element={<HomePage setHeader={setHeader}/>} />
            <Route path="/categories" element={<Categories setHeader={setHeader}/>} />
            <Route path="/recipes" element={<RecipeList setHeader={setHeader}/>} />
            <Route path="/view-recipe" element={<ViewRecipe setHeader={setHeader}/>} />
          </Routes>
        </Router>
      </body>
    </div>
  );
}

export default App;
