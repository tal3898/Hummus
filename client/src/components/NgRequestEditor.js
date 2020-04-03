import React from 'react';
import styled from 'styled-components';
import {  Button, Form, Col, Row } from 'react-bootstrap';
import EntityEditor from './EntityEditor';
import HummusContext, { HummusConsumer } from './HummusContext'
import LinkingFieldsPopup from './LinkingFieldsPopup'
import EntityMap from '../globals/EntityMap.json'
import RealityMap from '../globals/RealityMap.json'
import SystemMap from '../globals/SystemMap.json'

import english_2 from '../jsonFormats/english_2.json'
import math_2 from '../jsonFormats/math_2.json'
import chemistry_2 from '../jsonFormats/chemistry_2.json'

import english_x from '../jsonFormats/english_x.json'
import math_x from '../jsonFormats/math_x.json'
import chemistry_x from '../jsonFormats/chemistry_x.json'

const Styles = styled.div`
    

.entity-editor-window {
    height: 480px;
    overflow-y: scroll;
    margin-top: 10px;
    padding: 10px;
    background: #f5f5f5;   
}


.field {
    margin-bottom: 20px;
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

    componentDidMount() {

        this.context.data.currScenario.steps[this.state.openStepIndex].jsonMap = {
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


        this.context.data.currScenario.steps[this.state.openStepIndex].jsonToEdit = JSON.stringify(english_2);
        this.context.data.currScenario.steps[this.state.openStepIndex].entity = 'English';
        this.context.data.currScenario.steps[this.state.openStepIndex].system = 'Tal';
        this.context.data.currScenario.steps[this.state.openStepIndex].reality = '0';
        this.context.data.currScenario.steps[this.state.openStepIndex].action = 'POST';
        this.context.data.currScenario.steps[this.state.openStepIndex].version = '2';

        this.context.data.currScenario.steps[this.state.openStepIndex].fullJsonToEdit = JSON.stringify(english_2);

        //

        this.context.data.currScenario.steps[1].jsonMap = {
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

        this.context.data.currScenario.steps[1].jsonToEdit = JSON.stringify(english_2);
        this.context.data.currScenario.steps[1].entity = 'English';
        this.context.data.currScenario.steps[1].system = 'Tal';
        this.context.data.currScenario.steps[1].reality = '0';
        this.context.data.currScenario.steps[1].action = 'POST';
        this.context.data.currScenario.steps[1].version = '2';

        this.context.data.currScenario.steps[1].fullJsonToEdit = JSON.stringify(english_2);

    }

    getFullRequestJson() {
        var entityJson = this.entidyEditorChild.current.getTotalJson();
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
        this.state.json = this.getFullRequestJson().Entities[0];
        this.state.isLinkPopupOpen = true;
        this.setState(this.state);
    }

    onMetadataChange(event, key) {
        this.context.data.currScenario.steps[this.state.openStepIndex][key] = event.target.value;
        this.context.updateData(this.context);
    }

    //TODO change function name
    getChosenJsonByEntityAndVersion() {
        var chosenEntity = this.entityNode.value;
        var chosenVersion = this.versionNode.value;

        return this.context.data.currScenario.steps[this.state.openStepIndex].jsonMap[chosenEntity][chosenVersion];
    }

    //TODO change function name
    loadJsonByChosenEntityAndVersion() {
        var chosenJson = this.getChosenJsonByEntityAndVersion();
        this.context.data.currScenario.steps[this.state.openStepIndex].jsonToEdit = chosenJson;
        this.context.data.currScenario.steps[this.state.openStepIndex].fullJsonToEdit = chosenJson;
        this.setState(this.state);
    }

    updateRequest(event) {
        this.context.data.currScenario.steps[this.state.openStepIndex].jsonToEdit = JSON.stringify(event.newJson);
        var chosenEntity = this.entityNode.value;
        var chosenVersion = this.versionNode.value;

        this.context.data.currScenario.steps[this.state.openStepIndex].jsonMap[chosenEntity][chosenVersion] = this.context.data.currScenario.steps[this.state.openStepIndex].jsonToEdit;
    }

    addLink() {
        this.context.data.currScenario.steps[this.state.openStepIndex].links.push(  { "fromStep": 0, "fromPath": "/Ids/name", "toPath": "/Ids/name" }  );
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

                            <Form>
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
                                </div>

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

                                        <Button style={{ top: 70, right: 20, position: 'absolute' }} variant="outline-info" 
                                                onClick={() => this.openLinkPopup()}>
                                            {
                                                <i class="fas fa-code"></i>
                                            }
                                        </Button>

                                        <EntityEditor
                                            parentPath=''
                                            expandAll={this.state.expandAll}
                                            ref={this.entidyEditorChild}
                                            level='0'
                                            fullJson={context.data.currScenario.steps[this.state.openStepIndex].fullJsonToEdit}
                                            jsondata={context.data.currScenario.steps[this.state.openStepIndex].jsonToEdit}
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

export default NgRequestEditor;