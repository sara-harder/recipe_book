// react imports
import React from 'react';
import { useLocation } from 'react-router-dom';

// style imports
import '../styling/Recipe.css';

const Ingredient = ({name, quantity, unit}) => {
    return(
        <div className='ingredient row' >
            <div className='ingr_text quantity' >{quantity}{unit}  </div>
            <div className='ingr_text ingr_name' >{name}</div>
        </div>
    )
}

function ViewRecipe({setHeader, setRecipe}) {
    const location = useLocation();
    const recipe = location.state.recipe

    setHeader(recipe.name)
    setRecipe(recipe)

    const ingredients = recipe.ingredients

    return(
        <>
            <div>
                <div className='recipe_img'></div>
                <div className='row'>
                    <div className='list ingrs'>
                        <div className='bold'>Ingredients:</div>
                        {ingredients.map((item, index) => 
                            <Ingredient name={item.name} quantity={item.quantity} unit={item.unit} key={index} />
                        )}
                    </div>
                    <div className='list dirs'>
                        <div className='bold'>Directions:</div>
                        {recipe.directions.map((item, index) => 
                            <div className='dir_text' key={index}>{item}</div>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default ViewRecipe;
