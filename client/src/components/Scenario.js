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


    sendJsonToNG() {
        var fullRequestJson = this.ngRequestEditorRef.current.getFullRequestJson();

        var bodyJ = JSON.stringify({
            nameA: "paul rudd",
            moviesA: ["I Love You Man", "Role Models"]
        });

        var requestMethod = ActionMap[this.actionNode.value];

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

        console.log(JSON.stringify(fullRequestJson));
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
                                                        <i class="far fa-paper-plane fa-3x fa-flip-horizontal"></i>
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
                                                    context.data.currScenario.name = event.target.value;
                                                    context.updateData(context)
                                                }}
                                                value={context.data.currScenario.steps[this.state.openStepIndex].name}
                                                ref={(ref) => this.scenarioNameNode = ref}
                                                type="text" />
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