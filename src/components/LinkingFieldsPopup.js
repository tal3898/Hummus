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
import ErrorBoundary from './ErrorBoundary'
import LinksVisualization from './LinksVisualization'
import LinkEntity from './LinkingEntities/LinkEntity'

const Styles = styled.div`

.directory-tree {
    padding:10px;
    max-height: 500px;
    overflow-y: scroll;
}

.link-check {
    position: absolute; 
    bottom: 20px; 
    left: 20px;
    color: #81c784;
    cursor: pointer;
    z-index:10;
}

.link-check:active {
    color: #388e3c;
}

.link-check:hover {
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
            tab: 'ישויות'
        }

        this.selectedScenarioNumber = 0;
        this.onCloseCallback = props.onClose;

        this.selectedOriginPath = {};
        this.selectedDestPath = {};
    }

    getOriginStepNumber() {
        var originStepNumber = this.context.data.currOpenStep - 1;

        if (originStepNumber < 0) {
            originStepNumber = 0;
        }

        return originStepNumber;
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        this.state.isOpen = newProps.isOpen;
        this.state.json = newProps.json;
        this.state.stepNumber = newProps.step;


        this.selectedScenarioNumber = this.getOriginStepNumber();

        var defaultStep = this.context.data.currScenario.steps[this.selectedScenarioNumber];

        var disabledFields = this.context.data.currScenario.steps[this.context.data.currOpenStep].disabledFields;
        this.state.fromJson = convertJsonTemplateToActualJson(defaultStep.jsonToEdit, disabledFields);

        this.setState(this.state);
    }

    close() {
        this.onCloseCallback();
        this.state.isOpen = false;
        this.selectedOriginPath = {};
        this.selectedDestPath = {};
        this.setState(this.state);
    }

    loadSourceJson(event) {
        this.selectedScenarioNumber = parseInt(event.target.value);

        var selectedStep = this.context.data.currScenario.steps[this.selectedScenarioNumber];
        var disabledFields = this.context.data.currScenario.steps[this.context.data.currOpenStep].disabledFields;
        this.state.fromJson = convertJsonTemplateToActualJson(selectedStep.jsonToEdit, disabledFields);
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
        } else if (this.selectedOriginPath.clickedPath === undefined || this.selectedDestPath.clickedPath === undefined) {
            toast.error("You must select fields", toastProperties);
        } else if (this.selectedOriginPath.hasChildren || this.selectedDestPath.hasChildren) {
            toast.error("You can only link fields which have value", toastProperties);
        } else {
            var fromPath = this.selectedOriginPath.clickedPath;
            var toPath = this.selectedDestPath.clickedPath;

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
                <option key={index + '-' + currStep.name} value={index + '-' + currStep.name}>{index} - {currStep.name}</option>
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

                    <ErrorBoundary>
                        <div style={{ height: '600px', overflowY: 'scroll' }}>

                            <Tabs
                                id="controlled-tab-example"
                                style={{ position: 'absolute', width: '99%', marginLeft: 0, zIndex: 100, background: 'white' }}
                                activeKey={this.state.tab}
                                onSelect={(k) => { this.state.tab = k; this.setState(this.state) }}

                            >
                                <Tab eventKey="ישויות" dir="rtl" title="ישויות">
                                    <LinkEntity
                                        closePopupCallback={() => this.close()}
                                    />
                                </Tab>
                                <Tab eventKey="שדות" title="שדות">
                                    <div style={{ marginTop: 60, width: '100%', overflowX: 'hidden' }}>
                                        <div style={{ marginBottom: 30 }}>
                                            <i onClick={() => this.addLink()} className="fas fa-check link-check fa-2x"></i>
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
                                                        value={this.selectedScenarioNumber + '-' + this.context.data.currScenario.steps[this.selectedScenarioNumber].name}
                                                        onChange={(event) => this.loadSourceJson(event)}
                                                        as="select">
                                                        {this.getStepsOptions()}
                                                    </Form.Control>
                                                    <br />
                                                </div>

                                                <div style={{ marginTop: 25 }}>
                                                    <div style={{ float: 'right', marginRight: 30 }} dir="rtl">בחר שדה מקור</div>
                                                    <br /><br />
                                                    <div style={{ marginRight: 10, marginLeft: 10, height: 400 }} className="directory-tree">
                                                        <JsonViewer
                                                            onKeySelected={(event) => this.selectedOriginPath = event}
                                                            type="json"
                                                            json={this.state.fromJson}
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
                                                    <div style={{ marginRight: 0, marginLeft: 0, height: 400 }} className="directory-tree">

                                                        <JsonViewer
                                                            onKeySelected={(event) => this.selectedDestPath = event}
                                                            type="json"
                                                            json={this.state.json}
                                                        />
                                                    </div>
                                                </div>
                                            </Col>
                                        </Row>
                                    </div>
                                </Tab>
                                <Tab eventKey="ויזואליזציה" title="ויזואליזציה">
                                    <div style={{ marginTop: 60, marginLeft: 0, fontSize: 20 }}>
                                        <LinksVisualization />
                                    </div>
                                </Tab>
                            </Tabs>


                        </div>
                    </ErrorBoundary>
                </Popup>

            </Styles>

        )
    }
}

export default LinkingFieldsPopup;