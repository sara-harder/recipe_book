// react imports
import React from 'react';

// bootstrap imports
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function ListPage({data, navigate}) {
    return(
        <Container fluid>
            <Row className="g-3 py-4 row-cols-auto">
                {data.map((item, index) => 
                    <Col className="d-inline-block" key={index}> 
                        <Card onClick={() => navigate(item)}>
                            <Card.Body className='card-body rounded'>
                                    <Card.Title className="h4 text-center text-white">{item.name}</Card.Title>
                            </Card.Body>
                        </Card>
                    </Col>
                )}
            </Row>
        </Container>
    )
}

export default ListPage
