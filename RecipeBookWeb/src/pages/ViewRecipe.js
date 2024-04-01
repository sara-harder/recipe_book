// react imports
import React from 'react';

const Ingredient = ({name, quantity}) => {
    return(
        <div>
            <div>{quantity}, </div>
            <div>{name}</div>
        </div>
    )
}

function ViewRecipe() {
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
        qua: "25g"
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
                <h2>Title</h2>
                <div>Image</div>
                {ingredients.map((item, index) => 
                    <Ingredient name={item.name} quantity={item.qua} key={index} />
                )}
                {directions.map((item, index) => 
                    <div>{item.text}</div>
                )}
            </div>
        </>
    )
}

export default ViewRecipe;
