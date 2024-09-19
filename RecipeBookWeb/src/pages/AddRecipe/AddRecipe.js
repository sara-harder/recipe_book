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
    const location = useLocation();

    // Get the categories for the dropdown
    const [categories, setCategories] = useState([])
    useEffect(() =>{
        const getCategories = async ()=> {
            const savory = await category_funcs.getFlavorType("Savory")
            const sweet = await category_funcs.getFlavorType("Sweet")
            const cats = savory.concat(sweet)
            setCategories(cats)

            // add any preselected categories to the selected list
            if (location.state){
                for (const item of cats){
                    if (item.name == location.state.precategory.name) {
                        setSelected(new Set([item]))
            }}}
        }
        getCategories()
    }, []);

    return(
        <Form.Group className="mb-4 position-relative m-0" controlId="recipeCategory">
            <Form.Label>Category</Form.Label>
            <MultiSelectDropdown data={categories} selected={selected} setSelected={setSelected}/>
        </Form.Group>
            
    )
}


function AddRecipe({setHeader}) {
    useEffect(() => {
        setHeader("Add a Recipe")
    }, [])

    class Ingredient {
        constructor(name, quantity=undefined, unit=undefined) {
          this.name = name;
          this.quantity = quantity;
          this.unit = unit;
        }
    }

    const [name, setName] = useState('')
    const [portions, setPortions] = useState(4)
    const [categories, setCategories] = useState(new Set())
    const [ingredients, setIngredients] = useState([new Ingredient("")])
    const [directions, setDirections] = useState([""])
    const [image, setImage] = useState('')
    const [source, setSource] = useState('')

    return(
        <Container fluid className='mt-4 form-container'>
                <Form>
                    <Row className='pe-0'><Col xs={11} className='pe-0'><Row>
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
                    </Row></Col></Row>

                    <Row className='pe-0'><Col xs={11} className='pe-0'>
                        <CategorySelector selected={categories} setSelected={setCategories}/>
                    </Col></Row>

                    <IngredientsList Ingredient={Ingredient} ingredients={ingredients} setIngredients={setIngredients} />
                    <DirectionsList directions={directions} setDirections={setDirections} />

                    <Row>
                        <Col className='right py-5 px-4'>
                            <Button variant="success" type="submit">
                                Add Recipe
                            </Button>
                        </Col>
                    </Row>
                </Form>
        </Container>
    )
}

export default AddRecipe;