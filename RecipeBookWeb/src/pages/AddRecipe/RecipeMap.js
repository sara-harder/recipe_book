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

// style imports
import './Add.css';

// function imports
import { recipe_funcs, rec_cat_funcs } from 'recipe-book';
import { checkFraction } from 'recipe-book/helpers';


const Lines = ({ingr, dir, viewport_w}) => {
    // draw the lines between the radio buttons
    const ingredient = document.getElementById(`ingredient-${ingr}`)
    const direction = document.getElementById(`direction-${dir}`)

    const ingr_coords = ingredient.getBoundingClientRect()
    const dir_coords = direction.getBoundingClientRect()

    const scrollTop = window.scrollY

    const ingr_center = ingr_coords.height / 2 + ingr_coords.top - 240 + scrollTop
    const dir_center = dir_coords.height / 2 + dir_coords.top - 240 + scrollTop

    return (
        <line x1={0} y1={ingr_center} x2="100%" y2={dir_center} stroke="black"/>
    )
}


function MapPage({setHeader}) {
    const navigate = useNavigate()
    const location = useLocation();
    const recipe = location.state.recipe

    useEffect(() => {
        setHeader("Recipe Mapping")
    }, [])

    const [selectedIngredients, setIngredients] = useState(new Set())
    const [selectedDirection, setDirection] = useState(-1)
    const [connections, setConnected] = useState({})

    // update set of selected ingredients when a radio button is selected
    const updateIngredients = (index) => {
        // clear previous selection when new selection started
        let copy = new Set(selectedIngredients)
        if (selectedDirection != -1) {
            copy = new Set()
            setDirection(-1)
        }

        // add selected button to selected ingredients
        if (!selectedIngredients.has(index)) copy.add(index)
        else copy.delete(index)

        setIngredients(copy)
    }

    // update the dictionary of connections when a direction is selected
    useEffect(() => {
        if (selectedDirection != -1) {
            const copy = {...connections}
            for (const elem of selectedIngredients)
                copy[elem] = selectedDirection
            setConnected(copy)
        }
    }, [selectedDirection])
    
    // clears the radios when user clicks outside
    const useClickOutsideDropdown = () => {
    // function source: https://www.robinwieruch.de/react-hook-detect-click-outside-component/
        const ref = React.useRef();

        React.useEffect(() => {
            const handleClick = (event) => {
                // executes if element with ref is not a parent of the element clicked
                if (ref.current && !ref.current.contains(event.target)) {
                    setIngredients(new Set())
                    setDirection(-1);
                }
            };
        
            document.addEventListener('click', handleClick);
            return () => {
                document.removeEventListener('click', handleClick);
            };
        }, [ref]);
        
        return ref;
    };
    const ref = useClickOutsideDropdown()


    const [viewport_w, setViewport] = useState(0)
    window.addEventListener('resize', () => {
        setViewport(window.innerWidth)
    });

    
    // add the new recipe to the database
    const createRecipe = async () => {
        const final_connections = {}
        for (const ingr in recipe.ingredients) {
            const dir = connections[ingr]

            if (dir == undefined) {
                alert('Please map all of the ingredients to an instruction')
                return
            }

            if (final_connections[dir]) final_connections[dir].push(Number(ingr))
            else final_connections[dir] = [Number(ingr)]
        }

        const new_recipe = await recipe_funcs.addRecipe(recipe.name, recipe.portions, recipe.ingredients, recipe.directions, final_connections, recipe.image, recipe.source)

        // connect the recipe to the chosen categories
        for (const cat of recipe.categories) {
        rec_cat_funcs.connectRecipeCat(new_recipe._id, cat._id)
        }

        // go view the new recipe
        navigate("/view-recipe", {state:{recipe: new_recipe}})
    }

    return(
        <Container fluid className='p-0'>
            <h5 className='fw-bold pt-4 pe-5 pb-3 ps-0 text-center text-nowrap'>Connect each ingredient to the instruction where it is first used</h5>
            <Row ref={ref} className='flex-nowrap p-0 m-0'>
                <Col xs={4} className='pe-1 rounded-start bg-color3 p-4' style={{'minWidth': '250px'}}>
                    <h5 className='fw-bold'>Ingredients:</h5>
                    <ul className='list-unstyled'>
                        {recipe.ingredients.map((item, index) => 
                            <li className='row fs-55 mx-0' key={index}>
                                <Col className='col-4 right text-nowrap overflow-hidden' >{checkFraction(item.quantity)}{item.unit}</Col>
                                <Col className='col-7 left overflow-hidden' >{item.name}</Col>
                                <Col className='col-1 right center-vertical p-0' >
                                    <Form.Check
                                        type='radio'
                                        id={`ingredient-${index}`}
                                        onChange={()=>{}}
                                        onClick={() => updateIngredients(index)}
                                        checked={selectedIngredients.has(index)}
                                        className='ps-3 pe-2'
                                    />
                                </Col>
                            </li>
                        )}
                    </ul>
                </Col>
                <Col xs={2} className='pt-3 p-0 bg-color3' width='15%'>
                    <svg width="100%" height="100%" className='pt-4'>
                        {recipe.ingredients.map((ingr, idx) => {
                            if (connections[idx] != undefined){ return(
                                <Lines key={idx} ingr={idx} dir={connections[idx]} viewport_w={viewport_w} />
                            )}
                        })}
                    </svg>
                </Col>
                <Col xs={6} className='rounded-end bg-color3 p-4 ps-2' style={{'minWidth': '300px'}}>
                    <h5 className='fw-bold'>Directions:</h5>
                    <ul className='list-unstyled'>
                        {recipe.directions.map((item, index) => 
                            <li key={index} className='fs-55 row ps-3 w-100'>
                                <Form.Check
                                    type='radio'
                                    id={`direction-${index}`}
                                    label={item}
                                    onChange={()=>{}}
                                    onClick={() => setDirection(index)}
                                    checked={selectedDirection == index}
                                />
                            </li>
                        )}
                    </ul>
                </Col>
            </Row>

            <Row className='mx-5'>
                <Col className='left py-5 ps-5'>
                    <Button variant="success" type="button" className='bg-color5 border-color5' onClick={() => navigate("/add-recipe", {state:{recipe: recipe}})}>
                        Back
                    </Button>
                </Col>
                <Col className='right py-5 px-5'>
                    <Button variant="success" type="button" className='bg-color5 border-color5' onClick={() => createRecipe()}>
                        Finish Mapping
                    </Button>
                </Col>
            </Row>
        </Container>
    )
}

export default MapPage
