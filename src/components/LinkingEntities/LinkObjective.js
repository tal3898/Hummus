import React, { useState, useContext } from "react";
import EntitySelectInput from '../EntitySelectInput/EntitySelectInput'
import HummusContext, { HummusConsumer } from '../HummusContext'
import { getValue } from '../Utility';
import { Col, Row } from 'react-bootstrap';


export default function LinkTarget(props) {
    const [linksToAdd, setLinksToAdd] = useState([]);

    const context = useContext(HummusContext)

    const objectiveJson = JSON.parse(context.data.currScenario.steps[context.data.currOpenStep].jsonToEdit);
    const currStepTargetsCount = objectiveJson.Objective.length;
    const linkToPlanPath = '/Objective/{0}/Beatles/TeddyBear';

    const linksTemplate = [{
        fromPath: '/Plan/{0}/FirstThing/name',
        toPath: '/Objective/{0}/Beatles/TeddyBear/name',
        fromStep: -1,
    }, {
        fromPath: '/Plan/{0}/FirstThing/number',
        toPath: '/Objective/{0}/Beatles/TeddyBear/code',
        fromStep: -1,
    }];


    // Get the objectives from all steps before curr step, for the EntitySelectInput
    var plansJson = {};
    for (var stepIndex = 0; stepIndex < context.data.currOpenStep; stepIndex++) {
        var currStep = context.data.currScenario.steps[stepIndex];
        if (currStep.entity === 'Plan') {
            var numberOfPlans = JSON.parse(currStep.jsonToEdit).Plan.length;
            plansJson[stepIndex + ' - ' + currStep.name] = new Array(numberOfPlans).fill("תוכנית")
        }
    }

    const createLinks = (stepOrigin, planIndex, objectiveIndex, linksTemplate) => {
        var links = [];
        for (var index in linksTemplate) {
            var linkToCreate = JSON.parse(JSON.stringify(linksTemplate[index]));
            linkToCreate.fromPath = linkToCreate.fromPath.format(planIndex);
            linkToCreate.toPath = linkToCreate.toPath.format(objectiveIndex);
            linkToCreate.fromStep = stepOrigin;
            links.push(linkToCreate);
        }

        return links;
    }

    const onLinksChecked = (event, targetIndex) => {
        var checkedResult = event.value;
        var allLinksToAdd = [];

        for (var key in checkedResult) {
            for (var objectiveIndex in checkedResult[key]) {
                if (checkedResult[key][objectiveIndex]) {
                    var currLinksToAdd = createLinks(parseInt(key),
                        objectiveIndex,
                        targetIndex,
                        linksTemplate);
                    allLinksToAdd = allLinksToAdd.concat(currLinksToAdd);
                }
            }
        }

        setLinksToAdd(allLinksToAdd);
    };

    const addLink = () => {
        const currStepNumber = context.data.currOpenStep;
        var links = context.data.currScenario.steps[currStepNumber].links;
        links = links.concat(linksToAdd);

        context.data.currScenario.steps[currStepNumber].links = links;
        props.closePopupCallback();
    };

    return (

        <div style={{ paddingTop: 60 }} rtl>
            {[...Array(currStepTargetsCount).keys()].map(targetIndex =>
                <div style={{ marginBottom: 50 }}>
                    <center style={{ marginBottom: 30 }}>
                        <h2>יעד ({targetIndex})</h2>
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
                                    onChange={(event) => onLinksChecked(event, targetIndex, 'intel')}
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
