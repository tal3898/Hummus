import React from 'react';
import styled from 'styled-components';
import {  Button, Form, Col, Row } from 'react-bootstrap';
import EntityEditor from './EntityEditor';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import HummusContext, { HummusConsumer } from './HummusContext'

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
            expandAll: false
        }
        this.entidyEditorChild = React.createRef();
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


        this.context.data.currScenario.steps[0].jsonToEdit = JSON.stringify(english_2);
        this.context.data.currScenario.steps[0].entity = 'English';
        this.context.data.currScenario.steps[0].system = 'Tal';
        this.context.data.currScenario.steps[0].reality = '0';
        this.context.data.currScenario.steps[0].action = 'POST';
        this.context.data.currScenario.steps[0].version = '2';

        this.context.data.currScenario.steps[0].fullJsonToEdit = JSON.stringify(english_2);

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

    onMetadataChange(event, key) {
        this.context.data.currScenario.steps[0][key] = event.target.value;
        this.context.updateData(this.context);
    }

    //TODO change function name
    getChosenJsonByEntityAndVersion() {
        var chosenEntity = this.entityNode.value;
        var chosenVersion = this.versionNode.value;

        return this.context.data.currScenario.steps[0].jsonMap[chosenEntity][chosenVersion];
    }

    //TODO change function name
    loadJsonByChosenEntityAndVersion() {
        var chosenJson = this.getChosenJsonByEntityAndVersion();
        this.context.data.currScenario.steps[0].jsonToEdit = chosenJson;
        this.context.data.currScenario.steps[0].fullJsonToEdit = chosenJson;
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
                <HummusConsumer>
                    {(context) =>

                        <div>

                            <ToastContainer />

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
                                                onChange={(event) => { this.loadJsonByChosenEntityAndVersion(); this.onMetadataChange(event, 'version') }}
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
                                            ref={this.entidyEditorChild}
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

export default NgRequestEditor;