// react imports
import React from 'react';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

// bootstrap imports
import Container from 'react-bootstrap/Container';

// style imports
import '../styling/Recipe.css';
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';

function ViewRecipe({setHeader, setRecipe, setFavorite}) {
    const location = useLocation();
    const recipe = location.state.recipe

    setHeader(recipe.name)
    setRecipe(recipe)

    const ingredients = recipe.ingredients


    const favorites = useSelector(state=> state.user.value.favorites);

    useEffect(()=>{
        setFavorite(favorites.includes(recipe._id))
    }, [])

    return(
        <Container fluid>
            <Row className='bg-color3 my-3 py-3 fs-5'>
                <Col xs={5} md={4} lg={3}>
                    <h4 className='fw-bold px-3'>Ingredients:</h4>
                    <ul className='list-unstyled'>
                        {ingredients.map((item, index) => 
                            <li className='row' key={index}>
                                <Col className='col-4 right' >{item.quantity}{item.unit}  </Col>
                                <Col className='col-8 left' >{item.name}</Col>
                            </li>
                        )}
                    </ul>
                </Col>
                
                <Col xs={7} md={8} lg={9} className='border-start border-primary'>
                    <h4 className='fw-bold px-3'>Directions:</h4>
                    <ul>
                        {recipe.directions.map((item, index) => 
                            <li key={index}>{item}</li>
                        )}
                    </ul>
                </Col>
            </Row>
            <div>
                {recipe.image ? <div className='recipe_img'></div> : null}
                
            </div>
        </Container>
    )
}

export default ViewRecipe;
