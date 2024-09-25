// react imports
import React from 'react';

// bootstrap imports
import Container from 'react-bootstrap/esm/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Offcanvas from 'react-bootstrap/Offcanvas';

const Hamburger = () => {
    return(
        <Navbar expand={"false"} className="bg-color2">
            <Container fluid className="bg-color2">
                <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-false`} className="navbar-dark"/>
                <Navbar.Offcanvas
                    id={`offcanvasNavbar-expand-false`}
                    aria-labelledby={`offcanvasNavbarLabel-expand-false`}
                    placement="end"
                >
                    <Offcanvas.Header closeButton>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                        <Nav className="justify-content-end flex-grow-1 px-3 fs-4">
                            <Nav.Link href="/">My Recipes</Nav.Link>
                            <Nav.Link href="/add-recipe">Add a Recipe</Nav.Link>
                        </Nav>
                    </Offcanvas.Body>
                </Navbar.Offcanvas>
            </Container>
        </Navbar>
    )
}

export default Hamburger
