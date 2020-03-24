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

    //#region init

    constructor(props) {
        super(props)

        this.state = {
            json: JSON.parse(this.props.jsondata),
            resultJson: {},

            level: parseInt(this.props.level),
            indent: 50 * parseInt(this.props.level),
            objectFieldsOpen: {} // for each field in the current json scope, set true/false, if the field is collapsed or not.
        }

        this.inputTypesMap = {
            "string": "text",
            "number": "number",
            "time": "text",
            "enum": "text"
        }

        this.initCollapsableFields();

        this.initResultJson();

        this.initChildrenEntityEditors();

    }

    
    initChildrenEntityEditors() {
        this.children = {};
        
        
        for (var key in this.state.json) {
            if (typeof this.state.json[key] == 'object') {

                if (Array.isArray(this.state.json[key])) {
                    this.children[key] = []

                    for (var index in this.state.json[key]) {
                        var child = React.createRef();
                        this.children[key].push(child);           
                    }

                } else {
                    var child = React.createRef();
                    this.children[key] = child;
                }
                
            }
        }
    }

    initCollapsableFields() {
        for (var key in this.state.json) {
            if (typeof this.state.json[key] == 'object') {
                this.state.objectFieldsOpen[key] = false;
            }
        }
    }

    initResultJson() {
        for (var key in this.state.json) {
            this.state.resultJson[key] = '';
        }
    }

    //#endregion

    collapseEntityEditor(key) {
        this.state.objectFieldsOpen[key] = !this.state.objectFieldsOpen[key];
        this.setState(this.state)
    }

    handleInputChange(event) {
        let fieldName = event.target.name;
        let fleldVal = event.target.value;
        
        this.state.resultJson[fieldName] = fleldVal;
    }

    /*
        The method gets the total json of the entity editor (recursivly).
        It gets the data of the current json fields, 
        and if the field is object: 
            recursivly call the get json of this entity
        and if the field is array of objects:
            recursivly call the get json of this entity, and remove the '1.'/'2.' etc. key
    */
    getTotalJson() {
        for (var key in this.children) {

            if (Array.isArray(this.children[key])) {

                var jsonItems = [];
                for (var index in this.children[key]) {
                    var currChild = this.children[key][index];
                    var currJson = currChild.current.getTotalJson();

                    // The currJson is now looks like this : {"1.": {...} }
                    // We need to push the array only the inner json, without the key "1.0"                
                    var finalJson = Object.values(currJson)[0]

                    jsonItems.push(finalJson);
                }

                this.state.resultJson[key] = jsonItems;
                
            } else {
                var child = this.children[key];
                var fieldValue = child.current.getTotalJson();
                this.state.resultJson[key] = fieldValue;
            }
        }

        return this.state.resultJson;
    }

    //#region rendering json fields
    getSingleFieldJSX(key) {
        var keyName = key.split('|')[0];
        var keyType = key.split('|')[1];
        var insertNow = () => {
            '[NOW]'
        };
        return (
            <Row className="field" style={{ fontSize: 20, marginLeft: this.state.indent }}>
                <Col xs lg="1">
                    <Form.Label >{keyName}</Form.Label>
                </Col>
                <Col xs lg="2">
                    <Form.Control onChange={this.handleInputChange.bind(this)} name={key} size="sm" type={this.inputTypesMap[keyType]} width="20px" />
                </Col>
                {keyType=="time" &&
                    <Button size="sm" variant="outline-info" onClick={() => insertNow()}>
                        time
                    </Button>
                }
            </Row>
        );
    }

    getObjectFieldJSX(key) {
        return (
            <div style={{ fontSize: 20, marginLeft: this.state.indent }} >
                <div className='field'>
                    
                    <Button size="sm" color="primary" onClick={() => this.collapseEntityEditor(key)} style={{ marginBottom: '1rem' }}>
                        {this.state.objectFieldsOpen[key] ? '-' : '+'}
                    </Button>
                    <Form.Label>{key}</Form.Label>
                </div>

                <Collapse isOpen={this.state.objectFieldsOpen[key]}>
                    <EntityEditor ref={this.children[key]} level={this.state.level + 1} jsondata={JSON.stringify(this.state.json[key])}></EntityEditor>
                </Collapse>
            </div>
        )
    }

    getArrayFieldJSX(key) {
        const items = []

        // create the array field itself, with collapseEntityEditor button
        items.push(
            <div className='field' style={{ fontSize: 20, marginLeft: this.state.indent }} >
                <Button size="sm" color="primary" onClick={() => this.collapseEntityEditor(key)} style={{ marginBottom: '1rem' }}>
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
                    <EntityEditor ref={this.children[key][step]} level={this.state.level + 1} jsondata={currJson}></EntityEditor>
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
    //#endregion    
}

export default EntityEditor;
