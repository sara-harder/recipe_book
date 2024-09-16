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
    return(
        Array.from(selected).map((item, index) => {
            return(
                <Col key={index} xs={1} className='multi-select-selected-items'>
                    {item.name}
                    <div className='px-2 center-vertical' onClick={(e) => {
                        e.stopPropagation()
                        updateSelected(item, false)}
                    }>
                        <CloseIcon size="1em" color="	#404040"/>
                    </div>
                </Col>
            )
        })
    )
}

const SearchInput = ({showDropdown, selected}) => {
    const [search, setSearch] = useState("")
    const [searchWidth, setWidth] = useState('14ch')

    useEffect(() => {
        const len = search.length + 'ch'
        if (selected.size == 0 && search.length == 0) setWidth('14ch')
        else if (search.length > 9) setWidth(len)
        else setWidth('9ch')
    }, [search, selected])

    return(
        <Col className='ps-2 pe-0'>
            <input 
                className='multi-select-search-input' 
                style={{width: searchWidth}}
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

const SearchBar = ({showDropdown, selected, updateSelected}) => {
    return(
        <Col className='px-0 multi-select-search-bar'>
            <div className='ps-3 py-1 w-100' onClick={() => showDropdown()}>
                <Row className='me-0'>
                    <SelectedItems 
                        selected={selected} 
                        updateSelected={updateSelected}/>
                    <SearchInput 
                        showDropdown={showDropdown} 
                        selected={selected}/>
                </Row>
            </div>
        </Col>
    )
}

const DropdownButton = ({showDropdown, hide_list, setHidden}) =>  {
    const [dropdownButton, setButton] = useState("transparent")

    return (
        <Col className='multi-select-dropdown-button' 
                    style={{backgroundColor: dropdownButton}}
                    onMouseEnter={() => setButton('#f2f2f2')} 
                    onMouseLeave={() => setButton('transparent')}
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

    return(
        <ul className="list-unstyled search-results" hidden={hide_list} onClick={() => showDropdown()}>
            {(data).map((item, index) =>
                <li key={index} className='indiv-result'>
                    <Row style={highlightIdx == index ? {background: '#e0e0e0'} : {}} className='rounded'
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

function  MultiSelectDropdown ({data}) {
    const [selected, setSelected] = useState(new Set())

    // updates the list of selected items whenever an option is checked or unchecked
    const updateSelected = (item, checked) => {
        const copy = new Set(selected)

        if (checked) copy.add(item)
        else copy.delete(item)

        setSelected(copy)
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
        // code source: https://www.robinwieruch.de/react-hook-detect-click-outside-component/
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

    return(
        <div ref={ref} className='multi-select-dropdown' tabIndex={-1}>
            <Row className="mx-0 rounded bg-white">
                <SearchBar 
                    showDropdown={showDropdown} 
                    selected={selected} 
                    updateSelected={updateSelected}/>
                <DropdownButton 
                    showDropdown={showDropdown} 
                    hide_list={hide_list} 
                    setHidden={setHidden}/>
            </Row>

            <DropdownList 
                data={data} 
                showDropdown={showDropdown} 
                hide_list={hide_list} 
                selected={selected} 
                updateSelected={updateSelected}/>
        </div>
    )
}


export default MultiSelectDropdown