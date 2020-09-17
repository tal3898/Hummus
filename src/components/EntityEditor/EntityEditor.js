import React from 'react';


import { Form, Row, Col, Button, InputGroup } from 'react-bootstrap';
import BootstrapSwitchButton from 'bootstrap-switch-button-react'
import Styles from './EntityEditorCss'
import 'bootstrap/dist/css/bootstrap.css';
import { Collapse } from 'reactstrap';
import Popup from "reactjs-popup";
import Select from 'react-select';
import { convertJsonTemplateToActualJson } from '../Utility'
import HummusContext from '../HummusContext'
import LinkingFieldsPopup from '../LinkingFieldsPopup'
import Creators from '../../globals/Creators.json'
import { List } from 'react-virtualized';
import FlipSwitch from '../FlipSwitch/FlipSwitch'

import SearchBar from '../SearchBar';

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
            json: props.jsondata,
            expandAll: false,
            disabledFields: [],
            fullJson: props.fullJson,
            name: props.name,
            isLinkPopupOpen: false,
            level: props.level,
            indent: 43,
            linkJson: {},
            objectFieldsOpen: {}, // for each field in the current json scope, set true/false, if the field is collapsed or not.
            filterData: {
                userFilter: '',
                scrollTo: undefined,
                filterResult: []
            }
        }

        this.fieldsInput = {};

        this.onInnerFieldChangedCallback = props.onInnerFieldChanged;

        this.initCollapsableFields(false);

        this.initChildrenEntityEditors();

        this.initArrayFieldsObjectTemplate();

    }

    flattenJsonToListOfKeysPath() {
        var stack = [];
        this.jsonFieldsPathList = [];

        for (var key in this.state.json) {
            stack.push('/' + key);
        }

        while (stack.length != 0) {
            var currElement = stack.pop();
            var keyPath = currElement;
            var keyName = keyPath.split('/')[keyPath.split('/').length - 1];
            var keyValue = this.getValue(this.state.json, keyPath);

            if (!this.jsonFieldsPathList.includes(keyPath)) {
                this.jsonFieldsPathList.push(keyPath);

                if (typeof keyValue == typeof {}) {

                    var children = Object.keys(keyValue)
                        .map(child => keyPath + '/' + child)
                        .reverse();

                    stack = stack.concat(children);
                }
            }
        }
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
        if (this.props.jsondata != newProps.jsondata) {
            this.init(newProps)
            this.setState(this.state);
        }
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
        this.state.collapsedFieldsMap = {};
        this.addJsonToCollapseMap(this.state.json, '', isExpandAll);
        delete this.state.collapsedFieldsMap[''];
    }

    /**
     * The function expands all the fields, or collapse all the fields
     */
    expandCollapseAll() {
        this.state.expandAll = !this.state.expandAll;
        this.addJsonToCollapseMap(this.state.json, '', this.state.expandAll);
        delete this.state.collapsedFieldsMap[''];
        this.setState(this.state);
    }

    /**
     * The function gets a json, and added all the object fields to the collapse fields map, with defalut value false/true.
     * 
     * Used in adding json to array element in the json
     * @param {json} json 
     * @param {string} jsonParentPath - The parent path of the given json.
     * @param {boolean} defalutValue 
     */
    addJsonToCollapseMap(json, jsonParentPath, defalutValue) {
        var stack = [];
        var jsonFieldsPathList = [];

        this.state.collapsedFieldsMap[jsonParentPath] = defalutValue;

        for (var key in json) {
            stack.push('/' + key);
        }

        while (stack.length != 0) {
            var currElement = stack.pop();
            var keyPath = currElement;
            var keyName = keyPath.split('/')[keyPath.split('/').length - 1];
            var keyValue = this.getValue(json, keyPath);

            if (!jsonFieldsPathList.includes(keyPath)) {
                jsonFieldsPathList.push(keyPath);

                if (typeof keyValue == typeof {}) {
                    this.state.collapsedFieldsMap[jsonParentPath + keyPath] = defalutValue;
                    var children = Object.keys(keyValue)
                        .map(child => keyPath + '/' + child);

                    stack = stack.concat(children);
                }
            }
        }
    }

    //#endregion

    collapseEntityEditor(keyPath) {
        this.state.collapsedFieldsMap[keyPath] = !this.state.collapsedFieldsMap[keyPath];
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

    insertTimeNowToField(keyPath) {
        this.changeField(keyPath, '{iso}');
    }

    insertGenerateWordToField(keyPath) {
        this.changeField(keyPath, '{random}');
    }

    //#region data changed functions

    disableField(event, keyCleanPath) {

        var disabledFields = this.context.data.currScenario.steps[this.context.data.currOpenStep].disabledFields;
        if (disabledFields.includes(keyCleanPath)) {
            disabledFields.splice(disabledFields.indexOf(keyCleanPath), 1);
        } else {
            disabledFields.push(keyCleanPath);
        }
        this.setState(this.state);
        event.stopPropagation();
    }

    changeField(keyPath, value, valueType) {
        if (valueType == "number") {
            this.setValue(this.state.json, keyPath, parseInt(value));
        } else {
            this.setValue(this.state.json, keyPath, value);
        }

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

    removeField(keyPath) {
        this.removeRelevantLinks(keyPath);

        // remove actual field
        this.deleteField(this.state.json, keyPath);

        this.updateJson('delete');
    }

    addField(keyPath, event) {
        var keyPathInFullJson = keyPath.split('/')
            .map(field => isNaN(field) || field == "" ? field : 0)
            .join('/') +
            "/0";

        var newElement = JSON.parse(JSON.stringify(this.getValue(this.state.fullJson, keyPathInFullJson)));
        this.addValue(this.state.json, keyPath, newElement);
        var newElementIndex = this.getValue(this.state.json, keyPath).length - 1;

        this.addJsonToCollapseMap(newElement, keyPath + '/' + newElementIndex, false);

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

    getKeyFullPath(keyPath) {
        var keyCleanFullPath = keyPath.split('/')
            .map(subKey => subKey.split('|')[0])
            .join('/');

        return keyCleanFullPath;
    }

    //#region info button

    hasInfo(key, infoIndex) {
        return key.split('|').length >= infoIndex + 1;
    }

    createInfoPopup(keyPath, infoIndex) {
        var key = keyPath.split('/')[keyPath.split('/').length - 1];

        // Because the path starts with /Target/0, and we dont want it, we will remove it
        var fullPath = '/' + keyPath.split('/').slice(3).map(subKey => subKey.split('|')[0]).join('/');

        return (
            <div className="field-component info-popup-div">
                <Popup
                    position="right top"
                    on="hover"
                    trigger={
                        <i className="fas field-info-popup fa-info-circle field-action mt-1"></i>}
                >
                    <div className="info-popup-text">
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

    isKeyLinkTo(keyPath) {
        var links = this.context.data.currScenario.steps[this.context.data.currOpenStep].links;
        for (var index in links) {
            if (links[index].toPath == keyPath) {
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

    listRowRender(index, isScrolling, key, style) {
        var currRowField = this.visibleFields[index.index];
        var fieldValue = this.getValue(this.state.json, currRowField);
        var fieldRender;

        if (typeof fieldValue != typeof {}) {
            fieldRender = this.getSingleFieldJSX(currRowField);
        } else if (Array.isArray(fieldValue)) {
            fieldRender = this.getArrayFieldJSX(currRowField);
        } else {
            fieldRender = this.getObjectFieldJSX(currRowField);
        }

        return (
            <div key={index.key} style={index.style}>
                {fieldRender}

            </div>
        );
    }

    getKeyNameStyle(key, keyCleanPath, disabledFields) {
        var keyStyle = {
        };

        var keyClassesName = "";

        if (disabledFields.includes(keyCleanPath)) {
            keyClassesName += "key-name-disabled ";
        }
        if (this.state.filterData.userFilter != "" && key.toLowerCase().includes(this.state.filterData.userFilter.toLowerCase())) {
            keyClassesName += "key-name-searched ";
        }

        return keyClassesName;
    }

    getSingleFieldJSX(keyPath) {
        var key = keyPath.split('/')[keyPath.split('/').length - 1];
        var keyCleanPath = this.getKeyFullPath(keyPath);
        var keyName = key.split('|')[0];
        var keyType = key.split('|')[1];
        var keyRequiredValue = key.split('|')[2];
        var level = keyPath.split('/').length - 2;

        if (this.isKeyLinkTo(keyCleanPath)) {
            this.setValue(this.state.json, keyPath, "{link}");
        }

        var defaultValue = this.getValue(this.state.json, keyPath);

        if (key.split('|')[1] == "" || key.split('|')[1] == undefined) {
            keyType = typeof defaultValue;
        }


        var enumValuesItem = []
        if (keyType == "enum" || keyType == "creator") {
            var optionalValues;

            if (keyType == "creator") {
                optionalValues = Creators;
            } else {
                optionalValues = JSON.parse(key.split('|')[3]);
            }

            for (var index in optionalValues) {
                enumValuesItem.push(
                    <option value={parseInt(optionalValues[index])} key={optionalValues[index]}>{optionalValues[index]}</option>
                );
            }
        }

        var disabledFields = this.context.data.currScenario.steps[this.context.data.currOpenStep].disabledFields;

        var keyClassNames = this.getKeyNameStyle(key, keyCleanPath, disabledFields);

        return (

            <Row key={key} className="json-field mb-1" style={{ marginLeft: '0.001em', paddingLeft: this.state.indent * level }}>
                <div className="field-component">
                    <Form.Label className={"key-name " + keyClassNames}>{keyName}</Form.Label>

                </div>

                <div className="field-component">
                    <Form.Label style={{ fontSize: 10 }}> {keyRequiredValue} </Form.Label>
                </div>

                <div className="field-component" style={{ marginTop: 3 }}>

                    {/* If current field is enum, create select input */}
                    {(keyType == 'enum' || keyType == 'creator') &&
                        <Form.Control
                            as="select"
                            ref={(ref) => this.fieldsInput[key] = ref}
                            name={key}
                            size="sm"
                            dir="rtl"
                            value={defaultValue}
                            onChange={(event) => this.changeField(keyPath, event.target.value)}
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

                    {/* If current field is boolean, create checkbox */}
                    {keyType == 'boolean' &&

                        <BootstrapSwitchButton
                            onlabel="true"
                            offlabel="false"
                            checked={defaultValue}
                            onChange={(value) => this.changeField(keyPath, value)}
                            size="sm" />

                    }

                    {/* Else, If current field is int/string, create regular input */}
                    {keyType != 'enum' && keyType != 'creator' && keyType != 'array' && keyType != 'boolean' &&
                        <Form.Control
                            ref={(ref) => this.fieldsInput[key] = ref}
                            name={key}
                            disabled={defaultValue == '{link}'}
                            onChange={(event) => this.changeField(keyPath, event.target.value, keyType)}
                            value={defaultValue}
                            size="sm"
                            type={this.inputTypesMap[keyType]}
                            width="20px" />

                    }
                </div>

                <div className="field-component" >
                    {keyType == "time" &&
                        <i className="far fa-clock field-action mt-1" onClick={() => this.insertTimeNowToField(keyPath)} ></i>
                    }

                    {keyType == "string" &&
                        <i className="fas fa-dice field-action mt-1" onClick={() => this.insertGenerateWordToField(keyPath)} ></i>
                    }
                </div>

                <div className="field-component field-action">
                    <FlipSwitch
                        onClick={(event) => this.disableField(event, keyCleanPath)}
                        checked={!disabledFields.includes(keyCleanPath)}
                    />
                </div>

                {this.createInfoPopup(keyPath, 3)}

                <div className="field-component">
                    <i className=" fas fa-trash field-action mt-1" onClick={() => this.removeField(keyPath)}></i>
                </div>

            </Row>

        );
    }


    getObjectFieldJSX(keyPath) {
        var key = keyPath.split('/')[keyPath.split('/').length - 1];
        var keyName = key.split('|')[0];
        var keyRequiredValue = key.split('|')[1];
        var keyCleanPath = this.getKeyFullPath(keyPath);
        var level = keyPath.split('/').length - 2;



        var disabledFields = this.context.data.currScenario.steps[this.context.data.currOpenStep].disabledFields;

        var keyClassNames = this.getKeyNameStyle(key, keyCleanPath, disabledFields);

        return (
            <div key={key}>
                <Row className="json-field mb-1" style={{ marginLeft: '0.001em', paddingLeft: this.state.indent * level }} onClick={() => this.collapseEntityEditor(keyPath)}>

                    <div className="field-component">
                        {this.state.collapsedFieldsMap[keyPath] ?
                            <i className="fas fa-angle-down" style={{ marginTop: 10, width: 18 }}></i> :
                            <i className="fas fa-angle-right" style={{ marginTop: 10, width: 18 }}></i>
                        }
                    </div>

                    <div className="field-component">
                        <Form.Label className={"key-name " + keyClassNames}>{keyName}</Form.Label>
                    </div>



                    <div className="field-component">
                        <Form.Label style={{ fontSize: 10 }}> {keyRequiredValue} </Form.Label>
                    </div>

                    <div className="field-component field-action">
                        <FlipSwitch
                            onClick={(event) => this.disableField(event, keyCleanPath)}
                            checked={!disabledFields.includes(keyCleanPath)}
                        />
                    </div>

                    {this.createInfoPopup(keyPath, 2)}

                    <div className="field-component">
                        <i className=" fas fa-trash field-action mt-1" onClick={() => this.removeField(keyPath)}></i>
                    </div>



                </Row>
            </div>
        )
    }

    getArrayFieldJSX(keyPath) {
        var key = keyPath.split('/')[keyPath.split('/').length - 1];
        var keyName = key.split('|')[0];
        var keyRequiredValue = key.split('|')[1];
        var keyCleanPath = this.getKeyFullPath(keyPath);
        var level = keyPath.split('/').length - 2;

        var disabledFields = this.context.data.currScenario.steps[this.context.data.currOpenStep].disabledFields;

        const items = []

        var keyClassNames = this.getKeyNameStyle(key, keyCleanPath, disabledFields);

        // create the array field itself, with collapseEntityEditor button
        items.push(

            <div key={key}>
                <Row className='json-field mb-1' style={{ marginLeft: '0.001em', paddingLeft: this.state.indent * level }} onClick={() => this.collapseEntityEditor(keyPath)} >
                    <div className="field-component">
                        {this.state.collapsedFieldsMap[keyPath] ?
                            <i className="fas fa-angle-down" style={{ marginTop: 10, width: 18 }}></i> :
                            <i className="fas fa-angle-right" style={{ marginTop: 10, width: 18 }}></i>
                        }
                    </div>

                    <div className="field-component">
                        <Form.Label className={"key-name " + keyClassNames} >{keyName}</Form.Label>
                    </div>

                    <div className="field-component">
                        <Form.Label style={{ fontSize: 10 }}> {keyRequiredValue} </Form.Label>
                    </div>

                    <div className="field-component">
                        <i className=" fas fa-plus field-action mt-1 plus-button" onClick={(event) => this.addField(keyPath, event)}></i>
                    </div>

                    <div className="field-component field-action">
                        <FlipSwitch
                            onClick={(event) => this.disableField(event, keyCleanPath)}
                            checked={!disabledFields.includes(keyCleanPath)}
                        />
                    </div>

                    {this.createInfoPopup(keyPath, 2)}

                    <div className="field-component">
                        <i className=" fas fa-trash field-action mt-1" onClick={() => this.removeField(keyPath)}></i>
                    </div>
                </Row>
            </div>
        )

        return items
    }

    setValue(obj, path, value) {
        var i;
        path = path.split('/');
        path.splice(0, 1);
        for (i = 0; i < path.length - 1; i++)
            obj = obj[path[i]];

        obj[path[i]] = value;
    }

    /**
     *  The method push the an array in json path, a new element
     * @param {json} obj 
     * @param {string} path 
     * @param {json} value 
     */
    addValue(obj, path, value) {
        var i;
        path = path.split('/');
        path.splice(0, 1);
        for (i = 0; i < path.length - 1; i++)
            obj = obj[path[i]];

        obj[path[i]].push(value);
    }

    deleteField(obj, path) {
        var i;
        path = path.split('/');
        path.splice(0, 1);
        for (i = 0; i < path.length - 1; i++)
            obj = obj[path[i]];

        if (Array.isArray(obj)) {
            obj.splice(path[i], 1);
        } else {
            delete obj[path[i]];
        }
    }

    getValue(obj, path) {
        var i;
        path = path.split('/');
        path.splice(0, 1);
        for (i = 0; i < path.length - 1; i++)
            obj = obj[path[i]];

        return obj[path[i]];
    }

    isAllParentsExpanded(keyPath) {
        return !Object.keys(this.state.collapsedFieldsMap)
            .some(path => keyPath.includes(path + '/') && !this.state.collapsedFieldsMap[path])
    }

    searchField(event) {
        window.scrollTo(0, document.body.scrollHeight);

        this.state.filterData.userFilter = event.target.value;

        if (this.state.filterData.userFilter != '') {
            this.state.filterData.filterResult = [];

            for (var index in this.jsonFieldsPathList) {
                var keyPath = this.jsonFieldsPathList[index];
                var keyDescription = keyPath.split('/')[keyPath.split('/').length - 1];
                if (keyDescription.toLowerCase().includes(this.state.filterData.userFilter.toLowerCase())) {
                    this.state.filterData.filterResult.push(index);
                    this.openForFieldAllAncestor(this.jsonFieldsPathList[index]);
                }
            }

            if (this.state.filterData.filterResult.length > 0) {
                this.state.filterData.scrollTo = this.state.filterData.filterResult[0];
            } else {
                this.state.filterData.scrollTo = undefined;
            }
        } else {
            this.state.filterData.scrollTo = undefined;
        }

        this.setState(this.state);

    }

    openForFieldAllAncestor(keyPath) {
        Object.keys(this.state.collapsedFieldsMap)
            .filter(path => keyPath.includes(path + '/'))
            .forEach(path => this.state.collapsedFieldsMap[path] = true);

    }

    searchKeyDown(event) {
        if (event.key == 'Enter' && this.state.filterData.filterResult.length > 0) {
            this.state.filterData.filterResult.push(this.state.filterData.filterResult.splice(0, 1)[0]);
            this.state.filterData.scrollTo = this.state.filterData.filterResult[0];
            this.openForFieldAllAncestor(this.jsonFieldsPathList[this.state.filterData.filterResult[0]]);

            this.setState(this.state);
        }
    }

    closePopup() {
        this.state.isLinkPopupOpen = false;
        this.setState(this.state);
    }

    openLinkPopup() {
        this.state.linkJson = this.getTotalJson();
        this.state.isLinkPopupOpen = true;
        this.setState(this.state);
    }

    render() {

        this.flattenJsonToListOfKeysPath();

        this.visibleFields = this.jsonFieldsPathList
            .filter(path => this.isAllParentsExpanded(path));


        return (
            <Styles dir='ltr'>

                <LinkingFieldsPopup
                    step={this.context.data.currOpenStep}
                    json={this.state.linkJson}
                    onClose={() => this.closePopup()}
                    isOpen={this.state.isLinkPopupOpen}
                />

                <Row dir='rtl' style={{ marginBottom: 10 }}>

                    <Col lg='10' className='entity-editor-window'>
                        <Button id="expandAllBtn" style={{ boxShadow: '2px 2px 10px grey', zIndex: 10, top: 24, right: 20, position: 'absolute' }}
                            variant={process.env.REACT_APP_entityEditorTopButtons}
                            onClick={() => this.expandCollapseAll()}>

                            {
                                this.state.expandAll &&
                                <i className="fas fa-compress-alt"></i>
                            }
                            {!this.state.expandAll &&
                                <i className="fas fa-expand-alt"></i>
                            }
                        </Button>

                        <Button style={{ boxShadow: '2px 2px 10px grey', zIndex: 10, top: 24, right: 70, position: 'absolute' }}
                            variant={process.env.REACT_APP_entityEditorTopButtons}
                            onClick={() => this.openLinkPopup()}>

                            {<i className="fas fa-sitemap"></i>}
                        </Button>




                        {/** Creating the search input, with info popup, that describes what the user can search */}
                        <div style={{ right: 130, top: 23, zIndex: 10, position: 'absolute' }}>
                            <SearchBar
                                isTextNotFound={() => this.state.filterData.filterResult.length == 0 && 
                                    this.state.filterData.userFilter != ""}
                                onInputChanged={(event) => this.searchField(event)}
                                onInputKeyDown={(event) => this.searchKeyDown(event)}
                            />

                        </div>




                        <List
                            rowCount={this.visibleFields.length}
                            width={window.innerWidth * 0.67}
                            height={window.innerHeight - 50}
                            rowHeight={40}
                            scrollToIndex={this.state.filterData.scrollTo}
                            rowRenderer={this.listRowRender.bind(this)}
                            overscanRowCount={15}
                            style={{ outline: 'none' }}
                        />



                    </Col>
                </Row>


            </Styles>
        );
    }
    //#endregion    
}

export default EntityEditor;
