// react imports
import React from 'react';
import {useNavigate} from "react-router-dom"

// style imports
import '../styling/Home.css';

const Recipe = ({title, image, nav}) => {
    return(
        <>
            <div onClick={nav} className="recipe">
                <div className="thumbnail"></div>
                <div>{title}</div>
            </div>
        </>
    )
}

const HorizontalRecipe = ({title, nav}) => {
    const navigate = useNavigate()

    const data = [{
        img: "image_1",
        title: "Recipe 1",
        nav: ()=>navigate("view-recipe")
    },
    {
        img: "image_2",
        title: "Recipe 2",
        nav: ()=>navigate("view-recipe")
    },
    {
        img: "image_3",
        title: "Recipe 3",
        nav: ()=>navigate("view-recipe")
    },
    {
        img: "image_4",
        title: "Recipe 4",
        nav: ()=>navigate("view-recipe")
    },
    {
        img: "image_5",
        title: "Recipe 5",
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
                                    <Recipe title={item.title} image={item.img} nav={item.nav} key={index}/>
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