// react imports
import React from 'react';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

// bootstrap imports
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';
import Image from 'react-bootstrap/Image';

// style imports
import '../styling/Recipe.css';

// function imports
import { checkFraction } from 'recipe-book/helpers';

function ViewRecipe({setHeader, setRecipe, setFavorite}) {
    const location = useLocation();
    const recipe = location.state.recipe

    useEffect(() => {
        setHeader(recipe.name)
    }, [])
    setRecipe(recipe)

    const ingredients = recipe.ingredients


    const favorites = useSelector(state=> state.user.value.favorites);

    useEffect(()=>{
        setFavorite(favorites.includes(recipe._id))
    }, [recipe])

    let recipe_round = "rounded"
    if (recipe.image) recipe_round = "rounded-bottom"

    return(
        <Container fluid className='mt-4'>
            {recipe.image ? 
                <Row className='g-0'>
                    <Col>
                        <Image src={recipe.image} className='rounded-top recipe_img px-0'/>
                    </Col>
                </Row>
            : null }
            <Row className={[recipe_round, 'bg-color3 p-3 pt-4 g-0 fs-5']}>
                <Col xs={5} md={4} lg={3}>
                    <h4 className='fw-bold px-3'>Ingredients:</h4>
                    <ul className='list-unstyled'>
                        {ingredients.map((item, index) => 
                            <li className='row' key={index}>
                                <Col className='col-4 right' >{checkFraction(item.quantity)}{item.unit}</Col>
                                <Col className='col-8 left' >{item.name}</Col>
                            </li>
                        )}
                    </ul>
                </Col>

                <Col xs={7} md={8} lg={9} className='border-start border-primary px-3'>
                    <h4 className='fw-bold px-3'>Directions:</h4>
                    <ul>
                        {recipe.directions.map((item, index) => 
                            <li key={index}>{item}</li>
                        )}
                    </ul>
                </Col>
            </Row>
        </Container>
    )
}

export default ViewRecipe;
