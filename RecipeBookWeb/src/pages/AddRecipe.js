// react imports
import React from 'react';
import { useState, useEffect } from 'react';

// bootstrap imports
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

// style imports
import '../styling/Add.css';

// function imports
import { category_funcs } from 'recipe-book';


const CategorySelector = () => {
    const [selected, setSelected] = useState(new Set())

    // var determines if category options list should be hidden or not
    const [hide_list,  setHidden] = useState(true)

    // Get the categories for the dropdown
    const [savory, setSavory] = useState([])
    const [sweet, setSweet] = useState([])
    useEffect(() =>{
        const getSavory = async ()=> {
            const categories = await category_funcs.getFlavorType("Savory")
            setSavory(categories)
        }
        const getSweet = async ()=> {
            const categories = await category_funcs.getFlavorType("Sweet")
            setSweet(categories)
        }
        getSavory()
        getSweet()
    }, []);

    const updateCategories = (category, checked) => {
        const copy = new Set(selected)

        if (checked) copy.add(category)
        else copy.delete(category)

        setSelected(copy)
    }

    return(
        <Form.Group className="mb-4 position-relative m-0" controlId="recipeCategory">
            <Form.Label>Category</Form.Label>

            <div onClick={() => setHidden(!hide_list)} className="form-select py-0 ps-3 pe-5 center-vertical">
                <Row>
                    {selected.size == 0 ? 
                        <div className='text-muted'>Select Categories</div>
                    : 
                        Array.from(selected).map((item, index) => {
                            return(
                                <Col key={index} xs={1} className='py-1 px-3 w-auto border border-grey rounded'>
                                    {item.name}
                                </Col>
                            )
                        })
                    }
                </Row>
            </div>

            <ul className="list-unstyled search-results" hidden={hide_list}>
                {(savory.concat(sweet)).map((item, index) =>           
                    <li key={index} className='py-1'>
                        <Row>
                            <Col xs={1} className='w-auto pe-0'>
                                <Form.Check
                                    type='checkbox'
                                    id={`${item.name} checkbox`}
                                    onChange={(e) => updateCategories(item, e.target.checked)}
                                />
                            </Col>
                            <Col className='ps-2'>
                                <label className='form-check-label w-100' for={`${item.name} checkbox`}>
                                    {item.name}
                                </label>
                            </Col>
                        </Row>
                    </li>
                )}
            </ul>
        </Form.Group>
    )
}


const IngredientsList = () => {
    // constructor for single ingredient object
    class Ingredient {
        constructor(name, quantity=undefined, unit=undefined) {
          this.name = name;
          this.quantity = quantity;
          this.unit = unit;
        }
    }
    // list of ingredients, to be updated in real time
    const [ingredients, setIngredients] = useState([new Ingredient("")])

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
    const units = ['mg', 'g', 'kg', 'lb (pounds)', 'oz', 'ml', 'cl', 'dl', 'l', 'tsp', 'tbsp', 'fl oz', 'cup', 'pint', 'quart', 'gallon', 'sm (small)', 'md (medium)', 'lg (large)']
    
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

const DirectionsList = () => {
    // list of directions, to be updated in real time
    const [directions, setDirections] = useState([""])

    // when user starts typing, add a new empty input line
    if (directions[directions.length-1] != "") {
        const copy = directions.slice()
        copy.push("")
        setDirections(copy)
    }

    // update the direction while user is typing. find direction to update using index
    const addDirection = (direction, index) => {
        const copy = directions.slice()
        copy[index] = direction
        setDirections(copy)
    }
    return(
        <Form.Group className="mb-4" controlId="recipeDirections">
            <Form.Label className='mb-1'>Directions</Form.Label>
            <ol className='list-unstyled'>
                {directions.map((item, index) => 
                    <li className='row py-1' key={index}>
                        <Col className='col-1 w-auto center-vertical pe-1'>
                            {index + 1}.
                        </Col>
                        <Col className='ps-1 pe-2 me-1' >
                            <Form.Control 
                                type="name" 
                                placeholder="Write directions"
                                value={item}
                                onChange={(e) => addDirection(e.target.value, index)}
                            />
                        </Col>
                    </li>
                )}
            </ol>
        </Form.Group>
    )
}


function AddRecipe({setHeader}) {
    useEffect(() => {
        setHeader("Add a Recipe")
    }, [])

    return(
        <Container fluid className='mt-4 form-container'>
                <Form>
                    <Row className='pe-0'>
                        <Col xs={10} className='pe-1'>
                            <Form.Group className="mb-4" controlId="recipeName">
                                <Form.Label>Recipe Name</Form.Label>
                                <Form.Control type="name" placeholder="Enter name" />
                            </Form.Group>
                        </Col>

                        <Col xs={2} className='ps-1'>
                            <Form.Group className="mb-4" controlId="recipePortions">
                                <Form.Label>Portions</Form.Label>
                                <Form.Control type="number" defaultValue={4} className='number-input'/>
                            </Form.Group>
                        </Col>
                    </Row>

                    <CategorySelector />

                    <IngredientsList />
                    <DirectionsList />

                    <Row>
                        <Col className='right py-5 pe-0'>
                            <Button variant="primary" type="submit">
                                Add Recipe
                            </Button>
                        </Col>
                    </Row>
                </Form>
        </Container>
    )
}

export default AddRecipe;