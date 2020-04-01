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

import english_2 from '../jsonFormats/english_2.json'
import math_2 from '../jsonFormats/math_2.json'
import chemistry_2 from '../jsonFormats/chemistry_2.json'

import english_x from '../jsonFormats/english_x.json'
import math_x from '../jsonFormats/math_x.json'
import chemistry_x from '../jsonFormats/chemistry_x.json'

const Styles = styled.div`



.main-comp {
    padding-right: 50px;
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

class NGRequest extends React.Component {

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
                    name: '',
                    description: '',
                    entity: 'אנגלית',
                    system: 'טל',
                    reality: 'א',
                    action: 'יצירה',
                    version: '2'
                }]
            },
        }

        this.entityMap = {
            "אנגלית": "English",
            "חשבון": "Math",
            "כמיה": "Chemistry"
        }
        this.systemMap = {
            "טל": "Tal",
            "ינון": "Inon"
        }
        this.realityMap = {
            "א": "0",
            "ב": "100",
            "ג": "200"
        }
        this.actionMap = {
            "יצירה": "POST",
            "עדכון": "PUT",
            "מחיקה": "DELETE"
        }

    }

    componentDidMount() {

        this.context.data.currScenario.steps[0].jsonMap = {
            "אנגלית": {
                "2": JSON.stringify(english_2),
                "X": JSON.stringify(english_x)
            },
            "חשבון": {
                "2": JSON.stringify(math_2),
                "X": JSON.stringify(math_x)
            },
            "כמיה": {
                "2": JSON.stringify(chemistry_2),
                "X": JSON.stringify(chemistry_x),
            }
        }

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ path: '/tal/test3' })
        };

        fetch('/scenarioFile', requestOptions)
            .then(response => response.json())
            .then(data => {
                console.log('here work')
                this.context.data.currScenario.steps[0] = data.steps[0];
                this.setState(this.state);
            }).catch(error => {
                console.error("dont work : ", error);
            });

        this.context.data.currScenario.steps[0].jsonToEdit = JSON.stringify(english_2);
        this.context.data.currScenario.steps[0].entity = 'English';
        this.context.data.currScenario.steps[0].system = 'Tal';
        this.context.data.currScenario.steps[0].reality = '0';
        this.context.data.currScenario.steps[0].action = 'POST';
        this.context.data.currScenario.steps[0].version = 'X';

        this.context.data.currScenario.steps[0].fullJsonToEdit = JSON.stringify(english_2);

        this.state.expandAll = false;
    }

    openSavePopup() {
        this.state.isSavePopupOpen = true;
        this.loadScenarioToState();

        this.setState(this.state);
    }

    openJsonPopup() {
        this.state.json = this.child.current.getTotalJson();
        this.state.isJsonPopupOpen = true;
        this.setState(this.state);
    }

    expendAll() {
        this.setState({ expandAll: !this.state.expandAll })
    }

    onMetadataChange(event, key) {
        this.context.data.currScenario.steps[0][key] = event.target.value;
        this.setState(this.state);
    }

    loadScenarioToState() {
        
        this.state.scenarioData.steps[0].name = this.context.data.currScenario.steps[0].name;
        this.state.scenarioData.steps[0].description = this.context.data.currScenario.steps[0].description;

        this.state.scenarioData.steps[0].fullJsonToEdit = this.context.data.currScenario.steps[0].fullJsonToEdit;
        this.state.scenarioData.steps[0].jsonToEdit = this.context.data.currScenario.steps[0].jsonToEdit;

        this.state.scenarioData.steps[0].entity = this.context.data.currScenario.steps[0].entity;
        this.state.scenarioData.steps[0].system = this.context.data.currScenario.steps[0].system;
        this.state.scenarioData.steps[0].reality = this.context.data.currScenario.steps[0].reality;
        this.state.scenarioData.steps[0].action = this.context.data.currScenario.steps[0].action;
        this.state.scenarioData.steps[0].version = this.context.data.currScenario.steps[0].version;

        

    }
    

    sendJsonToNG() {
        var entityJson = this.child.current.getTotalJson();
        var sendingJson = {
            "Entity": this.entityMap[this.entityNode.value],
            "SendingTime": new Date().toISOString(),
            "Reality": this.realityMap[this.realityNode.value],
            "Version": this.versionNode.value,
            "System": this.systemMap[this.systemNode.value],
            "Entities": [entityJson]
        }


        var bodyJ = JSON.stringify({
            nameA: "paul rudd",
            moviesA: ["I Love You Man", "Role Models"]
        });

        var requestMethod = this.actionMap[this.actionNode.value];

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

        console.log(JSON.stringify(sendingJson));
    }

    getChosenJson() {
        var chosenEntity = this.entityNode.value;
        var chosenVersion = this.versionNode.value;

        return this.context.data.currScenario.steps[0].jsonMap[chosenEntity][chosenVersion];
    }

    loadJson() {
        var chosenJson = this.getChosenJson();
        this.context.data.currScenario.steps[0].jsonToEdit = chosenJson;
        this.context.data.currScenario.steps[0].fullJsonToEdit = chosenJson;
        this.setState(this.state);
    }

    close() {
        console.log('closing popup')
        this.state.isJsonPopupOpen = false;
        this.state.isSavePopupOpen = false;
        this.setState(this.state);
    }

    updateRequest(event) {
        this.context.data.currScenario.steps[0].jsonToEdit = JSON.stringify(event.newJson);
        var chosenEntity = this.entityNode.value;
        var chosenVersion = this.versionNode.value;

        this.context.data.currScenario.steps[0].jsonMap[chosenEntity][chosenVersion] = this.context.data.currScenario.steps[0].jsonToEdit;
    }

    render() {
        return (
            <Styles>
                <p>ng context + {this.context.data.msg}</p>

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
                                                onChange={(event) => this.onMetadataChange(event, 'name')}
                                                value={context.data.currScenario.steps[0].name}
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
                                                onChange={(event) => this.onMetadataChange(event, 'description')}
                                                value={context.data.currScenario.steps[0].description}
                                                ref={(ref) => this.scenarioDescriptionNode = ref}
                                                as="textarea"
                                                rows="3" />
                                        </Col>
                                    </Row>

                                    <hr style={{ width: '80%' }} />

                                    <Row className='field'>
                                        <Col lg='1' >
                                            <Form.Label >ישות</Form.Label>
                                        </Col>
                                        <Col lg='2'>
                                            <Form.Control
                                                onChange={(event) => { this.loadJson(); this.onMetadataChange(event, 'entity') }}
                                                value={context.data.currScenario.steps[0].entity}
                                                ref={(ref) => this.entityNode = ref}
                                                as="select">
                                                <option>אנגלית</option>
                                                <option>חשבון</option>
                                                <option>כמיה</option>
                                            </Form.Control>
                                        </Col>



                                        <Col lg='1' >
                                            <Form.Label >סוג בקשה</Form.Label>
                                        </Col>
                                        <Col lg='2'>
                                            <Form.Control
                                                onChange={(event) => this.onMetadataChange(event, 'action')}
                                                value={context.data.currScenario.steps[0].action}
                                                ref={(ref) => this.actionNode = ref}
                                                as="select">
                                                <option>יצירה</option>
                                                <option>עדכון</option>
                                                <option>מחיקה</option>
                                            </Form.Control>
                                        </Col>

                                        <Col lg='1' >
                                            <Form.Label >מערכת</Form.Label>
                                        </Col>
                                        <Col lg='2'>
                                            <Form.Control
                                                onChange={(event) => this.onMetadataChange(event, 'system')}
                                                value={context.data.currScenario.steps[0].system}
                                                ref={(ref) => this.systemNode = ref}
                                                as="select">
                                                <option>טל</option>
                                                <option>ינון</option>
                                            </Form.Control>
                                        </Col>

                                    </Row>

                                    <Row className='field'>
                                        <Col lg='1'>
                                            <Form.Label >תקן</Form.Label>
                                        </Col>
                                        <Col lg='2'>
                                            <Form.Control
                                                onChange={(event) => { this.loadJson(); this.onMetadataChange(event, 'version') }}
                                                value={context.data.currScenario.steps[0].version}
                                                ref={(ref) => this.versionNode = ref}
                                                as="select">

                                                <option>2</option>
                                                <option>X</option>
                                            </Form.Control>
                                        </Col>
                                        <Col lg='1'>
                                            <Form.Label >שיעור</Form.Label>
                                        </Col>
                                        <Col lg='2'>
                                            <Form.Control
                                                onChange={(event) => this.onMetadataChange(event, 'reality')}
                                                value={context.data.currScenario.steps[0].reality}
                                                ref={(ref) => this.realityNode = ref}
                                                as="select" >

                                                <option>א</option>
                                                <option>ב</option>
                                                <option>ג</option>
                                            </Form.Control>
                                        </Col>
                                    </Row>
                                </div>

                                <Row dir='rtl'>
                                    <Col lg='10'>



                                    </Col>
                                </Row>

                                <Row dir='rtl'>

                                    <Col lg='10' className='entity-editor-window'>
                                        <Button style={{ top: 20, right: 20, position: 'absolute' }} variant="outline-info" onClick={() => this.expendAll()}>
                                            {
                                                this.state.expandAll &&
                                                <i class="fas fa-compress-alt"></i>
                                            }
                                            {!this.state.expandAll &&
                                                <i class="fas fa-expand-alt"></i>
                                            }
                                        </Button>

                                        <EntityEditor
                                            parentPath=''
                                            expandAll={this.state.expandAll}
                                            ref={this.child}
                                            level='0'
                                            fullJson={context.data.currScenario.steps[0].fullJsonToEdit}
                                            jsondata={context.data.currScenario.steps[0].jsonToEdit}
                                            onInnerFieldChanged={(event) => this.updateRequest(event)} ></EntityEditor>

                                    </Col>
                                </Row>


                            </Form>

                        </div>
                    }
                </HummusConsumer>


            </Styles>
        )
    }
}

export default NGRequest;