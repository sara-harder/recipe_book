// react imports
import React, { useState } from 'react';

// bootstrap imports
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';

// style imports
import '../styling/ToggleSwitch.css';

function ToggleSwitch({text, isChecked, setIsChecked}) {
    const handleChange = (e) => {
        const checked = e.target.checked;
        setIsChecked(checked);
    };

    const handleClick = () => {
        setIsChecked((prev) => {
            const newChecked = !prev;
            return newChecked;
        });
    };

    return (
        <Row className='position-relative z-2 center-content pb-3'>
            <Col></Col>
            <Col className='col-auto p-1 align-bottom h-100'>
                <label className="switch center-vertical">
                    <input 
                        type="checkbox" 
                        checked={isChecked} 
                        onChange={handleChange} 
                    />
                    <span className="slider round"></span>
                </label>
            </Col>
            <Col className='col-auto p-1 align-bottom h-100' onClick={handleClick}>
                <h6 className='bold m-0'>{text}</h6>
            </Col>
        </Row>
    );
}

export default ToggleSwitch;
