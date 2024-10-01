// react imports
import React from 'react';
import { useState, useEffect } from 'react';

// bootstrap imports
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

// style imports
import './Add.css';

// function imports
import { uploadPDF } from 'recipe-book/backend_connection/pdf_upload'

const UploadPDF = ({setName, Ingredient, setIngredients, setDirections}) => {
    const [autofill, setAutofill] = useState(false)
    const [file, setFile] = useState(null)

    const handleUploadPDF = async () => {
        const res = await uploadPDF(file)
        if (res != undefined){
            const recipe = res.recipe
            const formatted_ingredients = []
            for (const ingredient of recipe.ingredients) {
                const formatted = new Ingredient(ingredient.name, ingredient.quantity, ingredient.unit)
                formatted_ingredients.push(formatted)
            }
            setName(recipe.name)
            setIngredients(formatted_ingredients)
            setDirections(recipe.directions)
            setAutofill(false)
        }
    }

    useEffect(() => {
        if (autofill == false) {
            setFile(null)
        }
    }, [autofill])

    return(
        <Row className='left'>
            <Col xs={5} className='pb-4'>
            {autofill ? 
                <Form.Group controlId="uploadPDF">
                    <Form.Label>Autofill from PDF</Form.Label>
                    <Form.Control 
                        type="file" 
                        onChange={(e) => {
                            setFile(e.target.files[0])
                        }}
                    />
                    <Row className='py-3'>
                        <Col className='left'>
                            <Button variant="success" type="button" size='sm' className='bg-color5 border-color5' onClick={() => setAutofill(false)}>
                                Cancel
                            </Button>
                        </Col>
                        <Col className='right'>
                            <Button variant="success" type="button" size='sm' className='bg-color5 border-color5' disabled={file == null} onClick={handleUploadPDF}>
                                Upload
                            </Button>
                        </Col>
                    </Row>
                </Form.Group>
            : 
                <Row><Col className='ps-0'>
                    <Button variant="success" type="button" className='bg-color5 border-color5' onClick={() => setAutofill(true)}>
                        Autofill from PDF
                    </Button>
                </Col></Row>
            }
            </Col>
        </Row>
    )

}

export default UploadPDF