import React from 'react';
import {useNavigate} from "react-router-dom"

const Recipe = ({title, image, nav}) => {
    return(
        <>
            <div onClick={nav}>
                <div>replace with {image}</div>
                <h4>{title}</h4>
            </div>
        </>
    )
}

const HorizontalRecipe = ({title, nav}) => {
    const navigate = useNavigate()

    const data = [{
        img: "image_1",
        title: "Recipe 1",
        nav: ()=>navigate("/")
    },
    {
        img: "image_2",
        title: "Recipe 2",
        nav: ()=>navigate("/")
    },
    {
        img: "image_3",
        title: "Recipe 3",
        nav: ()=>navigate("/")
    }]

    return (
        <>
            <div>
                <table>
                    <thead>
                        <tr>
                            <td>{title}</td>
                            <td onClick={nav}>See All</td>
                        </tr>
                    </thead>
                </table>
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

function HomePage() {
    const navigate = useNavigate()

    return(
        <>
            <h2>title</h2>
            <div>
                <HorizontalRecipe title="Favorites" nav={()=>navigate("/")} />
                <HorizontalRecipe title="Recents" nav={()=>navigate("/")} />
                <HorizontalRecipe title="Savory" nav={()=>navigate("categories")} />
                <HorizontalRecipe title="Sweet" nav={()=>navigate("categories")} />
            </div>
        </>
    )
}

export default HomePage