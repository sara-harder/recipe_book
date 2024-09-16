// react imports
import React from 'react';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// bootstrap imports
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

// component imports
import MultiSelectDropdown from '../../components/MultiSelectDropdown/MultiSelectDropdown';
import IngredientsList from './Ingredients';
import DirectionsList from './Directions';

// style imports
import './Add.css';

// function imports
import { category_funcs } from 'recipe-book';


const CategorySelector = ({selected, setSelected}) => {
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

    return(
        <Form.Group className="mb-4 position-relative m-0" controlId="recipeCategory">
            <Form.Label>Category</Form.Label>
            <MultiSelectDropdown data={savory.concat(sweet)} selected={selected} setSelected={setSelected}/>
        </Form.Group>
            
    )
}


function AddRecipe({setHeader}) {
    useEffect(() => {
        setHeader("Add a Recipe")
    }, [])

    const location = useLocation();
    let precategory = undefined
    if (location.state) precategory = location.state.precategory

    class Ingredient {
        constructor(name, quantity=undefined, unit=undefined) {
          this.name = name;
          this.quantity = quantity;
          this.unit = unit;
        }
    }

    const [name, setName] = useState('')
    const [portions, setPortions] = useState(4)
    const [categories, setCategories] = useState(precategory == undefined ? new Set() : new Set([precategory]))
    const [ingredients, setIngredients] = useState([new Ingredient("")])
    const [directions, setDirections] = useState([""])
    const [image, setImage] = useState('')
    const [source, setSource] = useState('')

    return(
        <Container fluid className='mt-4 form-container'>
                <Form>
                    <Row className='pe-0'>
                        <Col xs={10} className='pe-1'>
                            <Form.Group className="mb-4" controlId="recipeName">
                                <Form.Label>Recipe Name</Form.Label>
                                <Form.Control 
                                    type="name" 
                                    placeholder="Enter name" 
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </Form.Group>
                        </Col>

                        <Col xs={2} className='ps-1'>
                            <Form.Group className="mb-4" controlId="recipePortions">
                                <Form.Label>Portions</Form.Label>
                                <Form.Control 
                                    className='number-input'
                                    type="number"
                                    value={portions}
                                    onChange={(e) => setPortions(e.target.value)}
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <CategorySelector selected={categories} setSelected={setCategories}/>

                    <IngredientsList Ingredient={Ingredient} ingredients={ingredients} setIngredients={setIngredients} />
                    <DirectionsList directions={directions} setDirections={setDirections} />

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