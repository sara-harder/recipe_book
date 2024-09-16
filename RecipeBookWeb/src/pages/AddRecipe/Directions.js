// react imports
import React from 'react';

// bootstrap imports
import Col from 'react-bootstrap/esm/Col';
import Form from 'react-bootstrap/Form';


const DirectionsList = ({directions, setDirections}) => {
    // when user starts typing, add a new empty input line
    if (directions[directions.length-1] != "") {
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
    return(
        <Form.Group className="mb-4" controlId="recipeDirections">
            <Form.Label className='mb-1'>Directions</Form.Label>
            <ol className='list-unstyled'>
                {directions.map((item, index) => 
                    <li className='row py-1' key={index}>
                        <Col className='col-1 w-auto center-vertical pe-1'>
                            {index + 1}.
                        </Col>
                        <Col className='ps-1 pe-2 me-1' >
                            <Form.Control 
                                type="name" 
                                placeholder="Write directions"
                                value={item}
                                onChange={(e) => addDirection(e.target.value, index)}
                            />
                        </Col>
                    </li>
                )}
            </ol>
        </Form.Group>
    )
}


export default DirectionsList
