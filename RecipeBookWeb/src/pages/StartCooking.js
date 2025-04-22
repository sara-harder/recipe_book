// react imports
import React from 'react';
import { useState, useEffect } from 'react';

// bootstrap imports
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';
import Button from 'react-bootstrap/esm/Button';

// function imports
import { checkFraction } from 'recipe-book/helpers';

function StartCooking({recipe, portions, completedDir, addedIngr, toggleCrossed, id, sousChefMode=true}) {
    const [selected, setSelected] = useState(0)
    const [connected, setConnected] = useState([])
    const [lastSelected, setLastSelected] = useState(-1)
    const [lastConnected, setLastConnected] = useState([])

    // move to next instruction
    const onNext = () => {
        if (selected + 1 < recipe.directions.length){
            setLastSelected(selected)
            setSelected(selected + 1)

            // set the scrollbar to position matching the selected instruction
            const scroll_height = invisible_display.scrollHeight / (recipe.directions.length + 4)
            invisible_display.scrollTop = oldScroll + scroll_height
            setOld(oldScroll + scroll_height)
        }
    }

    // move back to previous instruction
    const onPrevious = () => {
        if(selected > 0) {
            setLastSelected(selected)
            setSelected(selected - 1)

            // set the scrollbar to position matching the selected instruction
            const scroll_height = invisible_display.scrollHeight / (recipe.directions.length + 4)
            invisible_display.scrollTop = oldScroll - scroll_height
            setOld(oldScroll - scroll_height)
        }
    }

    const doScroll = (e) => {
        if (invisible_display) {
            // Adjust the scroll position based on the wheel delta
            const scrollAmount = e.deltaY; // Positive for down, negative for up
            invisible_display.scrollTop += scrollAmount;

            // Trigger the checkScroll function
            checkScroll();
        }
    }

    // get scroll component
    const invisible_display = document.getElementById(`invisible-scroll-${id}`)
    const [oldScroll, setOld] = useState(10)

    const checkScroll = () => {
        const scroll_height = invisible_display.scrollHeight / (recipe.directions.length + 4)
        if (invisible_display.scrollTop >= oldScroll + scroll_height) {
            onNext()
        }
        if (invisible_display.scrollTop <= oldScroll - scroll_height) {
            onPrevious()
        }
    }

    // move between instructions when arrow keys are pressed
    onkeydown = (event) => {
        if (sousChefMode) return
        if (event.code == 'ArrowRight' || event.code == 'ArrowDown') onNext()
        if (event.code == 'ArrowLeft' || event.code == 'ArrowUp') onPrevious()
    }

    // set the connected ingredients when user moves between instructions
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
        <Container fluid className='position-relative'>
            <Row className='fs-55 cooking-page px-3'>
                <Col xs={4} className='h-100'>
                    <Row className='cooking-display overflow-hidden'>
                        <div 
                            className='scrollable-container h-100 overflow-y-hidden' 
                            onWheel={doScroll}
                        >
                            <ul className='list-unstyled align-bottom m-0 cooking-begin'>
                                <Col>
                                {recipe.ingredients.slice(0, connected[0] != undefined ? connected[0] : lastConnected[lastConnected.length - 1] + 1).map((item, index) => 
                                    <li className={`row ${sousChefMode ? 'fs-6': 'fs-5'} ${addedIngr.includes(index) ? 'text-decoration-line-through' : ''}`} key={index}>
                                        <Col className='col-5 right text-nowrap overflow-hidden' >{checkFraction(item.quantity / recipe.portions * portions)}{item.unit}</Col>
                                        <Col className='col-7 left' >{item.name}</Col>
                                    </li>
                                )}
                                </Col>
                            </ul>
                            <ul className='list-unstyled center-vertical m-0 cooking-focused z-2'>
                                <Col>
                                {connected.map((idx) => 
                                    <li className={`row ${sousChefMode ? 'fs-5': 'fs-3'} fw-bold ${addedIngr.includes(idx) ? 'text-decoration-line-through' : ''}`} key={idx} onClick={() => toggleCrossed(idx, addedIngr)}>
                                        <Col className='col-5 right text-nowrap' >{checkFraction(recipe.ingredients[idx].quantity / recipe.portions * portions)}{recipe.ingredients[idx].unit}</Col>
                                        <Col className='col-7 left'>{recipe.ingredients[idx].name}</Col>
                                    </li>
                                )}
                                </Col>
                            </ul>
                            <ul className='list-unstyled overflow-hidden cooking-end'>
                                {recipe.ingredients.slice(lastConnected[lastConnected.length - 1] + 1).map((item, index) => 
                                    <li className={`row ${sousChefMode ? 'fs-6': 'fs-5'} ${addedIngr.includes(index + (lastConnected.length > 0 ? lastConnected[lastConnected.length - 1] : -1) + 1) ? 'text-decoration-line-through' : ''}`} key={index}>
                                        <Col className='col-5 right text-nowrap' >{checkFraction(item.quantity / recipe.portions * portions)}{item.unit}</Col>
                                        <Col className='col-7 left' >{item.name}</Col>
                                    </li>
                                )}
                            </ul>
                        </div>
                    </Row>
                </Col>
                <Col xs={8} className='h-100'>
                    <Row className='cooking-display overflow-hidden'>
                        <div 
                            className='scrollable-container h-100 overflow-y-hidden' 
                            onWheel={doScroll}
                        >
                            <ul className='list-unstyled align-bottom m-0 cooking-begin'>
                                <Col>
                                {recipe.directions.slice(0, selected).map((item, index) => 
                                    <li key={index} className={`${sousChefMode ? 'fs-6': 'fs-5'} ${completedDir.includes(index) ? 'text-decoration-line-through' : ''}`}>{item}</li>
                                )}
                                </Col>
                            </ul>
                            <ul className='list-unstyled center-vertical m-0 cooking-focused'>
                                <li 
                                    className={`${sousChefMode ? 'fs-5': 'fs-3'} fw-bold py-5 ${completedDir.includes(selected) ? 'text-decoration-line-through' : ''}`}
                                    onClick={() => toggleCrossed(selected, completedDir)}
                                >
                                    {recipe.directions[selected]}
                                </li>
                            </ul>
                            <ul className='list-unstyled cooking-end'>
                                {recipe.directions.slice(selected + 1).map((item, index) => 
                                    <li key={index} className={`${sousChefMode ? 'fs-6': 'fs-5'} ${completedDir.includes(index + selected + 1) ? 'text-decoration-line-through' : ''}`}>{item}</li>
                                )}
                            </ul>
                        </div>
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
            <Row className='w-100 h-100 cooking-page invisible-scroll-container'>
                <Col></Col>
                <Col id={`invisible-scroll-${id}`} className='overflow-y-scroll overflow-x-hidden col-auto p-0' onScroll={checkScroll} >
                    <ul className='list-unstyled h-100 invisible w-0'>
                        {recipe.directions.map((item, index) => 
                            <li key={index} className='h-25'>{item}</li>
                        )}
                        <li className='h-100'></li>
                    </ul>
                </Col>
            </Row>
        </Container>
    )
}

export default StartCooking;
