import React from 'react';
import styled from 'styled-components';
import { Form, Col, Row } from 'react-bootstrap';
import HummusContext from './HummusContext'
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Popup from "reactjs-popup";
import JsonViewer from './JsonViewer';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { convertJsonTemplateToActualJson } from './Utility'
import LinkTarget from './LinkingEntities/LinkTarget'

const Styles = styled.div`

.directory-tree {
    padding:10px;
    max-height: 500px;
    overflow-y: scroll;
}

.fa-check {
    color: #81c784; 
    top:10px;
    left: 20px;
    position: absolute;
    cursor: pointer;
    padding:10px;
    border-radius:5px;
    border-style:solid;
    border-width:0.02em;
    border-color: white;
}

.fa-check:active {
    color: #388e3c;
}

.fa-check:hover {
    color: #4caf50;
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
            fromJson: {},
            tab: 'profile'
        }
        this.selectedScenarioNumber = 0;
        this.onCloseCallback = props.onClose;
        this.jsonViewerFromRef = React.createRef();
        this.jsonViewerToRef = React.createRef();


    }

    UNSAFE_componentWillReceiveProps(newProps) {
        this.state.isOpen = newProps.isOpen;
        this.state.json = newProps.json;
        this.state.stepNumber = newProps.step;

        var defaultStep = this.context.data.currScenario.steps[0];

        var disabledFields = this.context.data.currScenario.steps[this.context.data.currOpenStep].disabledFields;
        this.state.fromJson = convertJsonTemplateToActualJson(JSON.parse(defaultStep.jsonToEdit), disabledFields);

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
        var disabledFields = this.context.data.currScenario.steps[this.context.data.currOpenStep].disabledFields;
        this.state.fromJson = convertJsonTemplateToActualJson(JSON.parse(selectedStep.jsonToEdit), disabledFields);
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

            this.close();
        }
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

                    <div style={{ height: 500, overflowY: 'scroll' }}>

                        <Tabs
                            id="controlled-tab-example"
                            style={{position: 'absolute', width: '99%', marginLeft:0, background: 'white'}}
                            activeKey={this.state.tab}
                            onSelect={(k) => { this.state.tab = k; this.setState(this.state) }}

                        >
                            <Tab eventKey="home" title="Home">
                                <div style={{ marginBottom: 30 }}>
                                    <i onClick={() => this.addLink()} className="fas fa-check fa-2x"></i>
                                    <center>
                                        <Form.Label style={{ fontSize: 30, marginBottom: 1 }}>קישור שדות</Form.Label>
                                    </center>
                                </div>

                                <div style={{ marginRight: 25 }}>
                                    <div style={{ float: 'right' }}>
                                        כאן תוכלו לקשר שדות בין צעדים בתוך התרחיש <br />
                                    </div>
                                    <br />
                                    <div style={{ float: 'right' }}>
                                        תבחרו את הצעד והשדה ממנו אתה רוצה להעתיק את הערך, ותבחרו את השדה אליו אתם רוצים להעתיק <br />
                                    </div>
                                    <br />
                                    <br />
                                </div>

                                <Row>
                                    <Col lg="6" style={{ marginRight: 0, paddingRight: 0 }}>

                                        <div style={{ marginRight: 30, marginBottom: 10 }}>
                                            <Form.Label style={{ float: 'right', marginBottom: 1, marginLeft: 20, fontSize: 20 }}>בחר צעד מקור</Form.Label>
                                            <Form.Control
                                                style={{ width: 150, float: 'right', marginTop: 2 }}
                                                size="sm"
                                                onChange={(event) => this.loadSourceJson(event)}
                                                as="select">
                                                {this.getStepsOptions()}
                                            </Form.Control>
                                            <br />
                                        </div>

                                        <div style={{ marginTop: 25 }}>
                                            <div style={{ float: 'right', marginRight: 30 }} dir="rtl">בחר שדה מקור</div>
                                            <br /><br />
                                            <div style={{ marginRight: 10, marginLeft: 10, height: 400, backgroundColor: '#21252b' }} className="directory-tree">
                                                <JsonViewer
                                                    json={this.state.fromJson}
                                                    ref={this.jsonViewerFromRef}
                                                />
                                            </div>
                                        </div>
                                    </Col>


                                    <Col lg="6" style={{ marginLeft: 0, paddingLeft: 0, paddingRight: 0 }}>
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


                                        <div style={{ marginTop: 25 }}>
                                            <div style={{ float: 'right', marginRight: 30 }} dir="rtl">בחר שדה יעד</div>
                                            <br /><br />
                                            {/** TODO put the div with the style, and the css of the class , inside the JsonViewer */}
                                            <div style={{ marginRight: 20, marginLeft: 10, height: 400, backgroundColor: '#21252b' }} className="directory-tree">

                                                <JsonViewer
                                                    json={this.state.json}
                                                    ref={this.jsonViewerToRef}
                                                />
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            </Tab>
                            <Tab eventKey="profile" dir="rtl" title="Profile">

                                <LinkTarget/>

                                


                            </Tab>
                            <Tab eventKey="visualization" title="visualization">
                                ASDF
                            </Tab>
                        </Tabs>


                    </div>
                </Popup>

            </Styles>
        )
    }
}

export default LinkingFieldsPopup;