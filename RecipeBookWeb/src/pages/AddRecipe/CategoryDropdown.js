// react imports
import React from 'react';
import { useState, useEffect } from 'react';
import { useLocation } from "react-router-dom"

// bootstrap imports
import Form from 'react-bootstrap/Form';

// component imports
import MultiSelectDropdown from '../../components/MultiSelectDropdown/MultiSelectDropdown';

// style imports
import './Add.css';

// function imports
import { category_funcs } from 'recipe-book';


const CategorySelector = ({selected, setSelected, validated}) => {
    const location = useLocation();

    // Get the categories for the dropdown
    const [savory, setSavory] = useState([])
    const [sweet, setSweet] = useState([])
    useEffect(() =>{
        const getCategories = async ()=> {
            const sav = await category_funcs.getFlavorType("Savory")
            setSavory(sav)
            const sw = await category_funcs.getFlavorType("Sweet")
            setSweet(sw)
        }
        getCategories()
    }, []);

    // add any preselected categories to the selected list
    const getPrefilled = () => {
        if (location.state){
            if (location.state.precategory){
                for (const item of savory.concat(sweet)){
                    if (item.name == location.state.precategory.name) {
                        setSelected(new Set([item]))
            }}}
            if (location.state.recipe) {
                const prefilled = []
                for (const cat of location.state.recipe.categories){
                    for (const item of savory.concat(sweet)){
                        if (item.name == cat.name) {
                            prefilled.push(item)
                        }}
                }
                setSelected(new Set(prefilled))
            }
        }
    }

    useEffect(() => {
        getPrefilled()
    }, [savory])

    return(
        <Form.Group className="mb-4 position-relative m-0" controlId="recipeCategory">
            <Form.Label>Category</Form.Label>
            <MultiSelectDropdown data_lists={[{label: "Savory", list: savory}, {label: "Sweet", list: sweet}]} selected={selected} setSelected={setSelected} validated={validated}/>
        </Form.Group>
            
    )
}

export default CategorySelector