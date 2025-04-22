// react imports
import React from 'react';
import { useState, useEffect } from 'react';
import { useLocation } from "react-router-dom";

// bootstrap imports
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';

// component imports
import ToggleSwitch from '../components/ToggleSwitch';

// function imports
import StartCooking from './StartCooking';

function StartCookingContainer() {
    const location = useLocation();
    const recipe = location.state.recipe
    const portions = location.state.portions

    const [completedDir, setCompleted] = useState([])
    const [addedIngr, setAdded] = useState([])

    const [sousChefMode, setSousChef] = useState(false);

    const toggleCrossed = (selected, array) => {
        let func;
        if (array == completedDir) {
            func = setCompleted
        } else {
            func = setAdded
        }
        if (array.includes(selected)) {
            func(array.filter(dir => dir !== selected));
        } else {
            func([...array, selected]);
        }
    }

    useEffect(() => {

    }, [sousChefMode])


    return(
        <Container fluid className='position-relative'>
            <ToggleSwitch text='Sous-chef mode' isChecked={sousChefMode} setIsChecked={setSousChef} />
            <Row>
                <Col className='px-1 py-0'>
                    <StartCooking recipe={recipe} portions={portions} completedDir={completedDir} addedIngr={addedIngr} toggleCrossed={toggleCrossed} id={1} sousChefMode={sousChefMode}/>
                </Col>
                {sousChefMode && (
                    <Col className='px-1 py-0 border-top border-end border-bottom light-border'>
                        <StartCooking recipe={recipe} portions={portions} completedDir={completedDir} addedIngr={addedIngr} toggleCrossed={toggleCrossed} id={2} sousChefMode={sousChefMode}/>
                    </Col>
                )}   
            </Row>     
        </Container>
    )
}

export default StartCookingContainer;