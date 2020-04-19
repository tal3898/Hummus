import React from 'react';
import styled from 'styled-components';
import { Button, Form, Col, Row } from 'react-bootstrap';
import EntityEditor from './EntityEditor';
import HummusContext, { HummusConsumer } from './HummusContext'
import LinkingFieldsPopup from './LinkingFieldsPopup'
import EntityMap from '../globals/EntityMap.json'
import RealityMap from '../globals/RealityMap.json'
import SystemMap from '../globals/SystemMap.json'

import { FullEntitiesMap } from '../globals/FullEntitiesMap'

const Styles = styled.div`
    

.entity-editor-window {
    height: 480px;
    overflow-y: scroll;
    margin-top: 10px;
    padding: 10px;
    background: #f5f5f5;   
}


.field {
    margin-bottom: 10px !important;
}

`;

class NgRequestEditor extends React.Component {

    static contextType = HummusContext;

    constructor(props) {
        super(props)
        this.state = {
            expandAll: false,
            openStepIndex: props.openStepIndex,
            json: {},
            isLinkPopupOpen: false
        }
        this.entidyEditorChild = React.createRef();
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        this.state = {
            expandAll: false,
            openStepIndex: newProps.openStepIndex
        }
        this.setState(this.state);
    }

    getBombaFullRequestJson() {
        var entityJson = this.entidyEditorChild.current.getTotalBombaJson();
        var fullRequestJson = {
            "Entity": EntityMap[this.entityNode.value],
            "SendingTime": new Date().toISOString(),
            "Reality": RealityMap[this.realityNode.value],
            "Version": this.versionNode.value,
            "System": SystemMap[this.systemNode.value],
            "Entities": [entityJson]
        }

        return fullRequestJson;
    }

    expendAll() {
        this.setState({ expandAll: !this.state.expandAll })
    }

    openLinkPopup() {
        this.state.json = this.entidyEditorChild.current.getTotalJson();
        this.state.isLinkPopupOpen = true;
        this.setState(this.state);
    }

    onMetadataChange(event, key) {
        this.context.data.currScenario.steps[this.state.openStepIndex][key] = event.target.value;
        this.context.updateData(this.context);
    }


    //TODO change function name
    loadJsonByChosenEntityAndVersion() {
        var chosenEntity = this.entityNode.value;
        var chosenVersion = this.versionNode.value;

        // Reset the chosen json
        var chosenJson = this.context.data.currScenario.steps[this.state.openStepIndex].jsonMap[chosenEntity][chosenVersion].data;
        this.context.data.currScenario.steps[this.state.openStepIndex].jsonToEdit = chosenJson;

        // Reset the disabled fields
        var disabledFields = this.context.data.currScenario.steps[this.state.openStepIndex].jsonMap[chosenEntity][chosenVersion].disabledFields;
        this.context.data.currScenario.steps[this.state.openStepIndex].disabledFields = JSON.parse(JSON.stringify(disabledFields));

        // Reset links
        this.context.data.currScenario.steps[this.state.openStepIndex].links = [];

        this.setState(this.state);
    }

    updateRequest(event) {

        var chosenEntity = this.entityNode.value;
        var chosenVersion = this.versionNode.value;

        this.context.data.currScenario.steps[this.state.openStepIndex].jsonToEdit = JSON.stringify(event.newJson);


        this.context.data.currScenario.steps[this.state.openStepIndex].jsonMap[chosenEntity][chosenVersion].data =
            this.context.data.currScenario.steps[this.state.openStepIndex].jsonToEdit;

    }

    getChosenEntityFullJson() {
        var chosenVersion = this.context.data.currScenario.steps[this.state.openStepIndex].version;
        var chosenEntity = this.context.data.currScenario.steps[this.state.openStepIndex].entity;

        if (chosenEntity == "English") {
            chosenEntity = "אנגלית"
        } else if (chosenEntity == "Math") {
            chosenEntity = "חשבון";
        } else if (chosenEntity == "Chemistry") {
            chosenEntity = "כמיה";
        }

        return FullEntitiesMap[chosenEntity][chosenVersion].data;
    }

