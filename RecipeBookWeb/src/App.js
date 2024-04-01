// react imports
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// page imports
import HomePage from './pages/Home';
import RecipeCategories from './pages/RecipeCategories';
import RecipeList from './pages/RecipeList';

// style imports
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
      <Router>
        <Routes>
          <Route path="/" exact element={<HomePage/>} />
          <Route path="/categories" element={<RecipeCategories/>} />
          <Route path="/recipes" element={<RecipeList/>} />
        </Routes>
      </Router>
      </header>
    </div>
  );
}

export default App;
