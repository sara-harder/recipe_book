// react imports
import React from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// bootstrap imports
import Container from 'react-bootstrap/esm/Container';
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Offcanvas from 'react-bootstrap/Offcanvas';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

// style imports
import '../styling/Header.css';
import { FaHeart as HeartFilled } from "react-icons/fa";
import { FaRegHeart as HeartOutline } from "react-icons/fa";

// function imports
import { setFavorites } from 'recipe-book/redux/userSlice';


const Hamburger = () => {
    return(
        <Navbar expand={"false"} className="bg-color2">
            <Container fluid className="bg-color2">
                <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-false`} />
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
                        </Nav>
                    </Offcanvas.Body>
                </Navbar.Offcanvas>
            </Container>
        </Navbar>
    )
}

const NavBar = ({}) => {
    return(
        <>
            <Col xs={4} className='header-container center-vertical pe-3'>
                <Form className="d-flex w-100 right">
                    <Form.Control
                        type="search"
                        placeholder="Search Recipes"
                        className="me-2 search-bar"
                        aria-label="Search"
                    />
                    <Button variant="outline-light" size="sm">Search</Button>
                </Form>
            </Col>
            <Col xs={1} className='header-container center-vertical right w-auto'>
                <Hamburger />
            </Col>
        </>
    )
}


const Heart = ({favorite, setFavorite}) => {
  // Toggle heart icon if favorite is selected or not
  if (favorite) {
    return(
      <HeartFilled size="2.5em" className="icon" onClick={()=>setFavorite(!favorite)}/>
    )
  }
  return(
    <HeartOutline size="2.5em" className="icon" onClick={()=>setFavorite(!favorite)}/>
  )
}


function Header({header, favorite, setFavorite, recipe}) {
    const dispatch = useDispatch()

    // Enable selecting / deselecting favorite recipes on View Recipe page
    const favorites = useSelector(state=> state.user.value.favorites);
    const updateFavorites = () => {
        // if the recipe is already in favorites
        if (favorites.includes(recipe._id)) {
            // if favorite is deselected, remove from favorites
            if (!favorite) {
            const i = favorites.indexOf(recipe._id)
            const new_favs = favorites.slice()
            new_favs.splice(i, 1)
            dispatch(setFavorites(new_favs))
            }
        }
        // if recipe is not in favorites
        else {
            // if favorite is selected, add to favorites
            if (favorite) dispatch(setFavorites(favorites.concat(recipe._id)))
        }
    }

    // Update the favorites whenever the heart is clicked on View Recipe page
    useEffect(() => {
        if (recipe) updateFavorites()
    }, [favorite])


    return(
        <header className="App-header container-fluid fixed-top bg-color2">
            {!header.includes("Recipes") ? 
                <Row>
                    <Col xs={1} className="header-container center-vertical right">
                        <Heart favorite={favorite} setFavorite={setFavorite} />
                    </Col>
                    <Col className='header-container center-vertical'>
                        <h1 className="fw-bold pt-2">{header}</h1>
                    </Col>
                    <NavBar />
                </Row>
            :
                <Row>
                    <Col className='header-container center-vertical'>
                        <h1 className="fw-bold pt-2 ps-6">{header}</h1>
                    </Col>
                    <NavBar />
                </Row>
            }
      </header>
    )
}

export default Header