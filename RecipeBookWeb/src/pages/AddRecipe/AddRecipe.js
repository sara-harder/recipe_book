// react imports
import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom"

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
import { recipe_funcs } from 'recipe-book';
import { rec_cat_funcs } from 'recipe-book';


const CategorySelector = ({selected, setSelected, validated}) => {
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
            <MultiSelectDropdown data={categories} selected={selected} setSelected={setSelected} validated={validated}/>
        </Form.Group>
            
    )
}


function AddRecipe({setHeader}) {
    const navigate = useNavigate()

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

    const [validated, setValidated] = useState(false)
    const validateRecipe = () => {
        setValidated(true)
        if (name == '') return false
        if (portions <= 0 || portions > 100) return false
        if (categories.size == 0) return false
        if (ingredients.length == 1) return false
        if (directions.length == 1) return false
        return true
    }


    // add the new recipe to the database
    const createRecipe = async () => {
        if (validateRecipe() == false) return
        const new_recipe = await recipe_funcs.addRecipe(name, portions, ingredients.slice(0, ingredients.length-1), 
                    directions.slice(0, directions.length-1), image, source)

        // connect the recipe to the chosen categories
        for (const cat of categories) {
            rec_cat_funcs.connectRecipeCat(new_recipe._id, cat._id)
        }

        // go back to the previous page
        navigate(-1)
    }

    return(
        <Container fluid className='mt-4 form-container'>
                <Form noValidate validated={validated}>
                    <Row className='pe-0'><Col xs={11} className='pe-0'><Row>
                        <Col xs={10} className='pe-1'>
                            <Form.Group className="mb-4" controlId="recipeName">
                                <Form.Label>Recipe Name</Form.Label>
                                <Form.Control 
                                    type="name" 
                                    placeholder="Enter name" 
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                                <Form.Control.Feedback type="invalid" className='ps-2'>
                                    Please give your recipe a name
                                </Form.Control.Feedback>
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
                                    min={1}
                                    max={100}
                                    required
                                />
                                <Form.Control.Feedback type="invalid" className='ps-2'>
                                    Please indicate a portion size greater than 0
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                    </Row></Col></Row>

                    <Row className='pe-0'><Col xs={11} className='pe-0'>
                        <CategorySelector selected={categories} setSelected={setCategories} validated={validated}/>
                    </Col></Row>

                    <IngredientsList Ingredient={Ingredient} ingredients={ingredients} setIngredients={setIngredients} />
                    <DirectionsList directions={directions} setDirections={setDirections} />

                    <Row>
                        <Col className='right py-5 px-4'>
                            <Button variant="success" type="button" className='bg-color5 border-color5' onClick={() => createRecipe()}>
                                Add Recipe
                            </Button>
                        </Col>
                    </Row>
                </Form>
        </Container>
    )
}

export default AddRecipe;