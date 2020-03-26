import React from 'react';
import styled from 'styled-components';
import { Form, Col, Row } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import { Collapse, Button, CardBody, Card } from 'reactstrap';

const Styles = styled.div`
    .field {
        height: 40px; 
        margin-top : 5px;
        &:hover { background: #bbdefb; }
    }

    .color-hover {
        &:hover { background: #bbdefb; }
    }

    .field-action {
        padding: 5px;
        display: none;
    }

    .field:hover .field-action {
        display: block;
    }

    .fa-trash-alt:hover {
        color: #d32f2f;
    }
    
    .fa-dice:hover {
        color: #388e3c;
    }

    .fa-clock:hover {
        color: #2196f3;
    }
`;

class EntityEditor extends React.Component {

    //#region init

    constructor(props) {
        super(props)

        this.inputTypesMap = {
            "string": "text",
            "number": "number",
            "time": "text",
            "enum": "text"
        }

        this.init(props);

    }

    init(props) {
        this.state = {
            json: JSON.parse(props.jsondata),

            level: parseInt(props.level),
            indent: 20 * parseInt(props.level),
            objectFieldsOpen: {} // for each field in the current json scope, set true/false, if the field is collapsed or not.
        }

        this.initCollapsableFields();

        this.initChildrenEntityEditors();

        this.fieldsInput = {};
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        this.init(newProps)
        this.setState(this.state);
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

    //#endregion

    collapseEntityEditor(key) {
        this.state.objectFieldsOpen[key] = !this.state.objectFieldsOpen[key];
        this.setState(this.state)
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
        var resultJson = {}

        // loop on objects or arrays children
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

                resultJson[key] = jsonItems;

            } else {
                var child = this.children[key];
                var fieldValue = child.current.getTotalJson();
                resultJson[key] = fieldValue;
            }
        }

        // loop on regular fields
        for (var key in this.fieldsInput) {
            if (this.fieldsInput[key] != null) { // This is a PLASTER
                var fieldName = key.split('|')[0];
                var fieldValue = this.getFieldFinalValue(key);
                resultJson[fieldName] = fieldValue;
            }
        }

        return resultJson;
    }

    getFieldFinalValue(key) {
        var fieldValue = this.fieldsInput[key].value;
        var finalValue = fieldValue;
        var fieldType = key.split('|')[1];

        if (fieldValue == '[NOW]') {
            finalValue = new Date().toISOString();;
        } else if (fieldValue == '[GEN]') {
            var randomString = "";
            for (let step = 0; step < 5; step++) {
                var randomLetter = "abcdefghijklmnopqrstuvwxyz"[Math.floor(Math.random() * 1000) % 26];
                randomString += randomLetter
            }

            finalValue = randomString
        } else if (fieldType == "number" || fieldType == "enum") {
            finalValue = parseInt(fieldValue);
        }

        return finalValue;
    }

    insertTimeNowToField(key) {
        this.fieldsInput[key].value = '[NOW]'
    }

    insertGenerateWordToField(key) {
        this.fieldsInput[key].value = '[GEN]'
    }

    removeField(key) {
        if (this.state.json.hasOwnProperty(key)) {
            delete this.state.json[key];
            delete this.children[key];
            this.setState(this.state);
        } else {
            console.log("does not have")
        }
    }

    //#region rendering json fields
    getSingleFieldJSX(key) {
        var keyName = key.split('|')[0];
        var keyType = key.split('|')[1];
        var defaultValue = this.state.json[key]


        var enumValuesItem = []
        if (keyType == "enum") {
            var optionalValues = JSON.parse(key.split('|')[2]);
            for (var index in optionalValues) {
                enumValuesItem.push(
                    <option>{optionalValues[index]}</option>
                );
            }

        }

        console.log("adding to this.fieldsInput the key " + key);

        return (

            <Row className="field mb-1" style={{ fontSize: 20, marginLeft: this.state.indent }}>
                <Col xs lg="1">
                    <Form.Label >{keyName}</Form.Label>
                </Col>
                <Col className="mt-1" xs lg="2">

                    {/* If current field is enum, create select input */}
                    {enumValuesItem.length > 0 &&
                        <Form.Control
                            as="select"
                            ref={(ref) => this.fieldsInput[key] = ref} name={key}
                            size="sm"
                            type={this.inputTypesMap[keyType]}
                            width="20px">

                            {enumValuesItem}
                        </Form.Control>
                    }

                    {/* Else, If current field is int/string, create regular input */}
                    {enumValuesItem.length == 0 &&
                        <Form.Control
                            ref={(ref) => this.fieldsInput[key] = ref}
                            name={key}
                            defaultValue={defaultValue}
                            size="sm"
                            type={this.inputTypesMap[keyType]}
                            width="20px" />

                    }

                </Col>
                {keyType == "time" &&
                    <i class="far fa-clock field-action mt-1" onClick={() => this.insertTimeNowToField(key)} ></i>
                }

                {keyType == "string" &&
                    <i class="fas fa-dice field-action mt-1" onClick={() => this.insertGenerateWordToField(key)} ></i>
                }

                <i class=" far fa-trash-alt field-action mt-1" onDoubleClick={() => this.removeField(key)}></i>

            </Row>

        );
    }

    getObjectFieldJSX(key) {
        return (
            <div style={{ fontSize: 20, marginLeft: this.state.indent }} >
                <Row className="field" onClick={() => this.collapseEntityEditor(key)} >


                    <div style={{ marginLeft: 10 }}>
                        {this.state.objectFieldsOpen[key] ?
                            <i class="fas fa-angle-down" style={{ width: 18 }}></i> :
                            <i class="fas fa-angle-right" style={{ width: 18 }}></i>
                        }
                    </div>

                    <div style={{ marginLeft: 10 }}>
                        <Form.Label>{key}</Form.Label>
                    </div>

                    <div style={{ marginLeft: 10 }} >
                        <i class=" far fa-trash-alt field-action mt-1" onDoubleClick={() => this.removeField(key)}></i>
                    </div>


                </Row>

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

            <div style={{ fontSize: 20, marginLeft: this.state.indent }} >
                <Row className='field mb-1' onClick={() => this.collapseEntityEditor(key)} >
                    <div style={{ marginLeft: 10 }}>
                        {this.state.objectFieldsOpen[key] ?
                            <i class="fas fa-angle-down" style={{ width: 18 }}></i> :
                            <i class="fas fa-angle-right" style={{ width: 18 }}></i>
                        }
                    </div>
                    <div style={{ marginLeft: 10 }}>
                        <Form.Label>{key}</Form.Label>
                    </div>
                    <div style={{ marginLeft: 10 }}>
                        <i class=" far fa-trash-alt field-action mt-1" onDoubleClick={() => this.removeField(key)}></i>
                    </div>
                </Row>
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
