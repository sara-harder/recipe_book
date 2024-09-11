// react imports
import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from 'react-redux';

// bootstrap imports
import Col from 'react-bootstrap/esm/Col';
import Form from 'react-bootstrap/Form';

// function imports
import { recipe_funcs } from 'recipe-book';
import { setRecents } from 'recipe-book/redux/userSlice';


const SearchResults = ({recipes, search}) => {
// list component for recipe search results
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const user = useSelector(state=> state.user.value);

    // Navigate to the view recipe page when a recipe is selected
    const selectRecipe = (recipe) => {
        let recents = [recipe._id].concat(user.recents)
        if (user.recents.includes(recipe._id)) {
            const set_recents = new Set(recents)
            recents = Array.from(set_recents)
        }
        dispatch(setRecents(recents))

        navigate("view-recipe", {state:{recipe: recipe}})
    }

    // leave a message for user when recipe list is empty
    if (recipes.length == 0 && search != '')  {
        return (
            <div className='left'>No recipes found</div>
        )
    }

    // list of found recipes
    return(
        <ul className="list-unstyled left">
            {recipes.map((item, index) => 
                <li key={index} onClick={() => selectRecipe(item)}>{item.name}</li>
            )}
        </ul>
    )
}


const SearchBar = () => {
    const [results, setResults] = useState([]);
    const [search, setSearch] = useState('');

    // retrieve the recipes based on the search
    useEffect(() =>{
        const getRecipes = async ()=> {
            let recipes = await recipe_funcs.searchForRecipe(search)
            if (recipes == undefined) recipes = []
            setResults(recipes)
        }
        getRecipes();
    }, [search]);

    return (
        <Col>
            <Form.Control
                type="search"
                placeholder="Search Recipes"
                className="me-2 search-bar"
                aria-label="Search"
                onChange={(e) => setSearch(e.target.value)}
            />
            <SearchResults recipes={results} search={search}/>
        </Col>
    )
}


export default SearchBar
