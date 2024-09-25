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


const CategorySelector = ({selected, setSelected, validated}) => {
    const location = useLocation();

    // Get the categories for the dropdown
    const [savory, setSavory] = useState([])
    const [sweet, setSweet] = useState([])
    useEffect(() =>{
        const getCategories = async ()=> {
            const sav = await category_funcs.getFlavorType("Savory")
            setSavory(sav)
            const sw = await category_funcs.getFlavorType("Sweet")
            setSweet(sw)
        }
        getCategories()
    }, []);

    // add any preselected categories to the selected list
    const getPrefilled = () => {
        if (location.state){
            if (location.state.precategory){
                for (const item of savory.concat(sweet)){
                    if (item.name == location.state.precategory.name) {
                        setSelected(new Set([item]))
            }}}
            if (location.state.recipe) {
                const prefilled = []
                for (const cat of location.state.recipe.categories){
                    for (const item of savory.concat(sweet)){
                        if (item.name == cat.name) {
                            prefilled.push(item)
                        }}
                }
                setSelected(new Set(prefilled))
            }
        }
    }

    useEffect(() => {
        getPrefilled()
    }, [savory])

    return(
        <Form.Group className="mb-4 position-relative m-0" controlId="recipeCategory">
            <Form.Label>Category</Form.Label>
            <MultiSelectDropdown data_lists={[{label: "Savory", list: savory}, {label: "Sweet", list: sweet}]} selected={selected} setSelected={setSelected} validated={validated}/>
        </Form.Group>
            
    )
}


function AddRecipe({setHeader}) {
    const navigate = useNavigate()
    const location = useLocation()

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

    let prefilled = undefined
    if (location.state) {
        if (location.state.recipe) {
            prefilled = location.state.recipe
        }
    }

    const [name, setName] = useState(prefilled ? prefilled.name : '')
    const [portions, setPortions] = useState(prefilled ? prefilled.portions : 4)
    const [imageName, setImage] = useState('')
    const [imageFile, setFile] = useState('')
    const [source, setSource] = useState(prefilled ? prefilled.source : '')
    const [categories, setCategories] = useState(new Set())
    const [ingredients, setIngredients] = useState(prefilled ? prefilled.ingredients : [new Ingredient("")])
    const [directions, setDirections] = useState(prefilled ? prefilled.directions : [""])

    /* not in use atm: need to use alternate server for uploading images to database
    // read the image file and add it to the database
    function readImageFile(fileInput) {
    // function source: https://mdbootstrap.com/docs/standard/extended/file-input-image/
        if (fileInput.files && fileInput.files[0]) {
            const reader = new FileReader();
    
            reader.onload = function(e) {
                setFile(e.target.result)
            };
    
            reader.readAsDataURL(fileInput.files[0]);
        }
    }
    */

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


    // send the new recipe to the map page to map ingredients to directions
    const sendRecipe = () => {
        if (validateRecipe() == false) return

        navigate("map-recipe", {state:{recipe: {
            name, portions, ingredients: ingredients.slice(0, ingredients.length-1), 
            directions: directions.slice(0, directions.length-1), image: imageName.replace("C:\\fakepath\\", "../images/"), 
            source, categories}}})
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

                <Row className='pe-0'><Col xs={11} className='pe-0'><Row>
                    <Col xs={5} className='pe-1'>
                        <Form.Group className="mb-4" controlId="recipeImage">
                            <Form.Label>Image</Form.Label>
                            <Form.Control 
                                type="file" 
                                value={imageName}
                                onChange={(e) => {
                                    setImage(e.target.value)
                                    // readImageFile(e.target)
                                }}
                                required
                            />
                            <Form.Control.Feedback type="invalid" className='ps-2'>
                                Please provide an image
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Col>

                    <Col xs={7} className='ps-1'>
                        <Form.Group className="mb-4" controlId="recipeSource">
                            <Form.Label>Recipe Source</Form.Label>
                            <Form.Control 
                                type="source" 
                                placeholder="URL, (last name) family recipe, recipe book..." 
                                value={source}
                                onChange={(e) => setSource(e.target.value)}
                                required
                            />
                            <Form.Control.Feedback type="invalid" className='ps-2'>
                                Please add a source
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                </Row></Col></Row>

                <Row className='p-3'></Row>

                <Row className='pe-0'><Col xs={11} className='pe-0'>
                    <CategorySelector selected={categories} setSelected={setCategories} validated={validated}/>
                </Col></Row>

                <IngredientsList Ingredient={Ingredient} ingredients={ingredients} setIngredients={setIngredients} />
                <DirectionsList directions={directions} setDirections={setDirections} />

                <Row>
                    <Col className='right py-5 px-4'>
                        <Button variant="success" type="button" className='bg-color5 border-color5' onClick={() => sendRecipe()}>
                            Add Recipe
                        </Button>
                    </Col>
                </Row>
            </Form>
        </Container>
    )
}

export default AddRecipe;