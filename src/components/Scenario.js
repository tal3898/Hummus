import React from 'react';
import styled from 'styled-components';
import { InputGroup, Form, Col, Row } from 'react-bootstrap';
import JsonPopup from './JsonPopup';
import ErrorPopup from './ErrorPopup';
import SaveScenarioPopup from './SaveScenarioPopup';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import HummusContext, { HummusConsumer } from './HummusContext'
import NgRequestEditor from './NgRequestEditor';
import Popup from "reactjs-popup";
import { convertJsonTemplateToActualJson, toastProperties } from './Utility'

import EntityMap from '../globals/EntityMap.json'
import { FullEntitiesMap } from '../globals/FullEntitiesMap.js'
import NgUrlsMap from '../globals/NgUrlsMap.json'
import RealityMap from '../globals/RealityMap.json'
import SystemMap from '../globals/SystemMap.json'
import english_2 from '../jsonFormats/english_2.json'
import math_2 from '../jsonFormats/math_2.json'
import chemistry_2 from '../jsonFormats/chemistry_2.json'

import english_x from '../jsonFormats/english_x.json'
import math_x from '../jsonFormats/math_x.json'
import chemistry_x from '../jsonFormats/chemistry_x.json'


const Styles = styled.div`
.main-comp {
    padding-right: 50px;
    margin-top:35px;
}

.metadata {
    margin-top:20px;
}

.field {
    margin-bottom: 20px;
}

.action-btn {
    margin-right: 20px;
    color: #607d8b;
    font-size:30px;
    cursor: pointer;
}

.step-action-btn {
    color: #607d8b;
    font-size:30px;
    cursor: pointer;
}

.step-info {
    
    cursor: pointer;
}

.step-info:hover {
    color: ${process.env.REACT_APP_scenarioActionHover};
}

.step-info-text {
    overflow-wrap: break-word;
    
}

.action-btn:hover {
    color: ${process.env.REACT_APP_scenarioActionHover};
}

.action-btn:active {
    color: ${process.env.REACT_APP_scenarioActionActive};
}

/* Large rounded green border */
.seperator {
    width: 84%;
    margin-right:0px;
    border: 0.05em solid grey;
    border-radius: 5px;
}

.error-link {
    color: blue;
    border-bottom: 1px solid;
}

.plus-scenario-button {

    &:hover { 
        color: #bbdefb; 
        cursor: pointer;
    }
}

.minus-scenario-button {
    &:hover { 
        color: #bbdefb; 
        cursor: pointer;
    }

}

`;

class Scenario extends React.Component {

    static contextType = HummusContext;

    constructor(props) {
        super(props)
        this.child = React.createRef();
        this.state = {
            json: {},
            bombaJson: {},
            isJsonPopupOpen: false,
            isErrorPopupOpen: false,
            isSavePopupOpen: false,
            isMemePopupOPen: false,
            scenarioName: 'bbb',
            errorDescriptionForPopup: [],
            scenarioData: {
                name: '',
                steps: [{
                    entity: 'אנגלית',
                    system: 'טל',
                    reality: 'א',
                    action: 'יצירה',
                    version: '2'
                }]
            },
        }

        this.ngRequestEditorRef = React.createRef();

    }

    openSavePopup() {
        this.state.isSavePopupOpen = true;
        this.loadScenarioToState();

        this.setState(this.state);
    }

    openJsonPopup() {
        this.state.json = this.getStepNgRequest(this.context.data.currOpenStep);
        this.state.bombaJson = this.ngRequestEditorRef.current.getBombaFullRequestJson();
        this.state.isJsonPopupOpen = true;
        this.setState(this.state);
    }

    onMetadataChange(event, key) {
        this.context.data.currScenario.steps[this.context.data.currOpenStep][key] = event.target.value;
        this.context.updateData(this.context);
    }

    loadScenarioToState() {
        this.state.scenarioData.name = this.context.data.currScenario.name;
        this.state.scenarioData.description = this.context.data.currScenario.description;

        this.state.scenarioData.steps = this.context.data.currScenario.steps;
    }


    //#region scenario jsons load functions


