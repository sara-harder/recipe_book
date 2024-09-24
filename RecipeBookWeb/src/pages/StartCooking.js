// react imports
import React from 'react';
import { useState, useEffect } from 'react';
import { useLocation } from "react-router-dom";

// bootstrap imports
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';

// function imports
import { checkFraction } from 'recipe-book/helpers';
import Button from 'react-bootstrap/esm/Button';

function StartCooking() {
    const location = useLocation();
    const recipe = location.state.recipe

    const [selected, setSelected] = useState(0)
    const [connected, setConnected] = useState([])

    useEffect(() => {
        if (recipe.connections[selected] != undefined){
            setConnected(recipe.connections[selected])
        } else setConnected([])
    }, [selected])

    return(
        <Container fluid>
            <Row className='fs-5'>
                <Col xs={4} className=''>
                    <Row className='h-75'>
                        <ul className={`list-unstyled overflow-y-scroll ${connected[0] == undefined ? 'center-vertical' : 'align-top h-25'}`}>
                            <Col>
                            {recipe.ingredients.slice(0, connected[0]).map((item, index) => 
                                <li className='row' key={index}>
                                    <Col className='col-5 right text-nowrap overflow-hidden' >{checkFraction(item.quantity)}{item.unit}</Col>
                                    <Col className='col-7 left' >{item.name}</Col>
                                </li>
                            )}
                            </Col>
                        </ul>
                        {connected[0] != undefined ? 
                        <>
                            <ul className='list-unstyled center-vertical h-50'>
                                <Col>
                                {connected.map((idx) => 
                                    <li className='row fs-3 fw-bold' key={idx}>
                                        <Col className='col-5 right text-nowrap overflow-hidden' >{checkFraction(recipe.ingredients[idx].quantity)}{recipe.ingredients[idx].unit}</Col>
                                        <Col className='col-7 left' >{recipe.ingredients[idx].name}</Col>
                                    </li>
                                )}
                                </Col>
                            </ul>
                            <ul className='list-unstyled align-bottom h-25 overflow-y-scroll'>
                                {recipe.ingredients.slice(connected[0]).map((item, index) => 
                                    connected.includes(index + connected[0]) ? null : 
                                    <li className='row' key={index}>
                                        <Col className='col-5 right text-nowrap overflow-hidden' >{checkFraction(item.quantity)}{item.unit}</Col>
                                        <Col className='col-7 left' >{item.name}</Col>
                                    </li>
                                )}
                            </ul>
                        </>
                        : null }
                    </Row>
                </Col>
                <Col xs={8}>
                    <Row className='h-75'>
                        <ul className='list-unstyled align-top h-25 overflow-y-scroll'>
                            {recipe.directions.slice(0, selected).map((item, index) => 
                                <li key={index}>{item}</li>
                            )}
                        </ul>
                        <ul className='list-unstyled center-vertical h-50'>
                            <li className='fs-3 fw-bold py-5'>{recipe.directions[selected]}</li>
                        </ul>
                        <ul className='list-unstyled align-bottom h-25 overflow-y-scroll'>
                            {recipe.directions.slice(selected + 1).map((item, index) => 
                                <li key={index}>{item}</li>
                            )}
                        </ul>
                        <div className='p-5'></div>
                    </Row>
                    <Row>
                        <Col className='py-5 px-3 left'>
                            <Button variant="success" type="button" className='bg-color5 border-color5' disabled={selected <= 0} onClick={() => setSelected(selected-1)}>
                                Previous
                            </Button>
                        </Col>
                        <Col className='py-5 px-4 right'>
                            <Button variant="success" type="button" className='bg-color5 border-color5' disabled={selected >= recipe.directions.length - 1} onClick={() => setSelected(selected+1)}>
                                Next
                            </Button>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Container>
    )
}

export default StartCooking;
