// react imports
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// page imports
import HomePage from './pages/Home';
import RecipeCategories from './pages/RecipeCategories';

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
        </Routes>
      </Router>
      </header>
    </div>
  );
}

export default App;
