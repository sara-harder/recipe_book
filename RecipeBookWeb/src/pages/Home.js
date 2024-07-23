// react imports
import React from 'react';
import {useNavigate} from "react-router-dom"

// style imports
import '../styling/Home.css';

const Recipe = ({name, image, nav}) => {
    return(
        <>
            <div onClick={nav} className="recipe">
                <div className="thumbnail"></div>
                <div>{name}</div>
            </div>
        </>
    )
}

const HorizontalRecipe = ({title, nav}) => {
    const navigate = useNavigate()

    const data = [{
        image: "image_1",
        name: "Recipe 1",
        nav: ()=>navigate("view-recipe")
    },
    {
        image: "image_2",
        name: "Recipe 2",
        nav: ()=>navigate("view-recipe")
    },
    {
        image: "image_3",
        name: "Recipe 3",
        nav: ()=>navigate("view-recipe")
    },
    {
        image: "image_4",
        name: "Recipe 4",
        nav: ()=>navigate("view-recipe")
    },
    {
        image: "image_5",
        name: "Recipe 5",
        nav: ()=>navigate("view-recipe")
    },
    ]

    return (
        <>
            <div>
                <div className="row wide">
                    <div className='home_rows'><h2 className="left">{title}</h2></div>
                    <div onClick={nav} className="right home_rows">See All</div>
                </div>
                <table>
                    <tbody>
                        <tr>
                            {data.map((item, index) => 
                                <td>
                                    <Recipe name={item.name} image={item.image} nav={()=>navigate("view-recipe", {state:{recipe: item}})} key={index}/>
                                </td>
                            )}
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    )
}

function HomePage({setHeader}) {
    setHeader("My Recipes")
    const navigate = useNavigate()

    return(
        <>
            <div>
                <HorizontalRecipe title="Favorites" nav={()=>navigate("recipes")} />
                <HorizontalRecipe title="Recents" nav={()=>navigate("recipes")} />
                <HorizontalRecipe title="Savory" nav={()=>navigate("categories")} />
                <HorizontalRecipe title="Sweet" nav={()=>navigate("categories")} />
            </div>
        </>
    )
}

export default HomePage