    addLink() {
        this.context.data.currScenario.steps[this.state.openStepIndex].links.push({ "fromStep": 0, "fromPath": "/Ids/name", "toPath": "/Ids/name" });
    }

    closePopup() {
        this.state.isLinkPopupOpen = false;
        this.setState(this.state);
    }

    render() {
        return (
            <Styles>
                <HummusConsumer>
                    {(context) =>

                        <div>

                            <LinkingFieldsPopup
                                step={this.state.openStepIndex}
                                json={this.state.json}
                                onClose={() => this.closePopup()}
                                isOpen={this.state.isLinkPopupOpen}
                            />


                            <div dir='rtl' className='metadata'>


                                {/** TODO: instead of harcoded entities, loop on the EntityMap */}
                                <Row className='field'>
                                    <Col lg='1' >
                                        <Form.Label >ישות</Form.Label>
                                    </Col>
                                    <Col lg='2'>
                                        <Form.Control
                                            onChange={(event) => { this.loadJsonByChosenEntityAndVersion(); this.onMetadataChange(event, 'entity') }}
                                            value={context.data.currScenario.steps[this.state.openStepIndex].entity}
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
                                            value={context.data.currScenario.steps[this.state.openStepIndex].action}
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
                                            value={context.data.currScenario.steps[this.state.openStepIndex].system}
                                            ref={(ref) => this.systemNode = ref}
                                            as="select">
                                            <option>טל</option>
                                            <option>ינון</option>
                                            <option>שחר</option>
                                        </Form.Control>
                                    </Col>

                                </Row>

                                <Row className='field'>
                                    <Col lg='1'>
                                        <Form.Label >תקן</Form.Label>
                                    </Col>
                                    <Col lg='2'>
                                        <Form.Control
                                            onChange={(event) => { this.loadJsonByChosenEntityAndVersion(); this.onMetadataChange(event, 'version') }}
                                            value={context.data.currScenario.steps[this.state.openStepIndex].version}
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
                                            value={context.data.currScenario.steps[this.state.openStepIndex].reality}
                                            ref={(ref) => this.realityNode = ref}
                                            as="select" >

                                            <option>א</option>
                                            <option>ב</option>
                                            <option>ג</option>
                                        </Form.Control>
                                    </Col>
                                </Row>
                                <span style={{ marginTop: 0, fontSize: 10, float: 'right', marginBottom: 1, padding: 0 }}>*שים לב, שינוי ישות או תקן יאפס את כל המידע</span>
                                <br />
                            </div>

                            <Row dir='rtl'>

                                <Col lg='10' className='entity-editor-window'>
                                    <Button id="expandAllBtn" style={{ top: 20, right: 20, position: 'absolute' }} variant="outline-info" onClick={() => this.expendAll()}>
                                        {
                                            this.state.expandAll &&
                                            <i className="fas fa-compress-alt"></i>
                                        }
                                        {!this.state.expandAll &&
                                            <i className="fas fa-expand-alt"></i>
                                        }
                                    </Button>

                                    <Button style={{ top: 20, right: 60, position: 'absolute' }} variant="outline-info"
                                        onClick={() => this.openLinkPopup()}>
                                        {<i className="fas fa-sitemap"></i>}
                                    </Button>

                                    <EntityEditor
                                        parentPath=''
                                        expandAll={this.state.expandAll}
                                        ref={this.entidyEditorChild}
                                        level='0'
                                        fullJson={this.getChosenEntityFullJson()}
                                        jsondata={context.data.currScenario.steps[this.state.openStepIndex].jsonToEdit}
                                        onInnerFieldChanged={(event) => this.updateRequest(event)} ></EntityEditor>

                                </Col>
                            </Row>




                        </div>
                    }
                </HummusConsumer>


            </Styles>
        )
    }
}

export default NgRequestEditor;