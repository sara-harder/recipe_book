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


const IngredientsList = () => {
    class Ingredient {
        constructor(name, quantity=undefined, unit=undefined) {
          this.name = name;
          this.quantity = quantity;
          this.unit = unit;
        }
    }
    const [ingredients, setIngredients] = useState([new Ingredient("")])

    if (ingredients[ingredients.length-1].name != "") {
        const copy = ingredients.slice()
        copy.push(new Ingredient(""))
        setIngredients(copy)
    }

    const setName = (value, index) => {
        const copy = ingredients.slice()
        copy[index].name = value
        setIngredients(copy)
    }

    const setQuantity = (value, index) => {
        const copy = ingredients.slice()
        copy[index].quantity = value
        setIngredients(copy)
    }

    const setUnit = (value, index) => {
        const copy = ingredients.slice()
        copy[index].unit = value
        setIngredients(copy)
    }

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
                        <Col className='col-2 px-1' >
                            <Form.Control 
                                type="name" 
                                placeholder="Unit" 
                                value={item.unit}
                                onChange={(e) => setUnit(e.target.value, index)}
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
                    <Row>
                        <Col xs={10} className='pe-1'>
                            <Form.Group className="mb-4" controlId="recipeName">
                                <Form.Label>Recipe Name</Form.Label>
                                <Form.Control type="name" placeholder="Enter name" />
                            </Form.Group>
                        </Col>

                        <Col xs={2} className='px-1'>
                            <Form.Group className="mb-4" controlId="recipePortions">
                                <Form.Label>Portions</Form.Label>
                                <Form.Control type="number" defaultValue={4} className='number-input'/>
                            </Form.Group>
                        </Col>
                    </Row>

                    <IngredientsList />

                    <Row>
                        <Col className='right pt-5 pe-0'>
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