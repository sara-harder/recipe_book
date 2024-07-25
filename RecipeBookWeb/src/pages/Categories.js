// react imports
import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate} from "react-router-dom";
import { useLocation } from 'react-router-dom';

// component imports
import ListItem from '../components/ListItem';

// function imports
import { helpers, category_funcs } from 'recipe-book';

function Categories({setHeader}) {
    const navigate = useNavigate();
    const location = useLocation();
    const flavor_type = location.state.flavor

    setHeader(flavor_type + " Recipes")

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    // Get the categories to display
    useEffect(() =>{
        const getCategories = async ()=> {
            const categories = await category_funcs.getFlavorType(flavor_type)
            setData(categories)

            setLoading(false)
        }
        getCategories()
    }, []);

    const rows = helpers.createFlexTable(5, data.length)

    // Show loading screen while waiting for data
    if (loading) {
        return  <h1 className='loading'> Loading... </h1>
    }

    return(
        <>
            <table className='recipe-table'>
                <tbody>
                    {rows.map((row, index) => 
                        <tr key={index}>
                        {(data.slice(row[0], row[1])).map((item, index) => 
                            <td><ListItem text={item.name} navigate={() => navigate("/recipes", {state:{category: item}})} key={index} /></td>
                        )}
                        </tr>
                    )}
                </tbody>
            </table>
        </>
    )
}

export default Categories;
