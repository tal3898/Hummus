import React from 'react';
import styled from 'styled-components';
import { Nav, Button, Form, FormControl, Col, Row } from 'react-bootstrap';
import { JSONEditor } from 'react-json-editor-viewer';
import EntityEditor from './EntityEditor';
import { Treebeard } from 'react-treebeard';
import HummusContext from './HummusContext'

import Popup from "reactjs-popup";
import ReactJson from 'react-json-view'
import JsonViewer from './JsonViewer';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ScenariosWindow from './ScenariosWindow';
import { convertJsonTemplateToActualJson } from './Utility'

const Styles = styled.div`

.directory-tree {
    padding:10px;
    max-height: 500px;
    overflow-y: scroll;
}

.scenario-name-form {
    margin-top: 30px;
    margin-bottom: 20px;
}

.fa-save {
    margin-right:30px;
    color: #607d8b;

    padding:10px;
    border-radius:5px;
    border-style:solid;
    border-width:0.012em;
    border-color: white;
}

.fa-save:active {
    border-color: #0091ea;
}

.fa-save:hover {
    color: #0091ea;
}

`;


class LinkingFieldsPopup extends React.Component {

    static contextType = HummusContext;

    constructor(props) {
        super(props)
        this.state = {
            stepNumber: props.step,
            isOpen: false,
            json: props.json,
            fromJson: {}
        }
        this.selectedScenarioNumber = 0;
        this.onCloseCallback = props.onClose;
        this.jsonViewerFromRef = React.createRef();
        this.jsonViewerToRef = React.createRef();
    }

    componentDidMount() {

    }

    UNSAFE_componentWillReceiveProps(newProps) {
        this.state.isOpen = newProps.isOpen;
        this.state.json = newProps.json;
        this.state.stepNumber = newProps.step;

        var defaultStep = this.context.data.currScenario.steps[0];
        this.state.fromJson = convertJsonTemplateToActualJson(JSON.parse(defaultStep.jsonToEdit));
        this.setState(this.state);

        this.setState(this.state);
    }

    close() {
        this.onCloseCallback();
        this.state.isOpen = false;
        this.setState(this.state);
    }

    loadSourceJson(event) {
        this.selectedScenarioNumber = parseInt(event.target.value);

        var selectedStep = this.context.data.currScenario.steps[this.selectedScenarioNumber];
        this.state.fromJson = convertJsonTemplateToActualJson(JSON.parse(selectedStep.jsonToEdit));
        this.setState(this.state);
    }

    addLink() {
        const toastProperties = {
            autoClose: 7000,
            position: toast.POSITION.BOTTOM_RIGHT,
            pauseOnFocusLoss: false
        };

        if (this.selectedScenarioNumber > this.state.stepNumber) {
            toast.error("You can only link fields to previuos steps", toastProperties);
        } else if (!this.jsonViewerFromRef.current.didSelectedField() || !this.jsonViewerToRef.current.didSelectedField()) {
            toast.error("You must select fields", toastProperties);
        } else if (this.jsonViewerFromRef.current.isSelectedFieldHasChildren() || this.jsonViewerToRef.current.isSelectedFieldHasChildren()) {
            toast.error("You can only link fields which have value", toastProperties);
        } else {
            var fromPath = this.jsonViewerFromRef.current.getSelectedPath();
            var toPath = this.jsonViewerToRef.current.getSelectedPath();

            var newLink = {
                fromPath: fromPath,
                fromStep: this.selectedScenarioNumber,
                toPath: toPath
            }

            this.context.data.currScenario.steps[this.state.stepNumber].links.push(newLink);

            toast.success("Link created successfully", toastProperties);
        }



    }

    render() {
        return (
            <Styles>
                <ToastContainer />

                <Popup
                    open={this.state.isOpen}
                    onClose={() => this.close()}
                    modal
                    active
                    closeOnDocumentClick
                >

                    <Row style={{ marginLeft: 0, marginTop: 7, marginBottom: 20 }}>
                        <Col>
                            <Form.Label style={{ fontSize: 30, marginBottom: 1 }}>קישור שדות</Form.Label>
                        </Col>
                        <Col>
                            <i onClick={() => this.addLink()} class="fas fa-check fa-3x"></i>
                        </Col>
                    </Row>



                    <Row>
                        <Col lg="6" style={{ marginRight: 0, paddingRight: 0 }}>

                            <div style={{ marginRight: 30, marginBottom: 10 }}>
                                <Form.Label style={{ float: 'right', marginBottom: 1, marginLeft: 20, fontSize: 20 }}>בחר צעד לקשר ממנו</Form.Label>
                                <Form.Control
                                    style={{ width: 150, float: 'right', marginTop: 2 }}
                                    size="sm"
                                    onChange={(event) => this.loadSourceJson(event)}
                                    as="select">
                                    <option>0 - asdf</option>
                                    <option>1 - redf</option>
                                </Form.Control>
                                <br />
                            </div>

                            <div style={{ float: 'right', marginRight: 30 }} dir="rtl">בחר שדה מקור</div>
                            <br />
                            <div style={{ marginRight: 10, marginLeft: 10, height: 400, backgroundColor: '#21252b' }} className="directory-tree">
                                <JsonViewer
                                    json={this.state.fromJson}
                                    ref={this.jsonViewerFromRef}
                                />
                            </div>
                        </Col>



                        <Col lg="6" style={{ marginLeft: 0, paddingLeft: 0 }}>
                            <div style={{ marginRight: 30, marginBottom: 10 }}>
                                <Form.Label style={{ float: 'right', marginBottom: 1, marginLeft: 20, fontSize: 20 }}>צעד יעד</Form.Label>
                                <Form.Control
                                    style={{ width: 150, float: 'right', marginTop: 2 }}
                                    size="sm"
                                    disabled
                                    onChange={(event) => this.loadSourceJson(event)}
                                    as="select">
                                    <option>{this.state.stepNumber + ' - ' +
                                        this.context.data.currScenario.steps[this.state.stepNumber].name}</option>
                                </Form.Control>
                                <br />
                            </div>


                            <div style={{ float: 'right', marginRight: 30 }} dir="rtl">בחר שדה יעד</div>
                            <br />
                            {/** TODO put the div with the style, and the css of the class , inside the JsonViewer */}
                            <div style={{ marginRight: 10, marginLeft: 10, height: 400, backgroundColor: '#21252b' }} className="directory-tree">

                                <JsonViewer
                                    json={this.state.json}
                                    ref={this.jsonViewerToRef}
                                />
                            </div>
                        </Col>
                    </Row>
                </Popup>

            </Styles>
        )
    }
}

export default LinkingFieldsPopup;