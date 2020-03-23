import React from 'react';
import styled from 'styled-components';
import { Nav, Button, Form, FormControl, Col, Row } from 'react-bootstrap';
import { JSONEditor } from 'react-json-editor-viewer';
import EntityEditor from './EntityEditor';

const Styles = styled.div`

.main-comp {
    padding-right: 50px;
}

.entity-editor-window {
    height: 400px;
    overflow-y: scroll;
    margin-top: 10px;
    padding: 10px;
    background: #f5f5f5;
    margin-top: 50px;   
}

.metadata {
    margin-top:20px;
}

.field {
    margin-bottom: 20px;
}


`;

class NGRequest extends React.Component {

    constructor(props) {
        super(props)
        this.child = React.createRef();

        
        
    }
    alertParent() {
        console.log(this.child.current.getTotalJson());
        console.log(JSON.stringify(this.child.current.getTotalJson()));
    }

    render() {
        return (
            <Styles>
                <div className='main-comp'>
                <EntityEditor ref={this.child} level='0' jsondata='{"Ids": {"name": "a"}, "Planing":[{"Goal":"learn piano","Way":"play piano","Time":"2020-07-13T00:00:00Z"}]}'></EntityEditor>

                    <Form>
                        <div dir='rtl' className='metadata'>
                            <Row className='field'>
                                <Col lg='1'>
                                    <Form.Label >שם תרחיש</Form.Label>
                                </Col>
                                <Col lg='3'>
                                    <Form.Control type="text" />
                                </Col>
                                <Col lg='6'>
                                    <Button variant="outline-info" onClick={() => this.alertParent()}> {'{ ... }'} </Button>
                                </Col>
                            </Row>

                            <Row className='field'>
                                <Col lg='1'>
                                    <Form.Label >תיאור תרחיש</Form.Label>
                                </Col>
                                <Col lg='5'>
                                    <Form.Control as="textarea" rows="3" />
                                </Col>
                            </Row>

                            <Row className='field'>
                                <Col lg='1' >
                                    <Form.Label >ישות</Form.Label>
                                </Col>
                                <Col lg='4'>
                                    <Form.Control as="select" value="Choose...">
                                        <option>abcd</option>
                                        <option>efgh</option>
                                    </Form.Control>
                                </Col>

                                <Col lg='1' >
                                    <Form.Label >מערכת</Form.Label>
                                </Col>
                                <Col lg='4'>
                                    <Form.Control as="select" value="Choose...">
                                        <option>טל בן יוסף</option>
                                        <option>ינון בן דוד</option>
                                    </Form.Control>
                                </Col>

                            </Row>

                            <Row className='field'>
                                <Col lg='1'>
                                    <Form.Label >תקן</Form.Label>
                                </Col>
                                <Col lg='3'>
                                    <Form.Control as="select" value="Choose...">
                                        <option>2</option>
                                        <option>2.1</option>
                                        <option>X</option>
                                    </Form.Control>
                                </Col>
                            </Row>
                        </div>


                        <Row dir='rtl'>
                            <Col className='entity-editor-window' lg='10'>
                                
                            </Col>
                        </Row>


                    </Form>

                </div>
            </Styles>
        )
    }
}

export default NGRequest;