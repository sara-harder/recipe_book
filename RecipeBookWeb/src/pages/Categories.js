// react imports
import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom';

// component imports
import ListPage from '../components/ListPage';

// function imports
import { category_funcs, rec_cat_funcs } from 'recipe-book';

function Categories({setHeader}) {
    const navigate = useNavigate();
    const location = useLocation();
    const flavor_type = location.state.flavor

    useEffect(() => {
        setHeader(flavor_type + " Recipes")
    }, [])

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);



    // Get the categories to display
    useEffect(() =>{
        const getCategories = async ()=> {
            const categories = await category_funcs.getFlavorType(flavor_type)

            const cats = []
            for (const category of categories) {
                const len = await rec_cat_funcs.countRecipes(category._id)
                if (len != 0) cats.push(category)
            }
            setData(cats)

            setLoading(false)
        }
        getCategories()
    }, []);



    // Show loading screen while waiting for data
    if (loading) {
        return(
            <div className="center-content">
                <h1 className="loading"> Loading... </h1>
            </div>
        )
    }

    return(
        <ListPage data={data} navigate={(item) => navigate("/recipes", {state:{category: item}})}/>
    )
}

export default Categories;
