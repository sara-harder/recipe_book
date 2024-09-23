// react imports
import React from 'react';
import { useState } from 'react';

// bootstrap imports
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';
import Form from 'react-bootstrap/Form';
import Dropdown from 'react-bootstrap/Dropdown';

// style imports
import { FaRegTrashAlt as TrashIcon } from "react-icons/fa";


const IngredientsList = ({Ingredient, ingredients, setIngredients}) => {
    // index of last ingredient
    const end_idx = ingredients.length-1

    // when user starts typing, add a new empty input line
    if (ingredients.length == 0 || ingredients[end_idx].name != "") {
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
    const metric = ['mg', 'g', 'kg', 'ml', 'cl', 'dl', 'l']
    const imperial = ['tsp', 'tbsp', ' cup(s)', 'lb', 'oz', 'fl oz', ' pint(s)', ' quart(s)', ' gallon(s)']
    const other = [' small', ' medium', ' large', ' clove(s)', ' slice(s)', ' cube(s)']
    
    // update the ingredient unit when user selects. find ingredient to update using index
    const setUnit = (value, index) => {
        const copy = ingredients.slice()
        copy[index].unit = value
        setIngredients(copy)
    }   


    // remove the appropriate ingredient when trash icon is clicked
    const removeIngredient = (index) => {
        const copy = ingredients.slice(0, index)
        const copy2 = ingredients.slice(index+1, end_idx)

        setIngredients(copy.concat(copy2))

        setTrash(-1)
    }

    // change the trash-can color on hover
    const [trashIdx, setTrash] = useState(-1)

    const visible = ingredients.length <= 1
    const [rowOpacity, setOpacity] = useState(-1)

    return(
        <Form.Group className="mb-4" controlId="recipeIngredients">
            <Form.Label className='mb-1'>Ingredients</Form.Label>
            <ol className='list-unstyled'>
                {ingredients.map((item, index) => 
                    <li className='row py-1 flex-nowrap' key={index}>
                        <Col xs={11} className='pe-0'><Row className='pe-0'>
                            <Col className='col-1 w-auto center-vertical pe-1' style={index != end_idx || visible || rowOpacity == index ? {} : {opacity: .5}}>
                                {index + 1}.
                            </Col>
                            <Col className='px-1' >
                                <Form.Control 
                                    type="name" 
                                    placeholder="Add ingredient (Name)"
                                    value={item.name}
                                    onChange={(e) => setName(e.target.value, index)}
                                    onFocus={() => setOpacity(index)}
                                    onBlur = {() => setOpacity(-1)}
                                    style={index != end_idx || visible || rowOpacity == index ? {} : {opacity: .5}}
                                    required={ingredients.length <= 1}
                                />
                                <Form.Control.Feedback type="invalid" className='ps-2'>
                                    Please add at least one ingredient
                                </Form.Control.Feedback>
                            </Col>
                            <Col className='col-3 px-1' >
                                <Form.Control 
                                    type="number" 
                                    className={`number-input bg-white`}
                                    placeholder="Quantity" 
                                    value={item.quantity}
                                    onChange={(e) => setQuantity(e.target.value, index)}
                                    disabled={item.name == ''}
                                    style={item.name == '' ? {opacity: .5} : {}}
                                />
                            </Col>
                            <Col className='col-3 ps-1 pe-2 me-1' >
                                <Form.Select 
                                    aria-label="Select Unit" 
                                    className={`${item.unit == undefined ? 'text-muted' : ''} bg-white`}
                                    value={item.unit}
                                    onChange={(e) => setUnit(e.target.value, index)}
                                    disabled={item.name == ''}
                                    style={item.name == '' ? {opacity: .5} : {}}
                                >
                                    <option key='blankChoice' hidden value>Unit</option>
                                    <option></option>
                                    {metric.map((unit, idx) => 
                                        <option key={idx} value={unit}>{unit}</option>
                                    )}
                                    <Dropdown.Divider />
                                    {imperial.map((unit, idx) => 
                                        <option key={idx} value={unit}>{unit}</option>
                                    )}
                                    <Dropdown.Divider />
                                    {other.map((unit, idx) => 
                                        <option key={idx} value={unit}>{unit}</option>
                                    )}
                                </Form.Select>
                            </Col>
                        </Row></Col>
                        <Col className='col-1 w-auto center-vertical'>
                            {index == end_idx ? 
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
