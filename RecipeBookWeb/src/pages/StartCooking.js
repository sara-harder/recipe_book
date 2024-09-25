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
    const [lastSelected, setLastSelected] = useState(-1)
    const [lastConnected, setLastConnected] = useState([])

    const onNext = () => {
        setLastSelected(selected)
        setSelected(selected + 1)
    }

    const onPrevious = () => {
        setLastSelected(selected)
        setSelected(selected - 1)
    }

    useEffect(() => {
        // if moved backwards while ingredients connected, pop last connected ingredient index
        const copy = lastConnected.slice()
        if (connected.length != 0) {
            if(lastSelected > selected) {
                copy.pop()
            }
        }

        // retrieve new connections for newly selected direction
        const connections = recipe.connections[selected]
        if (connections != undefined){
            setConnected(connections)

            // if moved forward and new direction has connections, push last connected ingredient index
            if (lastSelected < selected) {
                copy.push(connections[connections.length - 1])
            }
        } else setConnected([])

        // update stack of last connected ingredient indexes
        setLastConnected(copy)
    }, [selected])

    return(
        <Container fluid>
            <Row className='fs-55 cooking-page'>
                <Col xs={4} className='h-100'>
                    <Row className='cooking-display overflow-hidden'>
                        <ul className='list-unstyled align-bottom m-0 cooking-begin'>
                            <Col>
                            {recipe.ingredients.slice(0, connected[0] != undefined ? connected[0] : lastConnected[lastConnected.length - 1] + 1).map((item, index) => 
                                <li className='row' key={index}>
                                    <Col className='col-5 right text-nowrap overflow-hidden' >{checkFraction(item.quantity)}{item.unit}</Col>
                                    <Col className='col-7 left' >{item.name}</Col>
                                </li>
                            )}
                            </Col>
                        </ul>
                        <ul className='list-unstyled center-vertical m-0 cooking-focused'>
                            <Col>
                            {connected.map((idx) => 
                                <li className='row fs-3 fw-bold' key={idx}>
                                    <Col className='col-5 right text-nowrap' >{checkFraction(recipe.ingredients[idx].quantity)}{recipe.ingredients[idx].unit}</Col>
                                    <Col className='col-7 left' >{recipe.ingredients[idx].name}</Col>
                                </li>
                            )}
                            </Col>
                        </ul>
                        <ul className='list-unstyled overflow-hidden cooking-end'>
                            {recipe.ingredients.slice(lastConnected[lastConnected.length - 1] + 1).map((item, index) => 
                                <li className='row' key={index}>
                                    <Col className='col-5 right text-nowrap' >{checkFraction(item.quantity)}{item.unit}</Col>
                                    <Col className='col-7 left' >{item.name}</Col>
                                </li>
                            )}
                        </ul>
                    </Row>
                </Col>
                <Col xs={8} className='h-100'>
                    <Row className='cooking-display overflow-hidden'>
                        <ul className='list-unstyled align-bottom m-0 cooking-begin'>
                            <Col>
                            {recipe.directions.slice(0, selected).map((item, index) => 
                                <li key={index}>{item}</li>
                            )}
                            </Col>
                        </ul>
                        <ul className='list-unstyled center-vertical m-0 cooking-focused'>
                            <li className='fs-3 fw-bold py-5'>{recipe.directions[selected]}</li>
                        </ul>
                        <ul className='list-unstyled cooking-end'>
                            {recipe.directions.slice(selected + 1).map((item, index) => 
                                <li key={index}>{item}</li>
                            )}
                        </ul>
                    </Row>
                    <Row className='position-relative z-2 center-content cooking-buttons'>
                        <Col className='px-3 left'>
                            <Button variant="success" type="button" className='bg-color5 border-color5' disabled={selected <= 0} onClick={onPrevious}>
                                Previous
                            </Button>
                        </Col>
                        <Col className='px-4 right'>
                            <Button variant="success" type="button" className='bg-color5 border-color5' disabled={selected >= recipe.directions.length - 1} onClick={onNext}>
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
