// react imports
import React from 'react';

// bootstrap imports
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

// style imports
import { FaPlus as PlusSign } from "react-icons/fa6";

function ListPage({data, navigate}) {
    return(
        <Container fluid>
            <Row className="g-3 py-4 row-cols-auto">
                {data.map((item, index) => 
                    <Col className="d-inline-block" key={index}> 
                        <Card onClick={() => navigate(item)}>
                            {item.image ? 
                                <>
                                <Card.Img variant="top" src={item.image} className='recipe_thumb'/>
                                <Card.Body className='card-body rounded-bottom'>
                                        <Card.Title className="h5 text-center text-white">{item.name}</Card.Title>
                                </Card.Body> 
                                </>
                            : 
                                <Card.Body className='card-body rounded'>
                                        {item.name == "New" ? 
                                            <Card.Title className="fs-4 pt-2 text-center text-white">
                                                <PlusSign size="1.5em"/>
                                            </Card.Title>
                                        : 
                                            <Card.Title className="fs-4 pt-2 text-center text-white">{item.name}</Card.Title>
                                        }
                                </Card.Body>
                            }
                        </Card>
                    </Col>
                )}
            </Row>
        </Container>
    )
}

export default ListPage
