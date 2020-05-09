import React from 'react';
import styled from 'styled-components';
import { Form, Row } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import { Collapse} from 'reactstrap';
import Popup from "reactjs-popup";
import Select from 'react-select';
import { convertJsonTemplateToActualJson } from './Utility'
import HummusContext from './HummusContext'


const Styles = styled.div`
    .field {
        font-size: 18px;
        height: 36px; 
        margin-top : 5px;
        width:110%;
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
        margin-left:7px;
        display: none;
        cursor: pointer;
    }

    .field:hover .field-action {
        display: block;
    }

    .info-txt {
        font-size:13px;
    }

    .info-field-path-txt {
        font-size:12px;
    }

    .fa-trash {
        
        
    }

    .fa-trash:hover {
        color: #d32f2f;
    }

    .fa-times:hover {
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
        cursor: arrow;
    }
`;

class EntityEditor extends React.Component {

    static contextType = HummusContext;

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
            parentPath: props.parentPath,
            expandAll: props.expandAll,
            json: JSON.parse(props.jsondata),
            disabledFields: [],
            fullJson: JSON.parse(props.fullJson),
            name: props.name,
            level: props.level,
            indent: 43 * props.level,
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
        var disabledFields = this.context.data.currScenario.steps[this.context.data.currOpenStep].disabledFields;
        return convertJsonTemplateToActualJson(this.state.json, disabledFields);
    }

    getTotalBombaJson() {
        var disabledFields = this.context.data.currScenario.steps[this.context.data.currOpenStep].disabledFields;
        return convertJsonTemplateToActualJson(this.state.json, disabledFields, false);
    }

    // TODO: check if still need the fieldsInput

    insertTimeNowToField(key) {
        this.fieldsInput[key].value = '{iso}'
        this.changeField(key, '{iso}');
    }

    insertGenerateWordToField(key) {
        this.fieldsInput[key].value = '{text}'
        this.changeField(key, '{text}');
    }

    //#region data changed functions

    disableField(event, key) {
        var keyPath = this.getKeyFullPath(key);

        var disabledFields = this.context.data.currScenario.steps[this.context.data.currOpenStep].disabledFields;
        if (disabledFields.includes(keyPath)) {
            disabledFields.splice(disabledFields.indexOf(keyPath), 1);
        } else {
            disabledFields.push(keyPath);
        }
        this.setState(this.state);
        event.stopPropagation();
    }

    changeField(key, value) {
        this.state.json[key] = value;
        this.updateJson('change');
    }

    /**
     * The method gets a removed key, and checks if the key is linked to another field. If it does,
     * the method removes the link.
     * @param {*} key - the removed key
     */
    removeRelevantLinks(key) {
        var keyFullPath = this.getKeyFullPath(key);

        // remove links from curr step        
        var links = this.context.data.currScenario.steps[this.context.data.currOpenStep].links;

        for (var index = 0; index < links.length; index++) {
            if (links[index].toPath.includes(keyFullPath + '/') || links[index].toPath == keyFullPath) {
                links.splice(index, 1);
                index--;
            }
        }

        // remove links from other steps
        for (var stepIndex in this.context.data.currScenario.steps) {
            var links = this.context.data.currScenario.steps[stepIndex].links;

            for (var index = 0; index < links.length; index++) {
                if ((links[index].fromPath.includes(keyFullPath + '/') || links[index].fromPath == keyFullPath) && 
                        links[index].fromStep == this.context.data.currOpenStep) {
                    links.splice(index, 1);
                    index--;
                }
            }
        }
    }

    removeField(key) {
        this.removeRelevantLinks(key);

        // remove actual field
        delete this.state.json[key];
        delete this.children[key];
        delete this.fieldsInput[key];

        this.updateJson('delete');
    }

    addField(key, event) {
        this.state.json[key].push(JSON.parse(JSON.stringify(this.arrayFieldsObjectTemplate[key])));
        this.children[key].push(React.createRef());

        this.updateJson('add');

        event.stopPropagation();
    }

    updateJson(updateType) {
        this.setState(this.state);

        var newEvent = {
            type: updateType,
            newJson: this.state.json,
            father: this.state.name
        };

        if (this.onInnerFieldChangedCallback) {
            this.onInnerFieldChangedCallback(newEvent);
        }

    }
    //#endregion

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

    isKeyIsElementNumber(key) {

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

    getKeyFullPath(key) {
        if (this.isCurrentJsonIsAnElementInArray()) {
            key = parseInt(key);
        } 

        var keyFullPath = this.state.parentPath + '/' + key
        var keyCleanFullPath = keyFullPath.split('/')
            .map(subKey => subKey.split('|')[0])
            .join('/');

        return keyCleanFullPath;
    }

    //#region info button

    hasInfo(key, infoIndex) {
        return key.split('|').length >= infoIndex + 1;
    }

    createInfoPopup(key, infoIndex) {
        var parentCleanPath = this.state.parentPath.split('/').map(subKey => subKey.split('|')[0]).join('/');
        var fieldName = key.split('|')[0];
        var fullPath = parentCleanPath + '/' + fieldName;

        // Because the path starts with /Target/0, and we dont want it, we will remove it
        fullPath = '/' + fullPath.split('/').slice(3).map(subKey => subKey.split('|')[0]).join('/');

        return (
            <div className="field-component">
                <Popup
                    position="right top"
                    on="hover"
                    trigger={
                        <i className="fas fa-info-circle field-action mt-1"></i>}
                >
                    <div>
                        <center className="info-txt">
                            {this.hasInfo(key, infoIndex) &&
                                key.split('|')[infoIndex]}
                        </center>
                        {this.hasInfo(key, infoIndex) &&
                            <hr style={{ margin: 2 }} />}

                        <center className="info-field-path-txt">
                            {fullPath}
                        </center>
                    </div>
                </Popup>
            </div>
        );
    }

    //#endregion

    isKeyLinkTo(key) {
        var keyFullPath = this.getKeyFullPath(key);
        var links = this.context.data.currScenario.steps[this.context.data.currOpenStep].links;
        for (var index in links) {
            if (links[index].toPath == keyFullPath) {
                return true;
            }
        }

        return false;
    }

    isKeyLinkFrom(key) {
        var keyFullPath = this.getKeyFullPath(key);
        var links = this.context.data.currScenario.steps[this.context.data.currOpenStep].links;
        for (var index in links) {
            if (links[index].fromPath == keyFullPath) {
                return true;
            }
        }

        return false;
    }

    //#region rendering json fields
    getSingleFieldJSX(key) {
        var keyName = key.split('|')[0];
        var keyType = key.split('|')[1];
        var keyRequiredValue = key.split('|')[2];

        if (this.isKeyLinkTo(key)) {
            this.state.json[key] = "{link}";
        }

        var defaultValue = this.state.json[key];
        var keyFullPath = this.getKeyFullPath(key);

        var enumValuesItem = []
        if (keyType == "enum") {
            var optionalValues = JSON.parse(key.split('|')[3]);
            for (var index in optionalValues) {
                enumValuesItem.push(
                    <option value={parseInt(optionalValues[index])} key={optionalValues[index]}>{optionalValues[index]}</option>
                );
            }

        }

        var disabledFields = this.context.data.currScenario.steps[this.context.data.currOpenStep].disabledFields;



        return (

            <Row key={key} className="field mb-1" style={{ paddingLeft: this.state.indent }}>
                <div className="field-component">
                    {disabledFields.includes(keyFullPath) &&
                        <Form.Label style={{ textDecoration: 'line-through' }}>{keyName}</Form.Label>
                    }
                    {!disabledFields.includes(keyFullPath) &&
                        <Form.Label >{keyName}</Form.Label>
                    }


                </div>

                <div className="field-component">
                    <Form.Label style={{ fontSize: 10 }}> {keyRequiredValue} </Form.Label>
                </div>

                <div className="field-component" style={{ marginTop: 3 }}>

                    {/* If current field is enum, create select input */}
                    {keyType == 'enum' &&
                        <Form.Control
                            as="select"
                            ref={(ref) => this.fieldsInput[key] = ref}
                            name={key}
                            size="sm"
                            value={defaultValue}
                            onChange={(event) => this.changeField(key, event.target.value)}
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
                            disabled={defaultValue == '{link}'}
                            onChange={(event) => this.changeField(key, event.target.value)}
                            value={defaultValue}
                            size="sm"
                            type={this.inputTypesMap[keyType]}
                            width="20px" />

                    }
                </div>

                <div className="field-component" >
                    {keyType == "time" &&
                        <i className="far fa-clock field-action mt-1" onClick={() => this.insertTimeNowToField(key)} ></i>
                    }

                    {keyType == "string" &&
                        <i className="fas fa-dice field-action mt-1" onClick={() => this.insertGenerateWordToField(key)} ></i>
                    }
                </div>



                <div className="field-component">
                    <i onClick={(event) => this.disableField(event, key)} className="fas fa-times field-action mt-1"></i>
                </div>

                {this.createInfoPopup(key, 3)}

                <div className="field-component">
                    <i className=" fas fa-trash field-action mt-1" onClick={() => this.removeField(key)}></i>
                </div>

            </Row>

        );
    }


    getObjectFieldJSX(key) {
        var keyName = key.split('|')[0];
        var keyRequiredValue = key.split('|')[1];
        var keyFullPath = this.getKeyFullPath(key);
        var keyPath = '';
        
        if (this.isCurrentJsonIsAnElementInArray()){
            keyPath = this.state.parentPath + '/' + parseInt(key);
        } else {
            keyPath = this.state.parentPath + '/' + key;
        }
        

        var disabledFields = this.context.data.currScenario.steps[this.context.data.currOpenStep].disabledFields;

        

        return (
            <div key={key}>
                <Row className="field mb-1" style={{ paddingLeft: this.state.indent }} onClick={() => this.collapseEntityEditor(key)}>

                    <div className="field-component">
                        {this.state.objectFieldsOpen[key] ?
                            <i className="fas fa-angle-down" style={{ width: 18 }}></i> :
                            <i className="fas fa-angle-right" style={{ width: 18 }}></i>
                        }
                    </div>

                    <div className="field-component">
                        {disabledFields.includes(keyFullPath) &&
                            <Form.Label style={{ textDecoration: 'line-through' }}>{keyName}</Form.Label>
                        }
                        {!disabledFields.includes(keyFullPath) &&
                            <Form.Label >{keyName}</Form.Label>
                        }
                    </div>



                    <div className="field-component">
                        <Form.Label style={{ fontSize: 10 }}> {keyRequiredValue} </Form.Label>
                    </div>

                    <div className="field-component">
                        <i onClick={(event) => this.disableField(event, key)} className="fas fa-times field-action mt-1"></i>
                    </div>


                    {this.createInfoPopup(key, 2)}

                    <div className="field-component">
                        <i className=" fas fa-trash field-action mt-1" onClick={() => this.removeField(key)}></i>
                    </div>


                </Row>

                <Collapse isOpen={this.state.objectFieldsOpen[key]}>
                    <EntityEditor
                        parentPath={keyPath}
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
        var keyFullPath = this.getKeyFullPath(key);

        var disabledFields = this.context.data.currScenario.steps[this.context.data.currOpenStep].disabledFields;

        const items = []

        // create the array field itself, with collapseEntityEditor button
        items.push(

            <div key={key}>
                <Row className='field mb-1' style={{marginLeft:'0.001em', paddingLeft: this.state.indent }} onClick={() => this.collapseEntityEditor(key)} >
                    <div className="field-component">
                        {this.state.objectFieldsOpen[key] ?
                            <i className="fas fa-angle-down" style={{ width: 18 }}></i> :
                            <i className="fas fa-angle-right" style={{ width: 18 }}></i>
                        }
                    </div>

                    <div className="field-component">
                        {disabledFields.includes(keyFullPath) &&
                            <Form.Label style={{ textDecoration: 'line-through' }}>{keyName}</Form.Label>
                        }
                        {!disabledFields.includes(keyFullPath) &&
                            <Form.Label >{keyName}</Form.Label>
                        }
                    </div>

                    <div className="field-component">
                        <Form.Label style={{ fontSize: 10 }}> {keyRequiredValue} </Form.Label>
                    </div>

                    <div className="field-component">
                        <i className=" fas fa-plus field-action mt-1" onClick={(event) => this.addField(key, event)}></i>
                    </div>

                    <div className="field-component">
                        <i onClick={(event) => this.disableField(event, key)} className="fas fa-times field-action mt-1"></i>
                    </div>

                    {this.createInfoPopup(key, 3)}

                    <div className="field-component">
                        <i className=" fas fa-trash field-action mt-1" onClick={() => this.removeField(key)}></i>
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
                <Collapse key={key + '/' + step} isOpen={this.state.objectFieldsOpen[key]}>
                    <EntityEditor
                        parentPath={this.state.parentPath + "/" + key}
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
