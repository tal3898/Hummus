import React from 'react';
import styled from 'styled-components';
import { Nav, Button, Form, FormControl, Col, Row } from 'react-bootstrap';
import { JSONEditor } from 'react-json-editor-viewer';
import EntityEditor from './EntityEditor';
import Popup from "reactjs-popup";
import ReactJson from 'react-json-view';
import JsonPopup from './JsonPopup';
import SaveScenarioPopup from './SaveScenarioPopup';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ScenariosWindow from './ScenariosWindow';
import HummusContext, { HummusConsumer } from './HummusContext'
import NgRequestEditor from './NgRequestEditor';

import ActionMap from '../globals/ActionMap.json'


const Styles = styled.div`



.main-comp {
    padding-right: 50px;
    margin-top:35px;
}

.entity-editor-window {
    height: 480px;
    overflow-y: scroll;
    margin-top: 10px;
    padding: 10px;
    background: #f5f5f5;   
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
        this.context.data.currScenario.steps[0][key] = event.target.value;
        this.context.updateData(this.context);
    }

    loadScenarioToState() {
        this.state.scenarioData.name = this.context.data.currScenario.name;
        this.state.scenarioData.description = this.context.data.currScenario.description;

        this.state.scenarioData.steps[0].jsonMap = this.context.data.currScenario.steps[0].jsonMap
        this.state.scenarioData.steps[0].fullJsonToEdit = this.context.data.currScenario.steps[0].fullJsonToEdit;
        this.state.scenarioData.steps[0].jsonToEdit = this.context.data.currScenario.steps[0].jsonToEdit;

        this.state.scenarioData.steps[0].entity = this.context.data.currScenario.steps[0].entity;
        this.state.scenarioData.steps[0].system = this.context.data.currScenario.steps[0].system;
        this.state.scenarioData.steps[0].reality = this.context.data.currScenario.steps[0].reality;
        this.state.scenarioData.steps[0].action = this.context.data.currScenario.steps[0].action;
        this.state.scenarioData.steps[0].version = this.context.data.currScenario.steps[0].version;
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
                                                    context.updateData(context)}}
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
                                                onChange={(event) => {
                                                    context.data.currScenario.description = event.target.value; 
                                                    context.updateData(context)}}
                                                value={context.data.currScenario.description}
                                                ref={(ref) => this.scenarioDescriptionNode = ref}
                                                as="textarea"
                                                rows="3" />
                                        </Col>
                                    </Row>

                                    <hr style={{ width: '80%' }} />

                                </div>

                                <NgRequestEditor ref={this.ngRequestEditorRef}/>
                                                    


                              


                            </Form>

                        </div>
                    }
                </HummusConsumer>


            </Styles>
        )
    }
}

export default Scenario;