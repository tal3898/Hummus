import React from 'react';
import styled from 'styled-components';
import { Form, Col, Row } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import { Collapse, Button, CardBody, Card } from 'reactstrap';

const Styles = styled.div`
    .field {
        padding: 5px;
        height: 40px; 
        &:hover { background: #bbdefb; }
    }
`;

class EntityEditor extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            json: JSON.parse(this.props.jsondata),
            level: parseInt(this.props.level),
            indent: 50 * parseInt(this.props.level),
            objectFieldsOpen: {} // for each field in the current json scope, set true/false, if the field is collapsed or not.
        }

        this.initCollapsableFields();

    }

    initCollapsableFields() {
        for (var key in this.state.json) {
            if (typeof this.state.json[key] == 'object') {
                this.state.objectFieldsOpen[key] = false;
            }
        }
    }

    toggle(key) {
        this.state.objectFieldsOpen[key] = !this.state.objectFieldsOpen[key];
        this.setState(this.state)
    }

    getSingleFieldJSX(key) {
        return (
            <Row className="field" style={{ fontSize: 20, marginLeft: this.state.indent }}>
                <Col xs lg="1">
                    <Form.Label >{key}</Form.Label>
                </Col>
                <Col xs lg="2">
                    <Form.Control size="sm" type="text" width="20px" />
                </Col>
            </Row>
        );
    }

    getObjectFieldJSX(key) {
        return (
            <div style={{ fontSize: 20, marginLeft: this.state.indent }} >
                <div className='field'>
                    
                    <Button size="sm" color="primary" onClick={() => this.toggle(key)} style={{ marginBottom: '1rem' }}>
                        {this.state.objectFieldsOpen[key] ? '-' : '+'}
                    </Button>
                    <Form.Label>{key}</Form.Label>
                </div>

                <Collapse isOpen={this.state.objectFieldsOpen[key]}>
                    <EntityEditor level={this.state.level + 1} jsondata={JSON.stringify(this.state.json[key])}></EntityEditor>
                </Collapse>
            </div>
        )
    }

    alertChild() {
        alert('bbbb')
    }

    getArrayFieldJSX(key) {
        const items = []

        // create the array field itself, with toggle button
        items.push(
            <div className='field' style={{ fontSize: 20, marginLeft: this.state.indent }} >
                <Button size="sm" color="primary" onClick={() => this.toggle(key)} style={{ marginBottom: '1rem' }}>
                    {this.state.objectFieldsOpen[key] ? '-' : '+'}
                </Button>
                <Form.Label>{key}</Form.Label>
            </div>
        )

        // For each element in the array -> create a new json which looks like this { "1.": {...}}, and create element with
        // this json
        for (let step = 0; step < this.state.json[key].length; step++) {
            const currJson = '{"' + step + '.":' + JSON.stringify(this.state.json[key][step]) + "}"
            items.push(
                <Collapse isOpen={this.state.objectFieldsOpen[key]}>
                    <EntityEditor level={this.state.level + 1} jsondata={currJson}></EntityEditor>
                </Collapse>
            )
        }

        return items
    }

    render() {
        let items = []

        for (let key in this.state.json) {
            // If regular field
            if (typeof this.state.json[key] != 'object') {
                items.push(
                    this.getSingleFieldJSX(key)
                )
                // If Object field
            } else if (!Array.isArray(this.state.json[key])) {
                items.push(
                    this.getObjectFieldJSX(key)
                )
                // If Array field
            } else {
                items = items.concat(this.getArrayFieldJSX(key))
            }
        }


        return (
            <Styles dir='ltr'>
                {items}
            </Styles>
        );
    }
}

export default EntityEditor;
