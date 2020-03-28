import React from 'react';
import styled from 'styled-components';
import { Nav, Button, Form, FormControl, Col, Row } from 'react-bootstrap';
import { JSONEditor } from 'react-json-editor-viewer';
import EntityEditor from './EntityEditor';
import Popup from "reactjs-popup";
import ReactJson from 'react-json-view'
import JsonPopup from './JsonPopup'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
    margin-right: 5px;
}
`;

class NGRequest extends React.Component {

    constructor(props) {
        super(props)
        this.child = React.createRef();
        this.state = {
            json: {},
            isOpenPopup: false
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


        this.jsonMap = {
            "אנגלית": {
                "2": JSON.stringify(english_2),
                "X" : JSON.stringify(english_x)
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

        this.state.jsonToEdit = JSON.stringify(english_2);
        this.state.fullJsonToEdit = JSON.stringify(english_2);
    }

    openPopup() {
        this.state.json = this.child.current.getTotalJson();
        this.state.isOpenPopup = true;
        this.setState(this.state);
    }

    expendAll() {
        this.child.current.expendAll();
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

        var requestMethod = this.actionMap[this.actionNode.value]

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
        
        return this.jsonMap[chosenEntity][chosenVersion];
    }

    loadJson() {      
        var chosenJson = this.getChosenJson();
        
        this.setState({jsonToEdit: chosenJson, fullJsonToEdit: chosenJson});
    }

    close() {
        console.log('closing popup')
        this.state.isOpenPopup = false;
        this.setState(this.state);
    }

    render() {
        return (
            <Styles>
                <div className='main-comp'>

                    <ToastContainer />
                    <JsonPopup json={JSON.stringify(this.state.json)} onClose={() => this.close()} isOpen={this.state.isOpenPopup} />


                        {/* TODO: 
                            6) handle field which is array of int
                            9) add button to expend all (fields), and collapse all
                            10) add info button (i) which on hover, it will show popup with hebrew info about the field 
                            12) fix the little jumps between the fields when extend and collapse the object fields and array fields
                        */}
                    <Form>
                        <div dir='rtl' className='metadata'>
                            <Row className='field'>
                                <Col lg='1'>
                                    <Form.Label >שם תרחיש</Form.Label>
                                </Col>
                                <Col lg='3'>
                                    <Form.Control ref={(ref) => this.scenarioNameNode = ref} type="text" />
                                </Col>
                                <Col lg='6'>

                                    {/* creating the sending button, which sends the json to NG */}
                                    <Popup
                                        className="action-btn"
                                        position="bottom center"
                                        on="hover"
                                        trigger={
                                            <Button className="action-btn" variant="outline-info" onClick={() => this.sendJsonToNG()}>
                                                <i class="far fa-save fa-2x fa-flip-horizontal"></i>
                                            </Button>}
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
                                            <Button className="action-btn" variant="outline-info" onClick={() => this.openPopup()}>
                                                <i class="fas fa-code fa-2x"></i>
                                            </Button>}
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
                                            <Button className="action-btn" variant="info" onClick={() => this.sendJsonToNG()}>
                                                <i class="far fa-paper-plane fa-2x fa-flip-horizontal"></i>
                                            </Button>}
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
                                    <Form.Control ref={(ref) => this.scenarioDescriptionNode = ref} as="textarea" rows="3" />
                                </Col>
                            </Row>

                            <hr style={{ width: '80%' }} />
                            
                            <Row className='field'>
                                <Col lg='1' >
                                    <Form.Label >ישות</Form.Label>
                                </Col>
                                <Col lg='2'>
                                    <Form.Control onChange={(event) => this.loadJson() } ref={(ref) => this.entityNode = ref} as="select">
                                        <option>אנגלית</option>
                                        <option>חשבון</option>
                                        <option>כמיה</option>
                                    </Form.Control>
                                </Col>

                                <Col lg='1' >
                                    <Form.Label >סוג בקשה</Form.Label>
                                </Col>
                                <Col lg='2'>
                                    <Form.Control ref={(ref) => this.actionNode = ref} as="select">
                                        <option>יצירה</option>
                                        <option>עדכון</option>
                                        <option>מחיקה</option>
                                    </Form.Control>
                                </Col>

                                <Col lg='1' >
                                    <Form.Label >מערכת</Form.Label>
                                </Col>
                                <Col lg='2'>
                                    <Form.Control ref={(ref) => this.systemNode = ref} as="select">
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
                                    <Form.Control onChange={(event) => this.loadJson() } ref={(ref) => this.versionNode = ref} as="select">
                                        <option>2</option>
                                        <option>X</option>
                                    </Form.Control>
                                </Col>
                                <Col lg='1'>
                                    <Form.Label >שיעור</Form.Label>
                                </Col>
                                <Col lg='2'>
                                    <Form.Control ref={(ref) => this.realityNode = ref} as="select" >
                                        <option>א</option>
                                        <option>ב</option>
                                        <option>ג</option>
                                    </Form.Control>
                                </Col>
                            </Row>
                        </div>

                        <Row dir='rtl'>
                            <Col lg='10'>

                            <Button variant="outline-info" onClick={() => this.expendAll()}>
                                                expend all
                                            </Button>

                            </Col>
                        </Row>

                        <Row dir='rtl'>
                            <Col className='entity-editor-window' lg='10'>
                                <EntityEditor 
                                    ref={this.child}
                                    level='0'
                                    fullJson={this.state.fullJsonToEdit}
                                    jsondata={this.state.jsonToEdit}
                                    onInnerFieldChanged={(event)=> this.state.jsonToEdit=JSON.stringify(event.newJson)} ></EntityEditor>

                            </Col>
                        </Row>


                    </Form>

                </div>
            </Styles>
        )
    }
}

export default NGRequest;