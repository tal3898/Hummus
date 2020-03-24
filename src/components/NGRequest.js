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

const Styles = styled.div`

.main-comp {
    padding-right: 50px;
}

.entity-editor-window {
    height: 400px;
    overflow-y: scroll;
    margin-top: 10px;
    padding: 10px;
    background: #f5f5f5;
    margin-top: 50px;   
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
            json: {
                "v": 2
            },
            isOpenPopup: false,
            versionValue: ""
        }



    }

    openPopup() {
        this.state.json = this.child.current.getTotalJson();
        this.state.isOpenPopup = true;
        this.setState(this.state);
        console.log(this.child.current.getTotalJson());
        console.log(JSON.stringify(this.child.current.getTotalJson()));
    }

    sendJsonToNG() {
        var entityJson = this.child.current.getTotalJson();
        var sendingJson = {
            "SendingTime": "1998-03-08T00:00:00.000Z",
            "Lesson": this.lessonNode.value,
            "Version": this.versionNode.value,
            "System": this.systemNode .value,
            "Entities": [entityJson]
        }


        var bodyJ = JSON.stringify({
            nameA: "paul rudd",
            moviesA: ["I Love You Man", "Role Models"]
        });

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: bodyJ
        };

        const toastProperties = {
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


    close() {
        this.state.isOpenPopup = false;
        this.setState(this.state);
    }

    render() {
        return (
            <Styles>
                <div className='main-comp'>

                    <ToastContainer />
                    <JsonPopup json={JSON.stringify(this.state.json)} isOpen={this.state.isOpenPopup} />

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
                                            display total json
                                        </center>
                                    </Popup>

                                    {/* creating the sending button, which sends the json to NG */}
                                    <Popup
                                        className="action-btn"
                                        position="bottom center"
                                        on="hover"
                                        trigger={
                                            <Button className="action-btn" variant="outline-info" onClick={() => this.sendJsonToNG()}>
                                                <i class="far fa-paper-plane fa-2x fa-flip-horizontal"></i>
                                            </Button>}
                                    >
                                        <center>
                                            send to NG
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

                            <Row className='field'>
                                <Col lg='1' >
                                    <Form.Label >ישות</Form.Label>
                                </Col>
                                <Col lg='2'>
                                    <Form.Control ref={(ref) => this.entityNode = ref} as="select">
                                        <option>English</option>
                                        <option>Math</option>
                                        <option>Chemistry</option>
                                    </Form.Control>
                                </Col>

                                <Col lg='1' >
                                    <Form.Label >סוג בקשה</Form.Label>
                                </Col>
                                <Col lg='2'>
                                    <Form.Control ref={(ref) => this.systemNode = ref} as="select">
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
                                        <option>Tal</option>
                                        <option>Inon</option>
                                    </Form.Control>
                                </Col>

                            </Row>

                            <Row className='field'>
                                <Col lg='1'>
                                    <Form.Label >תקן</Form.Label>
                                </Col>
                                <Col lg='2'>
                                    <Form.Control ref={(ref) => this.versionNode = ref} as="select">
                                        <option>2</option>
                                        <option>2.1</option>
                                        <option>X</option>
                                    </Form.Control>
                                </Col>
                                <Col lg='1'>
                                    <Form.Label >שיעור</Form.Label>
                                </Col>
                                <Col lg='2'>
                                    <Form.Control ref={(ref) => this.lessonNode = ref} as="select" >
                                        <option>0</option>
                                        <option>1</option>
                                        <option>2</option>
                                        <option>3</option>
                                        <option>4</option>
                                    </Form.Control>
                                </Col>
                            </Row>
                        </div>


                        <Row dir='rtl'>
                            <Col className='entity-editor-window' lg='10'>
                                <EntityEditor ref={this.child} level='0' jsondata='{"Ids": {"name": "a"}, "Planing":[{"Goal":"learn piano","Way":"play piano","Time":"2020-07-13T00:00:00Z"}]}'></EntityEditor>
                            </Col>
                        </Row>


                    </Form>

                </div>
            </Styles>
        )
    }
}

export default NGRequest;