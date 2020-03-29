import React from 'react';
import styled from 'styled-components';
import { Form, Col, Row } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import { Collapse, Button, CardBody, Card } from 'reactstrap';
import Popup from "reactjs-popup";
import Select from 'react-select';


const Styles = styled.div`
    .field {
        font-size: 18px;
        height: 36px; 
        margin-top : 5px;
        width:95%;
        &:hover { background: #bbdefb; }
    }

    .collapse {
        padding-top: 0.01%;
        padding-bottom:1px;
    }

    .field-component {
        margin-right: 6px;
    }

    .color-hover {
        &:hover { background: #bbdefb; }
    }

    .field-action {
        padding: 3px;
        display: none;
    }

    .field:hover .field-action {
        display: block;
    }

    .info-txt {
        font-size:12px;
    }

    .fa-trash-alt {
        margin-left:40px;
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

    .fa-plus:hover {
        color: #66bb6a;
    }

    .fa-info-circle:hover {
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
            "float": "number",
            "time": "text",
            "enum": "text"
        }

        this.init(props);

    }

    init(props) {
        this.state = {
            expandAll: props.expandAll,
            json: JSON.parse(props.jsondata),
            fullJson: JSON.parse(props.fullJson),
            name: props.name,
            level: parseInt(props.level),
            indent: 30 * parseInt(props.level),
            objectFieldsOpen: {} // for each field in the current json scope, set true/false, if the field is collapsed or not.
        }

        this.fieldsInput = {};

        this.onInnerFieldChangedCallback = props.onInnerFieldChanged;

        this.initCollapsableFields(props.expandAll);

        this.initChildrenEntityEditors();

        this.initArrayFieldsObjectTemplate();
    }

    initArrayFieldsObjectTemplate() {
        // This json contains json templates for each array field in 
        // the current json, so when adding another json to the array, it will
        // take from the tamplate
        this.arrayFieldsObjectTemplate = {};

        for (var key in this.state.fullJson) {
            if (typeof this.state.fullJson[key] == 'object') {

                if (Array.isArray(this.state.fullJson[key])) {
                    this.arrayFieldsObjectTemplate[key] = JSON.parse(JSON.stringify(this.state.fullJson[key][0]));
                }

            }
        }
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

    initCollapsableFields(isExpandAll) {
        for (var key in this.state.json) {
            if (typeof this.state.json[key] == 'object') {
                this.state.objectFieldsOpen[key] = isExpandAll;
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
            var fieldName = key.split('|')[0];

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

                resultJson[fieldName] = jsonItems;

            } else {
                var child = this.children[key];
                var fieldValue = child.current.getTotalJson();
                resultJson[fieldName] = fieldValue;
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
            finalValue = parseInt(fieldValue); // If enum, and looks like this : "50 - ABC", it will parse the only th 50 to string
        } else if (fieldType == "float") {
            finalValue = parseFloat(fieldValue);
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
        delete this.state.json[key];
        delete this.children[key];
        delete this.fieldsInput[key];
        this.setState(this.state);

        var event = {
            type: 'delete',
            newJson: this.state.json,
            father: this.state.name
        };

        if (this.onInnerFieldChangedCallback) {
            this.onInnerFieldChangedCallback(event);
        }
    }

    addField(key, event) {
        console.log('event is ' + event)
        this.state.json[key].push(JSON.parse(JSON.stringify(this.arrayFieldsObjectTemplate[key])));
        this.children[key].push(React.createRef());
        this.setState(this.state);

        var newEvent = {
            type: 'add',
            newJson: this.state.json,
            father: this.state.name
        };

        if (this.onInnerFieldChangedCallback) {
            this.onInnerFieldChangedCallback(newEvent);
        }

        event.stopPropagation();
    }

    /**
     * The method handle a change in inner json.
     * 
     * The EntityEditor has parameter this.state.json . This parameter is passed as string, and converted to json.
     * so if a child of the child of my json, is changed, it saved only in the original changed json. the father father 
     * json, etc, this json, will not have this change. so we need to update the change in the current json and all fathers
     * json.
     * @param {*} event 
     */
    innerFieldChanged(event) {

        var newEventType = 'change';
        var newEventNewJson = this.state.json;

        // If the father is array  (meaning the current json is an element in the array)
        if (event.father.includes('/')) {
            var fieldName = event.father.split('/')[0];
            var elementIndex = event.father.split('/')[1];
            if (event.type == 'delete') {
                this.state.json[fieldName].splice(elementIndex, 1);
                this.children[fieldName].splice(elementIndex, 1);

                // After deleting the field from the current json, the state for the upper
                // json, is change, because the *current* json is changed, and not deleted.
                newEventType = 'change';
            } else if (event.type == 'add' || event.type == 'change') {

                // If the json changed, we need to remove the old element, and add the new element, in the same index
                this.state.json[fieldName].splice(elementIndex, 1);
                this.state.json[fieldName].splice(elementIndex, 0, event.newJson);
            }

        } else {

            // If the current json is an element is array, we need to remove the key "1.", and add to the
            // father array, the actual json, without my addition key. 
            // so the actual json is saved in event.newJson.
            if (this.isCurrentJsonIsAnElementInArray()) {
                newEventNewJson = event.newJson;
            }

            this.state.json[event.father] = event.newJson;
        }

        var newEvent = {
            type: newEventType,
            newJson: newEventNewJson,
            father: this.state.name
        };

        if (this.onInnerFieldChangedCallback) {
            this.onInnerFieldChangedCallback(newEvent)
        }

    }

    /*
    The method checks if the current json object, is an element inside an array.
    If it is the json will look like this:

    {
        "1.": {
            ...
        }
    }

    with only one key, and with this template "<number>."

    */
    isCurrentJsonIsAnElementInArray() {
        if (Object.keys(this.state.json).length == 1) {

            var str = Object.keys(this.state.json)[0];
            var patt1 = /[\d]*[.]/g;
            var result = str.match(patt1);

            return str == result;
        }

        return false;
    }

    //#region rendering json fields
    getSingleFieldJSX(key) {
        var keyName = key.split('|')[0];
        var keyType = key.split('|')[1];
        var keyRequiredValue = key.split('|')[2];
        var defaultValue = this.state.json[key]


        var enumValuesItem = []
        if (keyType == "enum") {
            var optionalValues = JSON.parse(defaultValue);
            for (var index in optionalValues) {
                enumValuesItem.push(
                    <option>{optionalValues[index]}</option>
                );
            }

        }

        return (

            <Row key={key} className="field mb-1" style={{ marginLeft: this.state.indent }}>
                <div class="field-component">
                    <Form.Label >{keyName}</Form.Label>
                </div>

                <div class="field-component">
                    <Form.Label style={{ fontSize: 10 }}> {keyRequiredValue} </Form.Label>
                </div>

                <div class="field-component" style={{ marginTop: 3 }}>

                    {/* If current field is enum, create select input */}
                    {keyType == 'enum' &&
                        <Form.Control
                            as="select"
                            ref={(ref) => this.fieldsInput[key] = ref} name={key}
                            size="sm"
                            type={this.inputTypesMap[keyType]}
                            width="20px">

                            {enumValuesItem}
                        </Form.Control>
                    }

                    {/* If current field is enum, create select input */}
                    {keyType == 'array' &&
                        <Select
                            isMulti
                            isClearable
                            isSearchable
                            options={JSON.parse(defaultValue)}
                        />
                    }

                    {/* Else, If current field is int/string, create regular input */}
                    {keyType != 'enum' && keyType != 'array' &&
                        <Form.Control
                            ref={(ref) => this.fieldsInput[key] = ref}
                            name={key}
                            defaultValue={defaultValue}
                            size="sm"
                            type={this.inputTypesMap[keyType]}
                            width="20px" />

                    }
                </div>

                <div class="field-component" >
                    {keyType == "time" &&
                        <i class="far fa-clock field-action mt-1" onClick={() => this.insertTimeNowToField(key)} ></i>
                    }

                    {keyType == "string" &&
                        <i class="fas fa-dice field-action mt-1" onClick={() => this.insertGenerateWordToField(key)} ></i>
                    }
                </div>

                {this.hasInfo(key, 4) &&
                    this.createInfoPopup(key, 4)}

                <div class="field-component">
                    <i class=" far fa-trash-alt field-action mt-1" onClick={() => this.removeField(key)}></i>
                </div>

            </Row>

        );
    }

    //#region info button
    createInfoPopup(key, infoIndex) {
        return (
            <div className="field-component">
                <Popup
                    position="right top"
                    on="hover"
                    trigger={
                        <i class="fas fa-info-circle field-action mt-1"></i>}
                >
                    <center className="info-txt">
                        {key.split('|')[infoIndex]}
                    </center>
                </Popup>
            </div>
        );
    }

    hasInfo(key, infoIndex) {
        return key.split('|').length >= (infoIndex + 1);
    }
    //#endregion

    getObjectFieldJSX(key) {
        var keyName = key.split('|')[0];
        var keyRequiredValue = key.split('|')[1];

        return (
            <div>
                <Row key={key} className="field mb-1" style={{ marginLeft: this.state.indent }} onClick={() => this.collapseEntityEditor(key)}>

                    <div class="field-component">
                        {this.state.objectFieldsOpen[key] ?
                            <i class="fas fa-angle-down" style={{ width: 18 }}></i> :
                            <i class="fas fa-angle-right" style={{ width: 18 }}></i>
                        }
                    </div>

                    <div class="field-component">
                        <Form.Label>{keyName}</Form.Label>
                    </div>

                    <div class="field-component">
                        <Form.Label style={{ fontSize: 10 }}> {keyRequiredValue} </Form.Label>
                    </div>

                    {this.hasInfo(key, 2) &&
                        this.createInfoPopup(key, 2)}

                    <div class="field-component">
                        <i class=" far fa-trash-alt field-action mt-1" onClick={() => this.removeField(key)}></i>
                    </div>


                </Row>

                <Collapse isOpen={this.state.objectFieldsOpen[key]}>
                    <EntityEditor
                        expandAll={this.state.expandAll}
                        onInnerFieldChanged={(event) => this.innerFieldChanged(event)}
                        name={key}
                        ref={this.children[key]}
                        level={this.state.level + 1}
                        fullJson={JSON.stringify(this.state.fullJson[key])}
                        jsondata={JSON.stringify(this.state.json[key])}></EntityEditor>
                </Collapse>
            </div>
        )
    }

    getArrayFieldJSX(key) {
        var keyName = key.split('|')[0];
        var keyRequiredValue = key.split('|')[1];

        const items = []

        // create the array field itself, with collapseEntityEditor button
        items.push(

            <div  >
                <Row className='field mb-1' style={{ marginLeft: this.state.indent }} onClick={() => this.collapseEntityEditor(key)} >
                    <div class="field-component">
                        {this.state.objectFieldsOpen[key] ?
                            <i class="fas fa-angle-down" style={{ width: 18 }}></i> :
                            <i class="fas fa-angle-right" style={{ width: 18 }}></i>
                        }
                    </div>

                    <div class="field-component">
                        <Form.Label>{keyName}</Form.Label>
                    </div>

                    <div class="field-component">
                        <Form.Label style={{ fontSize: 10 }}> {keyRequiredValue} </Form.Label>
                    </div>

                    <div class="field-component">
                        <i class=" fas fa-plus field-action mt-1" onClick={(event) => this.addField(key, event)}></i>
                    </div>

                    <div class="field-component">
                        <i class=" far fa-trash-alt field-action mt-1" onClick={() => this.removeField(key)}></i>
                    </div>
                </Row>
            </div>
        )

        // For each element in the array -> create a new json which looks like this { "1.": {...}}, and create element with
        // this json
        for (let step = 0; step < this.state.json[key].length; step++) {
            const currJson = '{"' + step + '.":' + JSON.stringify(this.state.json[key][step]) + "}"
            const currFullJson = '{"' + step + '.":' + JSON.stringify(this.state.fullJson[key][0]) + "}"
            items.push(
                <Collapse isOpen={this.state.objectFieldsOpen[key]}>
                    <EntityEditor
                        expandAll={this.state.expandAll}
                        name={key + '/' + step}
                        onInnerFieldChanged={(event) => this.innerFieldChanged(event)}
                        ref={this.children[key][step]}
                        level={this.state.level + 1}
                        fullJson={currFullJson}
                        jsondata={currJson}></EntityEditor>
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
