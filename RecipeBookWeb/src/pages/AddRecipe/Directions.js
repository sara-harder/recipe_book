// react imports
import React from 'react';
import { useState } from 'react';

// bootstrap imports
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';
import Form from 'react-bootstrap/Form';

// style imports
import { FaRegTrashAlt as TrashIcon } from "react-icons/fa";


const DirectionsList = ({directions, setDirections}) => {
    // index of last direction
    const end_idx = directions.length-1

    // when user starts typing, add a new empty input line
    if (directions[end_idx] != "") {
        const copy = directions.slice()
        copy.push("")
        setDirections(copy)
    }

    // update the direction while user is typing. find direction to update using index
    const addDirection = (direction, index) => {
        const copy = directions.slice()
        copy[index] = direction
        setDirections(copy)
    }

    // remove the appropriate direction when trash icon is clicked
    const removeDirection = (index) => {
        const copy = directions.slice(0, index)
        setDirections(copy.concat(directions.slice(index + 1)))
        setTrash(-1)
    }

    // change the trash-can color on hover
    const [trashIdx, setTrash] = useState(-1)

    const visible = directions.length <= 1
    const [rowOpacity, setOpacity] = useState(-1)

    return(
        <Form.Group className="mb-4" controlId="recipeDirections">
            <Form.Label className='mb-1'>Directions</Form.Label>
            <ol className='list-unstyled'>
                {directions.map((item, index) => 
                    <li className='row py-1 flex-nowrap' key={index} 
                    style={index != end_idx || visible || rowOpacity == index ? {} : {opacity: .5}}>
                        <Col xs={11} className='pe-0'><Row className='pe-0'>
                            <Col className='col-1 w-auto center-vertical pe-1'>
                                {index + 1}.
                            </Col>
                            <Col className='ps-1 pe-2 me-1' >
                                <Form.Control 
                                    type="name" 
                                    placeholder="Write directions"
                                    value={item}
                                    onChange={(e) => addDirection(e.target.value, index)}
                                    onFocus={() => setOpacity(index)}
                                    onBlur = {() => setOpacity(-1)}
                                    required={directions.length <= 1}
                                />
                                <Form.Control.Feedback type="invalid" className='ps-2'>
                                    Please add some directions
                                </Form.Control.Feedback>
                            </Col>
                        </Row></Col>
                        <Col className='col-1 w-auto center-vertical'>
                            {index == end_idx ? 
                                <TrashIcon size='1.15em' color='transparent' /> 
                            : 
                                <TrashIcon 
                                    size="1.15em" 
                                    color={trashIdx == index ? 'red' : '#404040'}
                                    onMouseEnter={() => setTrash(index)} 
                                    onMouseLeave={() => setTrash(-1)}
                                    onClick={() => removeDirection(index)}
                                />
                            }
                        </Col>
                    </li>
                )}
            </ol>
        </Form.Group>
    )
}


export default DirectionsList
