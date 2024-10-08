// react imports
import React from 'react';
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

// bootstrap imports
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';
import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/esm/Button';

// style imports
import '../styling/Recipe.css';

// function imports
import { checkFraction } from 'recipe-book/helpers';

function ViewRecipe({setHeader, setRecipe, setFavorite}) {
    const navigate = useNavigate();
    const location = useLocation();
    const recipe = location.state.recipe

    useEffect(() => {
        setHeader(recipe.name)
    }, [recipe])
    setRecipe(recipe)

    const favorites = useSelector(state=> state.user.value.favorites);

    useEffect(()=>{
        setFavorite(favorites.includes(recipe._id))
    }, [recipe])

    let recipe_round = "rounded"
    if (recipe.image) recipe_round = "rounded-bottom"

    return(
        <Container fluid className='mt-4 mb-5'>
            {recipe.image ? 
                <Row className='g-0'>
                    <Col>
                        <Image src={recipe.image} className='rounded-top recipe_img px-0'/>
                    </Col>
                </Row>
            : null }
            <Row className={[recipe_round, 'bg-color3 p-3 pt-4 g-0 fs-55']}>
                <Col xs={5} md={4} lg={3} className='overflow-hidden'>
                    <h5 className='fw-bold px-3'>Ingredients:</h5>
                    <ul className='list-unstyled'>
                        {recipe.ingredients.map((item, index) => 
                            <li className='row' key={index}>
                                <Col className='col-5 right text-nowrap overflow-hidden' >{checkFraction(item.quantity)}{item.unit}</Col>
                                <Col className='col-7 left' >{item.name}</Col>
                            </li>
                        )}
                    </ul>
                </Col>

                <Col xs={7} md={8} lg={9} className='border-start border-success px-3'>
                    <h5 className='fw-bold px-3'>Directions:</h5>
                    <ul>
                        {recipe.directions.map((item, index) => 
                            <li key={index}>{item}</li>
                        )}
                    </ul>
                </Col>
            </Row>
            <Row>
                <Col className='py-5 px-4 center-content'>
                    <Button variant="success" type="button" size='lg' className='bg-color5 border-color5' onClick={() => { if (recipe.connections)navigate('/cooking', {state: {recipe: recipe}})}}>
                        Start Cooking!
                    </Button>
                </Col>
            </Row>
        </Container>
    )
}

export default ViewRecipe;
