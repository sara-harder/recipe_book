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


    const getFraction = (num, cls='fs-7 pe-1') => {
        if (Math.abs(num - 0.75)    < 0.01) return [3, 4]
        if (Math.abs(num - 0.666)   < 0.01) return [2, 3]
        if (Math.abs(num - 0.5)     < 0.01) return [1, 2]
        if (Math.abs(num - 0.333)   < 0.01) return [1, 3]
        if (Math.abs(num - 0.25)    < 0.01) return [1, 4]
        if (Math.abs(num - 0.166)   < 0.01) return [1, 6]
        if (Math.abs(num - 0.125)   < 0.01) return [1, 8]
        return num
    }

    const checkFraction = (num) => {
        if (num == undefined) return undefined
        if (num < 1) {
            const frac = getFraction(num)
            return(
                <span className='pe-1'>
                    <sup>{frac[0]}</sup>
                    /
                    <sub>{frac[1]}</sub>
                </span>
            )
        }
        if (num % 1 !== 0) {
            const frac = getFraction(num % 1)
            return (
                <>
                    {Math.floor(num/1)}
                    <span className='fs-7 pe-1'>
                        <sup>{frac[0]}</sup>
                        /
                        <sub>{frac[1]}</sub>
                    </span>
                </>
            )
        }
        return num
    }

    return(
        <Container fluid>
            <Row className='bg-color3 my-3 py-3 fs-5'>
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
