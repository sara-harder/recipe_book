// react imports
import React from 'react';

// bootstrap imports
import Col from 'react-bootstrap/esm/Col';
import Form from 'react-bootstrap/Form';


const IngredientsList = ({Ingredient, ingredients, setIngredients}) => {
    // when user starts typing, add a new empty input line
    if (ingredients[ingredients.length-1].name != "") {
        const copy = ingredients.slice()
        copy.push(new Ingredient(""))
        setIngredients(copy)
    }

    // update the ingredient name while user is typing. find ingredient to update using index
    const setName = (value, index) => {
        const copy = ingredients.slice()
        copy[index].name = value
        setIngredients(copy)
    }

    // update the ingredient quantity while user is typing. find ingredient to update using index
    const setQuantity = (value, index) => {
        const copy = ingredients.slice()
        copy[index].quantity = value
        setIngredients(copy)
    }

    // update the ingredient unit when user selects. find ingredient to update using index
    const setUnit = (value, index) => {
        const copy = ingredients.slice()
        copy[index].unit = value
        setIngredients(copy)
    }

    // possible units
    const units = ['mg', 'g', 'kg', 'lb (pounds)', 'oz', 'ml', 'cl', 'dl', 'l', 'tsp', 'tbsp', 'fl oz', 'cup(s)', 'pint', 'quart', 'gallon', 'sm (small)', 'md (medium)', 'lg (large)']
    
    return(
        <Form.Group className="mb-4" controlId="recipeIngredients">
            <Form.Label className='mb-1'>Ingredients</Form.Label>
            <ol className='list-unstyled'>
                {ingredients.map((item, index) => 
                    <li className='row py-1' key={index}>
                        <Col className='col-1 w-auto center-vertical pe-1'>
                            {index + 1}.
                        </Col>
                        <Col className='px-1' >
                            <Form.Control 
                                type="name" 
                                placeholder="Add ingredient (Name)"
                                value={item.name}
                                onChange={(e) => setName(e.target.value, index)}
                            />
                        </Col>
                        <Col className='col-3 px-1' >
                            <Form.Control 
                                type="number" 
                                className='number-input'
                                placeholder="Quantity" 
                                value={item.quantity}
                                onChange={(e) => setQuantity(e.target.value, index)}
                            />
                        </Col>
                        <Col className='col-3 ps-1 pe-2 me-1' >
                            <Form.Select 
                                aria-label="Select Unit" 
                                onChange={(e) => {
                                    setUnit(e.target.value, index)
                                }}
                                className={item.unit == undefined ? 'text-muted' : ''}
                            >
                                <option key='blankChoice' hidden value>Unit</option>
                                <option></option>
                                {units.map((unit, idx) => 
                                    <option key={idx} value={unit}>{unit}</option>
                                )}
                            </Form.Select>
                        </Col>
                    </li>
                )}
            </ol>
        </Form.Group>
    )
}


export default IngredientsList
