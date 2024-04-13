// react imports
import React from 'react';

// style imports
import '../styling/Recipe.css';

const Ingredient = ({name, quantity}) => {
    return(
        <div className='ingredient row' >
            <div className='ingr_text quantity' >{quantity},</div>
            <div className='ingr_text ingr_name' >{name}</div>
        </div>
    )
}

function ViewRecipe({setHeader}) {
    setHeader("Recipe")

    const ingredients = [{
        name: "Ing 1",
        qua: "15g"
    },
    {
        name: "Ing 2",
        qua: "10g"
    },
    {
        name: "Ing 3",
        qua: "2500g"
    }]

    const directions = [{
        text: "Dir 1",
    },
    {
        text: "Dir 2",
    },
    {
        text: "Dir 3",
    }]

    return(
        <>
            <div>
                <div className='recipe_img'></div>
                <div className='row'>
                    <div className='list ingrs'>
                        <div className='bold'>Ingredients:</div>
                        {ingredients.map((item, index) => 
                            <Ingredient name={item.name} quantity={item.qua} key={index} />
                        )}
                    </div>
                    <div className='list dirs'>
                        <div className='bold'>Directions:</div>
                        {directions.map((item, index) => 
                            <div className='dir_text' key={index}>{item.text}</div>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default ViewRecipe;