    getStepNgRequest(stepNumber) {
        var currStepJson = JSON.parse(this.context.data.currScenario.steps[stepNumber].jsonToEdit);

        var disabledFields = this.context.data.currScenario.steps[stepNumber].disabledFields;
        var entityJson = convertJsonTemplateToActualJson(currStepJson, disabledFields);
        var entityType = this.context.data.currScenario.steps[stepNumber].entity;

        var fullRequestJson = {
            "SendingTime": new Date().toISOString(),
            "RealityId": this.context.data.reality,
            "VersionId": this.context.data.currScenario.steps[stepNumber].version,
            "SendingSystem": this.context.data.currScenario.steps[stepNumber].system,
            "Entities": entityJson[entityType]
        }

        return fullRequestJson;
    }

    setToValue(obj, path, value) {
        var i;
        path = path.split('/');
        path.splice(0, 1);
        for (i = 0; i < path.length - 1; i++)
            obj = obj[path[i]];

        obj[path[i]] = value;
    }

    isPathExists(obj, path) {
        var i;
        path = path.split('/');
        path.splice(0, 1);
        for (i = 0; i < path.length; i++) {
            if (obj[path[i]] != undefined) {
                obj = obj[path[i]];
            } else {
                return false;
            }
        }
        return true;
    }

    /**
     * The function gets a path in json, and removes the first field in the path.
     * If the path is /a/b/c/d
     * the function returns /b/c/d
     * 
     * Why to use it?
     * because the json is /Target/0/Ids
     * And the Target field is only for ui. It is not really in the request.
     * 
     * @param {*} path 
     */
    removeFirstFieldFromPath(path) {
        return '/' + path.split('/').slice(2).join('/');
    }

    /**
     * The function gets a step number, and a path, and the method checks if there is an ancestor for this
     * path, that is disabled. If there is, the function returns true.
     * 
     * Why the function isPathExists is not good enough? because, if a field is in array element, and the
     * element is disabled, the next element in the array will take place, and the link will work on this element,
     * instead of the original
     * @param {number} stepNumber 
     * @param {string} path 
     */
    isAncestorDisabled(stepNumber, path) {
        var stepDisabledFields = this.context.data.currScenario.steps[stepNumber].disabledFields;
        return stepDisabledFields.some(disabledField => {
            var disabledFieldWithNoFirstField = this.removeFirstFieldFromPath(disabledField);
            return path.includes(disabledFieldWithNoFirstField + '/') || path == disabledFieldWithNoFirstField;
        });
    }


    applyLink(link, generatedSteps, currStep, currStepNumber) {
        var linkedStepJson = generatedSteps[link.fromStep].Entities; //TODO, when creating several entities in request, replace it
        var fromPath = this.removeFirstFieldFromPath(link.fromPath);
        var toPath = this.removeFirstFieldFromPath(link.toPath);

        console.log('is ' + this.isPathExists(linkedStepJson, fromPath));
        console.log('is ' + this.isPathExists(currStep.Entities, toPath));

        console.log('is ancestor from' + this.isAncestorDisabled(link.fromStep, fromPath));
        console.log('is ancestor to' + this.isAncestorDisabled(currStepNumber, toPath));


        if (!this.isAncestorDisabled(link.fromStep, fromPath) && !this.isAncestorDisabled(currStepNumber, toPath) &&
            this.isPathExists(linkedStepJson, fromPath) && this.isPathExists(currStep.Entities, toPath)) {
            var linkedValue = fromPath.split('/').splice(1).reduce((o, n) => o[n], linkedStepJson);



            if (linkedValue) {
                this.setToValue(currStep.Entities, toPath, linkedValue);
            }
        }

    }
    //#endregion

