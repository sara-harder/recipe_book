// react imports
import React from 'react';
import { useState, useEffect } from 'react';
import {useNavigate} from "react-router-dom";
import {useLocation} from 'react-router-dom';

// function imports
import { helpers } from 'recipe-book';

// component imports
import ListItem from '../components/ListItem';

// function imports
import { category_funcs } from 'recipe-book';

function Categories({setHeader}) {
    const navigate = useNavigate();
    const location = useLocation();
    const flavor_type = location.state.flavor

    setHeader(flavor_type + " Recipes")

    const [data, setData] = useState([]);

    // Get the categories to display
    useEffect(() =>{
        const getCategories = async ()=> {
            const categories = await category_funcs.getFlavorType(flavor_type)
            setData(categories)
        }
        getCategories()
    }, []);

    const rows = helpers.createFlexTable(5, data.length)

    return(
        <>
            <table className='recipe-table'>
                <tbody>
                    {rows.map((row, index) => 
                        <tr key={index}>
                        {(data.slice(row[0], row[1])).map((item, index) => 
                            <td><ListItem text={item.name} navigate={item.nav} key={index} /></td>
                        )}
                        </tr>
                    )}
                </tbody>
            </table>
        </>
    )
}

export default Categories;
