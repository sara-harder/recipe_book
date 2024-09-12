// react imports
import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from 'react-redux';

// bootstrap imports
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

// function imports
import { helpers, recipe_funcs } from 'recipe-book';
import { setRecents } from 'recipe-book/redux/userSlice';

// constants
const favorites = "Favorites"
const recents = "Recents"
const savory = "Savory"
const sweet = "Sweet"


const Recipe = ({name, image, nav}) => {
    // recipe card with image
    if (image) {
        return(
            <Card onClick={nav}>
                <Card.Img variant="top" src={image} />
                <Card.Body className='card-body rounded-bottom'>
                        <Card.Title className="h5 text-center text-white">{name}</Card.Title>
                </Card.Body>
            </Card>
        )
    }
    // recipe card without image
    return(
        <Card onClick={nav}>
            <Card.Body className='card-body rounded'>
                    <Card.Title className="fs-4 text-center text-white">{name}</Card.Title>
            </Card.Body>
        </Card>
    )
}

const TitleRow = ({title, nav}) => {
    // title and see all button
    return(
        <Row className="justify-content-between" xl={12}>
            <Col><h2 className="fw-bold">{title}</h2></Col>
            <Col>
                <h5 className="text-end py-3" onClick={nav}>See All</h5>
            </Col>
        </Row>
    )
}

const HorizontalRecipe = ({title, nav}) => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [recipe_data, setData] = useState([])
    const [loading, setLoading] = useState(true);

    const user = useSelector(state=> state.user.value);

    // Get the recipes to display in this row for favorites/recents
    useEffect(() =>{
        const getUserRecipes = async ()=> {
            let ids;
            if (title == favorites) ids = user.favorites.slice(0, 6)
            else ids = user.recents.slice(0, 6)

            const data = []
            for (const id of ids) {
                const recipe = await recipe_funcs.getRecipe(id)
                data.push(recipe)
            }
            setData(data)

            setLoading(false);
        }
        if (title == favorites || title == recents) getUserRecipes()
    }, [user]);

    // Get the recipes to display in this row for sweet/savory
    useEffect(() => {
        const getCatRecipes = async ()=> {
            const recipes = await helpers.getRandomRecipes(title)
            setData(recipes)

            setLoading(false)
        }
        if (title == savory || title == sweet) getCatRecipes();
    }, [])

    // Navigate to the view recipe page when a recipe is selected
    const selectRecipe = (recipe) => {
        let recents = [recipe._id].concat(user.recents)
        if (user.recents.includes(recipe._id)) {
            const set_recents = new Set(recents)
            recents = Array.from(set_recents)
        }
        dispatch(setRecents(recents))

        navigate("view-recipe", {state:{recipe: recipe}})
    }

    // Loading row
    if (loading) {
        return(
            <Container fluid className="py-4">
                <TitleRow title={title} nav={nav} />

                <Row className="no-cards d-flex align-items-center">
                    <Col> 
                        <h3 className="ms-5"> Loading... </h3>
                    </Col>
                </Row>
            </Container>
        )
    }

    // Row of recipes
    return (
            <Container fluid className="py-4">
                <TitleRow title={title} nav={nav} />

                <Row className="g-3 row-cols-auto overflow-x-scroll flex-nowrap">
                    {recipe_data.map((item, index) => 
                        <Col className="d-inline-block" key={index}> 
                            <Recipe name={item.name} image={item.image} nav={() => selectRecipe(item)} />
                        </Col>
                    )}
                </Row>
            </Container>
    )
}

function HomePage({setHeader}) {
    setHeader("My Recipes")
    const navigate = useNavigate()

    return(
        <Container fluid className='pb-5'>
            <HorizontalRecipe title={favorites} nav={()=>navigate("recipes", {state:{category: "Favorite"}})} />
            <HorizontalRecipe title={recents} nav={()=>navigate("recipes", {state:{category: "Recent"}})} />
            <HorizontalRecipe title={savory} nav={()=>navigate("categories", {state:{flavor: savory}})} />
            <HorizontalRecipe title={sweet} nav={()=>navigate("categories", {state:{flavor: sweet}})} />
        </Container>
    )
}

export default HomePage