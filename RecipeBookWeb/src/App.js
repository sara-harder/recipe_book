// react imports
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// page imports
import HomePage from './pages/Home';
import Categories from './pages/Categories';
import RecipeList from './pages/RecipeList';
import ViewRecipe from './pages/ViewRecipe';

// component imports
import ScrollToTop from './components/ScrollToTop';

// function imports
import { setFavorites } from 'recipe-book/redux/userSlice';

// style imports
import './styling/App.css';
import { FaHeart as HeartFilled } from "react-icons/fa";
import { FaRegHeart as HeartOutline } from "react-icons/fa";

const Heart = ({favorite, setFavorite}) => {
  // Toggle heart icon if favorite is selected or not
  if (favorite) {
    return(
      <HeartFilled size="2.5em" className="icon" onClick={()=>setFavorite(!favorite)}/>
    )
  }
  return(
    <HeartOutline size="2.5em" className="icon" onClick={()=>setFavorite(!favorite)}/>
  )
}


function App() {
  const dispatch = useDispatch()

  const [header, setHeader] = useState("")
  
  const [favorite, setFavorite] = useState(false)
  const [recipe, setRecipe] = useState()

  // Enable selecting / deselecting favorite recipes on View Recipe page
  const favorites = useSelector(state=> state.user.value.favorites);
  const updateFavorites = () => {
      // if the recipe is already in favorites
      if (favorites.includes(recipe._id)) {
        // if favorite is deselected, remove from favorites
        if (!favorite) {
          const i = favorites.indexOf(recipe._id)
          const new_favs = favorites.slice()
          new_favs.splice(i, 1)
          dispatch(setFavorites(new_favs))
        }
      }
      // if recipe is not in favorites
      else {
        // if favorite is selected, add to favorites
        if (favorite) dispatch(setFavorites(favorites.concat(recipe._id)))
      }
  }

  // Update the favorites whenever the heart is clicked on View Recipe page
  useEffect(() => {
    if (recipe) updateFavorites()
  }, [favorite])

  return (
    <div className="App">
      <header className="App-header row">
        <h1>{header}</h1>
        {!header.includes("Recipes") ? <Heart favorite={favorite} setFavorite={setFavorite} /> : null}
      </header>
      <body className="App-body">
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