    //#region ng request functions
    getNgRequestOptions(ngEnv, body, entityType, requestMethod) {
        var requestOptions = {};

        if (ngEnv == "localhost") {
            requestOptions = {
                method: requestMethod,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            };
        } else {
            requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    entities: [{
                        method: requestMethod,
                        entity: entityType,
                        ngUrl: NgUrlsMap[ngEnv].actualUrl,
                        data: body
                    }]
                })
            };
        }

        return requestOptions;
    }

    getNgRequestFinalUrl(ngEnv, entityType) {
        var finalUrl = NgUrlsMap[ngEnv].endpoint;

        if (ngEnv == "localhost") {
            finalUrl += '/' + entityType;
        }

        return finalUrl;
    }

    openErrorPopup(error) {
        this.state.isErrorPopupOpen = true;
        this.state.errorDescriptionForPopup = error;
        this.setState(this.state);
    }

    createWarningToast(error) {
        toast.warn(
            () =>
                <div>
                    <span style={{ color: 'black' }}>Error while sending request. </span> <a className="error-link" onClick={() => this.openErrorPopup(error)}>Click here to see why</a>
                </div>
            , toastProperties);
    }

    createErrorToast(error) {
        toast.error(
            () =>
                <div>
                    Could not send request. <a className="error-link" onClick={() => this.openErrorPopup(error)}>Click here to see why</a>
                </div>
            , toastProperties);
    }

    sendSingleStepToNg(stepIndex) {
        var currStep = this.context.data.currScenario.steps[stepIndex];
        var currStepRequest = this.getStepNgRequest(stepIndex);

        console.log('sending json to ng ' + JSON.stringify(currStepRequest));

        // easter egg?
        var idfId = currStepRequest.Entities[0].Ids.name;
        if (idfId.includes('מותר')) {
            this.state.isMemePopupOPen = true;
            this.setState(this.state);
        }
        // easter egg?

        var requestMethod = currStep.action;
        var entityType = currStep.entity;

        var requestOptions = this.getNgRequestOptions(this.context.data.ngEnv, currStepRequest, entityType, requestMethod);
        var requestFinalUrl = this.getNgRequestFinalUrl(this.context.data.ngEnv, entityType);

        toast.info('Sending...', toastProperties);

        fetch(requestFinalUrl, requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.isSuccess) {
                    toast.success("Sent step " + stepIndex + " successfully", toastProperties);
                } else {
                    this.createWarningToast(data.response);
                }
            }).catch(error => {
                var errorObj = [{
                    message: 'Error while sending request to hummus server'
                }];

                this.createErrorToast(errorObj);
            });

    }

    /**
     * The function sends all the steps. if to localhost, to localhost, else , to ng.
     */
    sendAllSteps() {
        if (this.context.data.ngEnv == "localhost") {
            this.sendAllStepsToLocalhost();
        } else {
            this.sendAllStepsToNg();
        }
    }

    /**
     * The function sends single step as part of the whole steps, to localhost. With delay.
     * The function sends the request with stepIndex* 3000 as delay, so each step will be sent
     * with several seconds in between.
     * 
     * @param {integer} stepIndex 
     * @param {array} generatedSteps - an array of the previous steps, generated json
     */
    sendOneStepToLocalhost(stepIndex, generatedSteps) {
        setTimeout(function () {
            console.log('hello ' + stepIndex);
            var currStep = this.context.data.currScenario.steps[stepIndex];
            var currStepRequest = this.getStepNgRequest(stepIndex);
            generatedSteps.push(currStepRequest);

            // Apply all links created
            for (var linkIndex in currStep.links) {
                this.applyLink(currStep.links[linkIndex], generatedSteps, currStepRequest, stepIndex);
            }

            console.log('sending json to ng ' + JSON.stringify(currStepRequest));

            var requestMethod = currStep.action;
            var entityType = currStep.entity;

            const requestOptions = {
                method: requestMethod,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(currStepRequest)
            };

            toast.info("Sending...", toastProperties);

            fetch(NgUrlsMap["localhost"].actualUrl + '/' + entityType, requestOptions)
                .then(response => response.json())
                .then(data => {
                    toast.success("Sent successfully", toastProperties);
                }).catch(error => {
                    var errorObj = [{
                        message: 'Error while sending request to localhost server. Maybe the server is not started properly.'
                    }];

                    this.createErrorToast(errorObj);
                });
        }.bind(this), 1000 * stepIndex)
    }


    /**
     * The function sends all steps directly to localhost. The web sends directly to localhost the steps, with 
     * delay between them, so the mesarim will be written before the next ones.
     */
    sendAllStepsToLocalhost() {
        var generatedSteps = [];
        for (var stepIndex in this.context.data.currScenario.steps) {
            this.sendOneStepToLocalhost(stepIndex, generatedSteps);
        }
    }

    /**
     * The function sends all steps to ng. The web sends to the server, and the server sends to ng (dev/sadab)
     */
    sendAllStepsToNg() {
        var generatedSteps = [];
        var entitiesToRequest = [];
        for (var stepIndex in this.context.data.currScenario.steps) {
            setTimeout(function () { console.log('here') }, 1000 * stepIndex);

            var currStep = this.context.data.currScenario.steps[stepIndex];
            var currStepRequest = this.getStepNgRequest(stepIndex);
            generatedSteps.push(currStepRequest);

            // Apply all links created
            for (var linkIndex in currStep.links) {
                this.applyLink(currStep.links[linkIndex], generatedSteps, currStepRequest, stepIndex);
            }

            console.log('sending json to ng ' + JSON.stringify(currStepRequest));


            var requestMethod = currStep.action;
            var entityType = currStep.entity;
            entitiesToRequest.push({
                method: requestMethod,
                entity: entityType,
                ngUrl: NgUrlsMap[this.context.data.ngEnv].actualUrl,
                data: currStepRequest
            })

        }

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                entities: entitiesToRequest
            })
        };

        const toastProperties = {
            autoClose: 2000,
            position: toast.POSITION.BOTTOM_RIGHT,
            pauseOnFocusLoss: false
        };

        toast.info("Sending...", toastProperties);

        fetch('/NgRequest', requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.isSuccess) {
                    toast.success("Sent step " + stepIndex + " successfully", toastProperties);
                } else {
                    this.createWarningToast(data.response);
                }
            }).catch(error => {
                var errorObj = [{
                    message: 'Error while sending request to hummus server'
                }];

                this.createErrorToast(errorObj);
            });
    }
    //#endregion

    close() {
        console.log('closing popup')
        this.state.isJsonPopupOpen = false;
        this.state.isSavePopupOpen = false;
        this.state.isErrorPopupOpen = false;
        this.state.isMemePopupOPen = false;
        this.setState(this.state);
    }

    getStepsOptions() {
        var options = [];
        for (var index in this.context.data.currScenario.steps) {
            var currStep = this.context.data.currScenario.steps[index];
            options.push(
                <option key={index + '-' + currStep.name}>{index} - {currStep.name}</option>
            )
        }

        return options;
    }

    onStepChange(event) {
        var selectOptionString = event.target.value;
        var selectedStepAsInt = parseInt(selectOptionString);
        this.context.data.currOpenStep = selectedStepAsInt;
        this.setState(this.state);
    }

    createStepTemplate() {

        var step = {
            "name": "צעד",
            "jsonMap": FullEntitiesMap,
            "entity": "English",
            "system": "Tal",
            "reality": "0",
            "action": "POST",
            "version": "2",
            "jsonToEdit": FullEntitiesMap["English"]["2"].data,
            "links": [],
            "disabledFields": []
        }

        step.disabledFields = JSON.parse(JSON.stringify(step.jsonMap["English"]["2"].disabledFields));
        return step;
    }


    componentDidMount() {
        this.context.data.currScenario.steps = [];
        this.context.data.currScenario.steps.push(this.createStepTemplate());
        this.context.updateData(this.context);
    }

    addStep() {
        this.context.data.currScenario.steps.push(this.createStepTemplate());
        this.context.data.currOpenStep = this.context.data.currScenario.steps.length - 1;
        this.context.updateData(this.context);
        this.setState(this.state);
    }

    removeStep() {
        if (this.context.data.currScenario.steps.length >= 2) {


            this.context.data.currScenario.steps.splice(this.context.data.currOpenStep, 1);

            if (this.context.data.currOpenStep > 0) {
                this.context.data.currOpenStep--;
            }

            this.context.updateData(this.context);
            this.setState(this.state)
        } else {
            const toastProperties = {
                autoClose: 4000,
                position: toast.POSITION.BOTTOM_RIGHT,
                pauseOnFocusLoss: false
            };

            toast.error("You must have at least one scenario", toastProperties);
        }
    }

    render() {
        return (
            <Styles>
                <HummusConsumer>
                    {(context) =>

                        <div className='main-comp'>

                            <Popup
                                open={this.state.isMemePopupOPen}
                                onClose={() => this.close()}
                                modal
                                closeOnDocumentClick
                            >
                                <center>
                                    <img style={{ width: '50%', height: '100%' }} src="./memes/moter1.png" alt="animated" />\
                                </center>
                            </Popup>


                            <ToastContainer />

                            <JsonPopup
                                json={JSON.stringify(this.state.json)}
                                bombaJson={JSON.stringify(this.state.bombaJson)}
                                onClose={() => this.close()}
                                isOpen={this.state.isJsonPopupOpen} />

                            <ErrorPopup
                                error={this.state.errorDescriptionForPopup}
                                onClose={() => this.close()}
                                isOpen={this.state.isErrorPopupOpen} />

                            {/** remove the propery scenarioData, so the component wil take from */}
                            <SaveScenarioPopup
                                scenarioData={this.state.scenarioData}
                                onClose={() => this.close()}
                                scenariosHierarchy={this.state.scenariosHierarchy}
                                isOpen={this.state.isSavePopupOpen} />

                            <Form>
                                <div dir='rtl' className='metadata'>
                                    <Row className='field'>
                                        <Col lg='1'>
                                            <Form.Label >שם תרחיש</Form.Label>
                                        </Col>
                                        <Col lg='3'>
                                            <Form.Control
                                                onChange={(event) => {
                                                    context.data.currScenario.name = event.target.value;
                                                    context.updateData(context)
                                                }}
                                                value={context.data.currScenario.name}
                                                ref={(ref) => this.scenarioNameNode = ref}
                                                type="text" />
                                        </Col>
                                        <Col lg='6'>

                                            {/* creating the sending button, which sends the json to NG */}
                                            <Popup
                                                className="action-btn"
                                                position="bottom center"
                                                on="hover"
                                                trigger={
                                                    <a style={{ paddingTop: 60 }} id="openSavePopupBtn" className="action-btn" variant="outline-info" onClick={() => this.openSavePopup()}>
                                                        <i className="far fa-save"></i>
                                                    </a>}
                                            >
                                                <center style={{ overflowWrap: 'break-word' }}>
                                                    שמור
                                                </center>
                                            </Popup>

                                            {/* creating the button '</>', which shows the json */}
                                            <Popup

                                                position="bottom center"
                                                on="hover"
                                                trigger={
                                                    <a style={{ marginRight: 3 }} id="showJsonBtn" className="action-btn" variant="outline-info" onClick={() => this.openJsonPopup()}>
                                                        <span><b> {"{..}"} </b></span>
                                                    </a>}
                                            >
                                                <center>
                                                    הצג JSON
                                                </center>
                                            </Popup>

                                            {/* creating the sending button, which sends the json to NG */}
                                            <Popup
                                                className="action-btn"
                                                position="bottom center"
                                                on="hover"
                                                trigger={
                                                    <a style={{ marginRight: 3 }} className="action-btn" id="sendStepBtn" variant="outline-info" onClick={() => this.sendSingleStepToNg(this.context.data.currOpenStep)}>
                                                        <i className="far fa-paper-plane fa-flip-horizontal"></i>
                                                    </a>}
                                            >
                                                <center>
                                                    שלח צעד נוכחי
                                                </center>
                                            </Popup>

                                            {/* creating the sending button, which sends the json to NG */}
                                            <Popup
                                                className="action-btn"
                                                position="bottom center"
                                                on="hover"
                                                trigger={
                                                    <a className="action-btn" variant="outline-info" onClick={() => this.sendAllSteps()}>
                                                        <i className="fas fa-broom fa-flip-horizontal"></i>
                                                    </a>}
                                            >
                                                <center>
                                                    שלח הכל
                                                </center>
                                            </Popup>
                                        </Col>
                                    </Row>

                                    <Row className='field'>
                                        <Col lg='1'>
                                            <Form.Label >תיאור תרחיש</Form.Label>
                                        </Col>
                                        <Col lg='5'>
                                            <Form.Control
                                                style={{ height: 50 }}
                                                onChange={(event) => {
                                                    context.data.currScenario.description = event.target.value;
                                                    context.updateData(context)
                                                }}
                                                value={context.data.currScenario.description}
                                                ref={(ref) => this.scenarioDescriptionNode = ref}
                                                as="textarea"
                                                rows="3" />
                                        </Col>
                                    </Row>

                                    <Row className='field' style={{ marginBottom: 0 }}>
                                        <Col lg='1'>
                                            <Form.Label >צעד</Form.Label>
                                        </Col>
                                        <Col lg='2'>
                                            <Form.Control
                                                onChange={(event) => this.onStepChange(event)}
                                                value={this.getStepsOptions()[this.context.data.currOpenStep].props.children.join('')}
                                                ref={(ref) => this.actionNode = ref}
                                                as="select">

                                                {this.getStepsOptions()}

                                            </Form.Control>
                                        </Col>

                                        <Col lg='1'>
                                            <Form.Label >שם צעד</Form.Label>
                                        </Col>
                                        <Col lg='2'>



                                            <InputGroup dir="ltr" >
                                                <InputGroup.Prepend >
                                                    <InputGroup.Text id="inputGroupPrepend">

                                                        <Popup
                                                            className="action-btn"
                                                            position="bottom center"
                                                            on="hover"
                                                            trigger={
                                                                <i className="fas step-info fa-info-circle mt-1"></i>}
                                                        >
                                                            <center style={{ overflowWrap: 'break-word', whiteSpace: 'normal' }} dir="rtl">
                                                                כל צעד הוא בקשת כתיבה. בכל בקשת כתיבה אפשר לכתוב סוג ישות אחד, אבל מספר ישויות.
                                                </center>

                                                        </Popup>

                                                    </InputGroup.Text>
                                                </InputGroup.Prepend>
                                                <Form.Control
                                                    dir="rtl"
                                                    onChange={(event) => {
                                                        context.data.currScenario.steps[this.context.data.currOpenStep].name = event.target.value;
                                                        context.updateData(context)
                                                    }}
                                                    value={context.data.currScenario.steps[this.context.data.currOpenStep].name}
                                                    ref={(ref) => this.scenarioNameNode = ref}
                                                    type="text"
                                                />
                                            </InputGroup>

                                        </Col>


                                        <Col lg="1">
                                            <Popup

                                                position="bottom center"
                                                on="hover"
                                                trigger={
                                                    <a className="step-action-btn" variant="outline-info" onClick={() => this.addStep()}>
                                                        <i id="addStepBtn" className="fas fa-plus"></i>
                                                    </a>}
                                            >
                                                <center>
                                                    הוסף צעד
                                                </center>
                                            </Popup>

                                            <Popup

                                                position="bottom center"
                                                on="hover"
                                                trigger={
                                                    <a id="removeStepBtn" className="step-action-btn" style={{ marginRight: 20 }} variant="outline-info" onClick={() => this.removeStep()}>
                                                        <i className="fas fa-minus"></i>
                                                    </a>}
                                            >
                                                <center>
                                                    מחק צעד
                                                </center>
                                            </Popup>
                                        </Col>

                                        {/** not used checkbox, to annoy the client */}
                                        <Col lg="3">
                                            <div dir="rtl" style={{ float: 'right', paddingTop: 10 }}>
                                                <input
                                                    style={{ marginLeft: 10 }}
                                                    dir="rtl"
                                                    type="checkbox"
                                                    defaultChecked={true}
                                                    id="exampleCheck1" />
                                                <label for="exampleCheck1">האם טלטלה פעיל</label>
                                            </div>
                                        </Col>
                                    </Row>
                                    <div dir="rtl" class="form-check">

                                    </div>

                                    <Row className='field' dir="rtl" rtl>

                                    </Row>



                                    <hr className="seperator" />

                                </div>



                                <NgRequestEditor
                                    openStepIndex={this.context.data.currOpenStep}
                                    ref={this.ngRequestEditorRef} />
                            </Form>

                        </div>
                    }
                </HummusConsumer>


            </Styles>
        )
    }
}

export default Scenario;