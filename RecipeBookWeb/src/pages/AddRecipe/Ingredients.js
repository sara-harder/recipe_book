// react imports
import React from 'react';
import { useState } from 'react';

// bootstrap imports
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';
import Form from 'react-bootstrap/Form';

// style imports
import { FaRegTrashAlt as TrashIcon } from "react-icons/fa";


const IngredientsList = ({Ingredient, ingredients, setIngredients}) => {
    // when user starts typing, add a new empty input line
    if (ingredients.length == 0 || ingredients[ingredients.length-1].name != "") {
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

    // possible units
    const units = ['mg', 'g', 'kg', 'lb (pounds)', 'oz', 'ml', 'cl', 'dl', 'l', 'tsp', 'tbsp', 'fl oz', 'cup(s)', 'pint', 'quart', 'gallon', 'sm (small)', 'md (medium)', 'lg (large)']
    
    // update the ingredient unit when user selects. find ingredient to update using index
    const setUnit = (value, index) => {
        const copy = ingredients.slice()
        copy[index].unit = value
        setIngredients(copy)
    }   


    // remove the appropriate ingredient when trash icon is clicked
    const removeIngredient = (index) => {
        const copy = ingredients.slice(0, index)
        const copy2 = ingredients.slice(index+1, ingredients.length-1)

        setIngredients(copy.concat(copy2))

        setTrash(-1)
    }

    // change the trash-can color on hover
    const [trashIdx, setTrash] = useState(-1)

    return(
        <Form.Group className="mb-4" controlId="recipeIngredients">
            <Form.Label className='mb-1'>Ingredients</Form.Label>
            <ol className='list-unstyled'>
                {ingredients.map((item, index) => 
                    <li className='row py-1 flex-nowrap' key={index}>
                        <Col xs={11} className='pe-0'><Row className='pe-0'>
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
                                    value={item.unit}
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
                        </Row></Col>
                        <Col className='col-1 w-auto center-vertical'>
                            {index == ingredients.length-1 ? 
                                <TrashIcon size='1.15em' color='transparent' /> 
                            : 
                                <TrashIcon 
                                    size="1.15em" 
                                    color={trashIdx == index ? 'red' : '#404040'}
                                    onMouseEnter={() => setTrash(index)} 
                                    onMouseLeave={() => setTrash(-1)}
                                    onClick={() => removeIngredient(index)}
                                />
                            }
                        </Col>
                    </li>
                )}
            </ol>
        </Form.Group>
    )
}


export default IngredientsList
