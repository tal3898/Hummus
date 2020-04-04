import React from 'react';
import styled from 'styled-components';
import { Form, Col, Row } from 'react-bootstrap';
import JsonPopup from './JsonPopup';
import SaveScenarioPopup from './SaveScenarioPopup';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import HummusContext, { HummusConsumer } from './HummusContext'
import NgRequestEditor from './NgRequestEditor';
import Popup from "reactjs-popup";
import {convertJsonTemplateToActualJson} from './Utility'
import ActionMap from '../globals/ActionMap.json'

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
}

.action-btn:hover {
    color: #0091ea;
    cursor: pointer;
}

.action-btn:active {
    color: #01579b;
}

/* Large rounded green border */
.seperator {
    width: 80%;
    border: 0.05em solid grey;
    border-radius: 5px;
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
            isJsonPopupOpen: false,
            isSavePopupOpen: false,
            scenarioName: 'bbb',
            scenarioData: {
                steps: [{
                    entity: 'אנגלית',
                    system: 'טל',
                    reality: 'א',
                    action: 'יצירה',
                    version: '2'
                }]
            },
            openStepIndex: 0
        }

        this.ngRequestEditorRef = React.createRef();

    }

    openSavePopup() {
        this.state.isSavePopupOpen = true;
        this.loadScenarioToState();

        this.setState(this.state);
    }

    openJsonPopup() {
        this.state.json = this.ngRequestEditorRef.current.getFullRequestJson();
        this.state.isJsonPopupOpen = true;
        this.setState(this.state);
    }

    onMetadataChange(event, key) {
        this.context.data.currScenario.steps[this.state.openStepIndex][key] = event.target.value;
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
        var entityJson = convertJsonTemplateToActualJson(currStepJson);

        var fullRequestJson = {
            "Entity": this.context.data.currScenario.steps[stepNumber].entity,
            "SendingTime": new Date().toISOString(),
            "Reality": this.context.data.currScenario.steps[stepNumber].reality,
            "Version": this.context.data.currScenario.steps[stepNumber].version,
            "System": this.context.data.currScenario.steps[stepNumber].system,
            "Entities": [entityJson]
        }

        return fullRequestJson;
    }

    setToValue(obj, path, value) {
        var i;
        path = path.split('/');
        path.splice(0,1);
        for (i = 0; i < path.length - 1; i++)
            obj = obj[path[i]];
    
        obj[path[i]] = value;
    }

    applyLink(link, generatedSteps, currStep ) {
        var linkedStepJson = generatedSteps[link.fromStep].Entities[0]; //TODO, when creating several entities in request, replace it
        var linkedValue = link.fromPath.split('/').splice(1).reduce((o, n) => o[n], linkedStepJson);
        this.setToValue(currStep.Entities[0], link.toPath, linkedValue);
    }
    //#endregion

    sendJsonToNG() {
        var generatedSteps = [];
        for (var index in this.context.data.currScenario.steps) {
            var currStep = this.context.data.currScenario.steps[index];
            var currStepRequest = this.getStepNgRequest(index);
            generatedSteps.push(currStepRequest);

            // Apply all links created
            for (var index in currStep.links) {
                this.applyLink(currStep.links[index], generatedSteps, currStepRequest);
            }

            console.log('sending json to ng ' + JSON.stringify(currStepRequest));

            var bodyJ = JSON.stringify({
                nameA: "paul rudd",
                moviesA: ["I Love You Man", "Role Models"]
            });

            var requestMethod = currStep.action;

            const requestOptions = {
                method: requestMethod,
                headers: { 'Content-Type': 'application/json' },
                body: bodyJ
            };

            const toastProperties = {
                autoClose: 2000,
                position: toast.POSITION.BOTTOM_RIGHT,
                pauseOnFocusLoss: false
            };

            toast.warn("Sending", toastProperties);

            fetch('https://reqres.in/api/users', requestOptions)
                .then(response => response.json())
                .then(data => {
                    toast.success("Sent successfully", toastProperties);
                    console.log("NG response: " + JSON.stringify(data));
                }).catch(error => {
                    toast.error("Error sending write request", toastProperties);
                    console.error("NG error: ", error)
                });
        }
    }

    close() {
        console.log('closing popup')
        this.state.isJsonPopupOpen = false;
        this.state.isSavePopupOpen = false;
        this.setState(this.state);
    }

    getStepsOptions() {
        var options = [];
        for (var index in this.context.data.currScenario.steps) {
            var currStep = this.context.data.currScenario.steps[index];
            options.push(
                <option>{index} - {currStep.name}</option>
            )
        }

        return options;
    }

    onStepChange(event) {
        var selectOptionString = event.target.value;
        var selectedStepAsInt = parseInt(selectOptionString);
        this.state.openStepIndex = selectedStepAsInt;
        this.setState(this.state);
    }

    createStepTemplate() {
        return {
            "name": "צעד",
            "jsonMap": {
                "אנגלית": {
                    "2": "{\"Ids|[1]|מזהה ישות\":{\"name|string|[0]|שם ישות\":\"[GEN]\",\"code|number|[1]|קוד ישות\":\"0\"},\"Data|[0]\":{\"Location|[1]\":{\"a\":{\"b\":{\"c|string|[1]|תיאור מאוד ארוך ארוך ארוך של שדה מסוים שיכול להיות עם מלא דברים ובגלל זה התיאור מאוד מאוד ארוך\":\"stam\"}},\"Street|string|[1]\":\"Agadati\",\"number|number|[1]\":\"30\"},\"Info|string|[0]\":\"[GEN]\",\"Type|enum|[1]\":\"[\\\"20 - Second\\\", \\\"30 - Third\\\", \\\"40 - Forth\\\", \\\"50 - Fith\\\"]\",\"Angle|float|[0]|זווית של הבניין, נגיד של פיזה זה 27.3\":\"\",\"Trips|array|[0..1]|כל המקומות שהייתי בהם\":\"[ { \\\"value\\\": 1, \\\"label\\\": \\\"Paris - 1\\\" },  { \\\"value\\\": 1, \\\"label\\\": \\\"London - 2\\\" },  { \\\"value\\\": 3, \\\"label\\\": \\\"New York - 3\\\" }, { \\\"value\\\": 4, \\\"label\\\": \\\" Tel Aviv - 4\\\" } ]\"},\"Planing|[0..1]\":[{\"Goal|string|[1]\":\"learn piano\",\"Time|time|[1]\":\"[NOW]\"},{\"Goal|string|[1]\":\"learn piano\",\"Time|time|[1]\":\"[NOW]\"}]}",
                    "X": "{\"X_Ids\":{\"X_name|string\":\"[GEN]\",\"X_code|number\":\"0\"},\"X_Data\":{\"X_Location\":{\"X_Street|string\":\"Agadati\",\"X_number|number\":\"30\"},\"X_Info|string\":\"[GEN]\"},\"X_Planing\":[{\"X_Goal|string\":\"learn piano\",\"X_Way|string\":\"play piano\",\"X_Time|time\":\"[NOW]\"}]}"
                },
                "חשבון": {
                    "2": "{\"Ids|[1]|מזהה ישות\":{\"name|string|[0]|שם ישות\":\"[GEN]\",\"code|number|[1]|קוד ישות\":\"0\"},\"Chairs|[0]\":{\"Info|string|[0]\":\"[GEN]\",\"Type|enum|[1]\":\"[\\\"20 - Second\\\", \\\"30 - Third\\\", \\\"40 - Forth\\\", \\\"50 - Fith\\\"]\"}}",
                    "X": "{\"Ids_X|[1]|מזהה ישות\":{\"name_X|string|[0]|שם ישות\":\"[GEN]\",\"code_X|number|[1]|קוד ישות\":\"0\"},\"Chairs_X|[0]\":{\"Info_X|string|[0]\":\"[GEN]\",\"Type_X|enum|[1]\":\"[\\\"20 - Second\\\", \\\"30 - Third\\\", \\\"40 - Forth\\\", \\\"50 - Fith\\\"]\"}}"
                },
                "כמיה": {
                    "2": "{\"Ids\":{\"name|string\":\"[GEN]\",\"code|number\":\"0\"},\"Nothing|string\":\"\"}",
                    "X": "{\"X_Ids\":{\"X_name|string\":\"[GEN]\",\"X_code|number\":\"0\"},\"X_Nothing|string\":\"\"}"
                }
            },
            "jsonToEdit": "{\"Ids|[1]|מזהה ישות\":{\"name|string|[0]|שם ישות\":\"[GEN]\",\"code|number|[1]|קוד ישות\":\"0\"},\"Data|[0]\":{\"Location|[1]\":{\"a\":{\"b\":{\"c|string|[1]|תיאור מאוד ארוך ארוך ארוך של שדה מסוים שיכול להיות עם מלא דברים ובגלל זה התיאור מאוד מאוד ארוך\":\"stam\"}},\"Street|string|[1]\":\"Agadati\",\"number|number|[1]\":\"30\"},\"Info|string|[0]\":\"[GEN]\",\"Type|enum|[1]\":\"[\\\"20 - Second\\\", \\\"30 - Third\\\", \\\"40 - Forth\\\", \\\"50 - Fith\\\"]\",\"Angle|float|[0]|זווית של הבניין, נגיד של פיזה זה 27.3\":\"\",\"Trips|array|[0..1]|כל המקומות שהייתי בהם\":\"[ { \\\"value\\\": 1, \\\"label\\\": \\\"Paris - 1\\\" },  { \\\"value\\\": 1, \\\"label\\\": \\\"London - 2\\\" },  { \\\"value\\\": 3, \\\"label\\\": \\\"New York - 3\\\" }, { \\\"value\\\": 4, \\\"label\\\": \\\" Tel Aviv - 4\\\" } ]\"},\"Planing|[0..1]\":[{\"Goal|string|[1]\":\"learn piano\",\"Time|time|[1]\":\"[NOW]\"},{\"Goal|string|[1]\":\"learn piano\",\"Time|time|[1]\":\"[NOW]\"}]}",
            "entity": "English",
            "system": "Tal",
            "reality": "0",
            "action": "POST",
            "version": "2",
            "fullJsonToEdit": "{\"Ids|[1]|מזהה ישות\":{\"name|string|[0]|שם ישות\":\"[GEN]\",\"code|number|[1]|קוד ישות\":\"0\"},\"Data|[0]\":{\"Location|[1]\":{\"a\":{\"b\":{\"c|string|[1]|תיאור מאוד ארוך ארוך ארוך של שדה מסוים שיכול להיות עם מלא דברים ובגלל זה התיאור מאוד מאוד ארוך\":\"stam\"}},\"Street|string|[1]\":\"Agadati\",\"number|number|[1]\":\"30\"},\"Info|string|[0]\":\"[GEN]\",\"Type|enum|[1]\":\"[\\\"20 - Second\\\", \\\"30 - Third\\\", \\\"40 - Forth\\\", \\\"50 - Fith\\\"]\",\"Angle|float|[0]|זווית של הבניין, נגיד של פיזה זה 27.3\":\"\",\"Trips|array|[0..1]|כל המקומות שהייתי בהם\":\"[ { \\\"value\\\": 1, \\\"label\\\": \\\"Paris - 1\\\" },  { \\\"value\\\": 1, \\\"label\\\": \\\"London - 2\\\" },  { \\\"value\\\": 3, \\\"label\\\": \\\"New York - 3\\\" }, { \\\"value\\\": 4, \\\"label\\\": \\\" Tel Aviv - 4\\\" } ]\"},\"Planing|[0..1]\":[{\"Goal|string|[1]\":\"learn piano\",\"Time|time|[1]\":\"[NOW]\"},{\"Goal|string|[1]\":\"learn piano\",\"Time|time|[1]\":\"[NOW]\"}]}",
            "links": []
        }
    }

    addStep() {
        this.context.data.currScenario.steps.push(this.createStepTemplate());
        this.state.openStepIndex = this.context.data.currScenario.steps.length - 1;
        this.context.updateData(this.context);
        this.setState(this.state);
    }

    removeStep() {
        if (this.context.data.currScenario.steps.length >= 2) {


            this.context.data.currScenario.steps.splice(this.state.openStepIndex, 1);

            if (this.state.openStepIndex > 0) {
                this.state.openStepIndex--;
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

                            <ToastContainer />
                            <JsonPopup
                                json={JSON.stringify(this.state.json)}
                                onClose={() => this.close()}
                                isOpen={this.state.isJsonPopupOpen} />

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
                                                    <a className="action-btn" variant="outline-info" onClick={() => this.openSavePopup()}>
                                                        <i class="far fa-save fa-3x"></i>
                                                    </a>}
                                            >
                                                <center>
                                                    שמור תרחיש
                                                </center>
                                            </Popup>

                                            {/* creating the button '</>', which shows the json */}
                                            <Popup

                                                position="bottom center"
                                                on="hover"
                                                trigger={
                                                    <a className="action-btn" variant="outline-info" onClick={() => this.openJsonPopup()}>
                                                        <i class="fas fa-code fa-3x"></i>
                                                    </a>}
                                            >
                                                <center>
                                                    הצג ג'יסון
                                                </center>
                                            </Popup>

                                            {/* creating the sending button, which sends the json to NG */}
                                            <Popup
                                                className="action-btn"
                                                position="bottom center"
                                                on="hover"
                                                trigger={
                                                    <a className="action-btn" variant="outline-info" onClick={() => this.sendJsonToNG()}>
                                                        <i class="fas fa-paper-plane fa-3x fa-flip-horizontal"></i>
                                                    </a>}
                                            >
                                                <center>
                                                    שלח בקשת כתיבה
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

                                    <Row className='field'>
                                        <Col lg='1'>
                                            <Form.Label >צעד</Form.Label>
                                        </Col>
                                        <Col lg='2'>
                                            <Form.Control
                                                onChange={(event) => this.onStepChange(event)}
                                                value={this.getStepsOptions()[this.state.openStepIndex].props.children.join('')}
                                                ref={(ref) => this.actionNode = ref}
                                                as="select">

                                                {this.getStepsOptions()}

                                            </Form.Control>
                                        </Col>

                                        <Col lg='1'>
                                            <Form.Label >שם צעד</Form.Label>
                                        </Col>
                                        <Col lg='2'>
                                            <Form.Control
                                                onChange={(event) => {
                                                    context.data.currScenario.steps[this.state.openStepIndex].name = event.target.value;
                                                    context.updateData(context)
                                                }}
                                                value={context.data.currScenario.steps[this.state.openStepIndex].name}
                                                ref={(ref) => this.scenarioNameNode = ref}
                                                type="text" />
                                        </Col>
                                        <Col lg="1">
                                            <Popup

                                                position="bottom center"
                                                on="hover"
                                                trigger={
                                                    <a className="plus-scenario-button" variant="outline-info" onClick={() => this.addStep()}>
                                                        <i class="fas fa-plus fa-2x"></i>
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
                                                    <a className="minus-scenario-button" style={{ marginRight: 20 }} variant="outline-info" onClick={() => this.removeStep()}>
                                                        <i class="fas fa-minus fa-2x"></i>
                                                    </a>}
                                            >
                                                <center>
                                                    מחק צעד
                                                </center>
                                            </Popup>
                                        </Col>

                                    </Row>

                                    <hr className="seperator" />

                                </div>

                                <NgRequestEditor
                                    openStepIndex={this.state.openStepIndex}
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