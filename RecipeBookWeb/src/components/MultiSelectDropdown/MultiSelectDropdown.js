// source for click outside element code: https://www.robinwieruch.de/react-hook-detect-click-outside-component/
// accessed 15 Sept 2024

// react imports
import React from 'react';
import { useState, useEffect } from 'react';

// bootstrap imports
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';
import Form from 'react-bootstrap/Form';

// style imports
import './MultiSelect.css';
import './MultiSelect.scss';
import { FaXmark as CloseIcon } from "react-icons/fa6";
import { FaAngleDown as DownArrow } from "react-icons/fa6";


const SelectedItems = ({selected, updateSelected}) => {
    const [highlightIdx, setHighlight] = useState("transparent")

    return(
        Array.from(selected).map((item, index) => {
            return(
                <Col key={index} xs={1} className='multi-select-selected-items'>
                    {item.name}
                    <div className='mx-1 px-1 h-100 center-vertical rounded'
                        style={highlightIdx == index ? {background: '#e5e5e5'} : {}}
                        onMouseEnter={() => setHighlight(index)} 
                        onMouseLeave={() => setHighlight(-1)}
                        onClick={(e) => {
                            e.stopPropagation()
                            updateSelected(item, false)
                            setHighlight(-1)
                        }}
                    >
                        <CloseIcon size="1em" color="#404040"/>
                    </div>
                </Col>
            )
        })
    )
}

const SearchInput = ({showDropdown, selected, search, setSearch}) => {
    const [inputWidth, setWidth] = useState('14ch')

    // determine the appropriate width of the search input
    useEffect(() => {
        // approximate length of input (len of char 0 * num of chars)
        const len = search.length + 'ch'

        // set to 14ch if placeholder showing over input
        if (selected.size == 0 && search.length == 0) setWidth('14ch')

        // grow length with content, min width = 9ch, max width = search bar length
        else if (search.length > 9) setWidth(len)
        else setWidth('9ch')

    }, [search, selected])

    return(
        <Col className='ps-2 pe-0'>
            <input 
                className='multi-select-search-input' 
                style={{width: inputWidth}}
                id='multi-select search'
                value={search} 
                placeholder={selected.size == 0 ? "Select Categories" : ""}
                onChange={(e) => {
                    setSearch(e.target.value)
                    showDropdown()
                }}
                onClick={() => showDropdown()}
            >
            </input>
        </Col>
    )
}

const SearchBar = ({showDropdown, selected, updateSelected, search, setSearch}) => {
    return(
        <Col className='px-0 multi-select-search-bar'>
            <div className='ps-3 py-1 w-100' onClick={() => showDropdown()}>
                <Row className='me-0'>
                    <SelectedItems 
                        selected={selected} 
                        updateSelected={updateSelected}/>
                    <SearchInput 
                        showDropdown={showDropdown} 
                        selected={selected}
                        search={search}
                        setSearch={setSearch}/>
                </Row>
            </div>
        </Col>
    )
}

const DropdownButton = ({showDropdown, hide_list, setHidden}) =>  {
    const [buttonColor, setColor] = useState("transparent")

    return (
        <Col className='multi-select-dropdown-button' 
                    style={{backgroundColor: buttonColor}}
                    onMouseEnter={() => setColor('#f2f2f2')} 
                    onMouseLeave={() => setColor('transparent')}
                    onClick={() => {
                        if (hide_list) showDropdown()
                        else setHidden(true)
                    }}
        >
            <DownArrow size=".9rem" color="#404040" style={hide_list ? {} : {transform:   'rotate(180deg)'}}/>
        </Col>
    )
}

const DropdownList = ({data, showDropdown, hide_list, selected, updateSelected}) => {
    const [highlightIdx, setHighlight] = useState(-1)

    // show msg if search results yield nothing
    if (data.length == 0) return(
        <div className="mutli-select-dropdown-list" hidden={hide_list} onClick={() => showDropdown()}>
            <div className='ps-1 py-1 text-muted'>
                No results found
            </div>
        </div>
    )

    // display all categories that match search results
    return(
        <ul className="mutli-select-dropdown-list" hidden={hide_list} onClick={() => showDropdown()}>
            {(data).map((item, index) =>
                <li key={index}>
                    <Row className='rounded' 
                        style={highlightIdx == index ? {background: '#e0e0e0'} : {}}
                        onMouseEnter={() => setHighlight(index)} 
                        onMouseLeave={() => setHighlight(-1)}
                    >
                        <Col xs={1} className='py-1 pe-0 w-auto center-vertical'>
                            <Form.Check
                                type='checkbox'
                                id={`${item.name} checkbox`}
                                onChange={(e) => updateSelected(item, e.target.checked)}
                                checked={selected.has(item)}
                            />
                        </Col>
                        <Col className='pe-0'>
                            <label className='py-1 w-100' htmlFor={`${item.name} checkbox`}>
                                {item.name}
                            </label>
                        </Col>
                    </Row>
                </li>
            )}
        </ul>
    )
}

// takes an array of data, a set of selected items, and a function to update the selected items
// to function properly, utilize react's useState() function to define [selected, setSelected]
function  MultiSelectDropdown ({data, selected, setSelected}) {
    // updates the list of selected items whenever an option is checked or unchecked
    const updateSelected = (item, checked) => {
        const copy = new Set(selected)

        if (checked) copy.add(item)
        else copy.delete(item)

        setSelected(copy)
        setSearch('')
    }


    // var determines if dropdown list should be hidden or not
    const [hide_list,  setHidden] = useState(true)
    const showDropdown = () => {
        // set focus to the input bar to enable typing
        document.getElementById('multi-select search').focus()
        setHidden(false)
    }

    // closes the dropdown when user clicks outside the dropdown
    const useClickOutsideDropdown = () => {
    // function source: https://www.robinwieruch.de/react-hook-detect-click-outside-component/
        const ref = React.useRef();

        React.useEffect(() => {
            const handleClick = (event) => {
                // executes if element with ref is not a parent of the element clicked
                if (ref.current && !ref.current.contains(event.target)) {
                    setHidden(true);
                }
            };
        
            document.addEventListener('click', handleClick);
            return () => {
                document.removeEventListener('click', handleClick);
            };
        }, [ref]);
      
        return ref;
    };
    const ref = useClickOutsideDropdown()

    const [search, setSearch] = useState("")
    const [dropdownData, setData] = useState(data)


    // update dropdown list whenever the user searches
    useEffect(() => {
        const search_results = []

        // iterate over each category
        for (const item of data){
            const name = item.name.toLowerCase()
            const srch = search.toLowerCase()

            // add category to results if any part of its name contains the search
            if (name.includes(srch)) search_results.push(item)
        }
        setData(search_results)
    }, [search, data])

    return(
        <div ref={ref} className='multi-select-dropdown' tabIndex={-1}>
            <Row className="mx-0 rounded bg-white">
                <SearchBar 
                    showDropdown={showDropdown} 
                    selected={selected} 
                    updateSelected={updateSelected}
                    search={search}
                    setSearch={setSearch}/>
                <DropdownButton 
                    showDropdown={showDropdown} 
                    hide_list={hide_list} 
                    setHidden={setHidden}/>
            </Row>

            <DropdownList 
                data={dropdownData} 
                showDropdown={showDropdown} 
                hide_list={hide_list} 
                selected={selected} 
                updateSelected={updateSelected}/>
        </div>
    )
}


export default MultiSelectDropdown