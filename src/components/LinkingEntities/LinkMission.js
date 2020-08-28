import React, { useState, useContext } from "react";
import EntitySelectInput from '../EntitySelectInput/EntitySelectInput'
import HummusContext, { HummusConsumer } from '../HummusContext'
import { toastProperties } from '../Utility';
import { Col, Row } from 'react-bootstrap';
import { toast } from 'react-toastify';


export default function LinkMission(props) {
    const [linksToAdd, setLinksToAdd] = useState([]);

    const context = useContext(HummusContext)

    const missionJson = JSON.parse(context.data.currScenario.steps[context.data.currOpenStep].jsonToEdit);
    const currStepMissionsCount = missionJson.Mission.length;

    const linksTemplate = [{
        fromPath: '/Plan/{0}/FirstThing/name',
        toPath: '/Mission/{0}/Beatles/TeddyBear/name',
        fromStep: -1,
    }, {
        fromPath: '/Plan/{0}/FirstThing/number',
        toPath: '/Mission/{0}/Beatles/TeddyBear/code',
        fromStep: -1,
    }];


    // Get the plans from all steps before curr step, for the EntitySelectInput
    var plansJson = {};
    for (var stepIndex = 0; stepIndex < context.data.currOpenStep; stepIndex++) {
        var currStep = context.data.currScenario.steps[stepIndex];
        if (currStep.entity === 'Plan') {
            var numberOfPlans = JSON.parse(currStep.jsonToEdit).Plan.length;
            plansJson[stepIndex + ' - ' + currStep.name] = new Array(numberOfPlans).fill("תוכנית")
        }
    }

    const createLinks = (stepOrigin, planIndex, missionIndex, linksTemplate) => {
        var links = [];
        for (var index in linksTemplate) {
            var linkToCreate = JSON.parse(JSON.stringify(linksTemplate[index]));
            linkToCreate.fromPath = linkToCreate.fromPath.format(planIndex);
            linkToCreate.toPath = linkToCreate.toPath.format(missionIndex);
            linkToCreate.fromStep = stepOrigin;
            links.push(linkToCreate);
        }

        return links;
    }

    const onLinksChecked = (event, missionIndex) => {
        var checkedResult = event.value;
        var allLinksToAdd = [];

        for (var key in checkedResult) {
            for (var planIndex in checkedResult[key]) {
                if (checkedResult[key][planIndex]) {
                    var currLinksToAdd = createLinks(parseInt(key),
                        planIndex,
                        missionIndex,
                        linksTemplate);
                    allLinksToAdd = allLinksToAdd.concat(currLinksToAdd);
                }
            }
        }

        setLinksToAdd(allLinksToAdd);
    };

    const validateLinks = () => {
        if (linksToAdd.length === 0) {
            return {
                valid: false,
                message: 'אחותי, צריך לבחור ישויות. אי אפשר סתם ללחוץ על הוי'
            }
        } else {
            return {
                valid: true
            }
        }
    }

    const addLink = () => {
        var validateResult = validateLinks();
        if (!validateResult.valid) {
            toast.error(validateResult.message, toastProperties);
        } else {
            toast.success('Link was created successfully', toastProperties);
            const currStepNumber = context.data.currOpenStep;
            var links = context.data.currScenario.steps[currStepNumber].links;
            links = links.concat(linksToAdd);
    
            context.data.currScenario.steps[currStepNumber].links = links;
            props.closePopupCallback();
        }
    };

    return (

        <div>
            {[...Array(currStepMissionsCount).keys()].map(missionIndex =>
                <div style={{ marginBottom: 50 }}>
                    <center className="entity-headline">
                        <h2>משימה ({missionIndex})</h2>
                    </center>
                    <div>

                        <Row style={{ marginRight: 15 }}>
                            <Col style={{ padding: 0 }} lg='2'>
                                <div style={{ textAlign: 'right' }}>קישור לתוכנית: </div>
                            </Col>
                            <Col>
                                <EntitySelectInput
                                    style={{ float: 'left' }}
                                    input={plansJson}
                                    header='בחר תוכנית'
                                    onChange={(event) => onLinksChecked(event, missionIndex, 'intel')}
                                    entitiesSelectLimit={1}
                                />
                            </Col>
                        </Row>


                    </div>

                </div>

            )}

            <i onClick={() => addLink()} className="fas fa-check link-check fa-2x"></i>

        </div>
    );
}
