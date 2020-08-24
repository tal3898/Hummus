import React, { useState, useContext } from "react";
import EntitySelectInput from '../EntitySelectInput/EntitySelectInput'
import HummusContext, { HummusConsumer } from '../HummusContext'
import { getValue } from '../Utility';
import { Col, Row } from 'react-bootstrap';


export default function LinkPlan(props) {
    const [linksToAdd, setLinksToAdd] = useState([]);

    const context = useContext(HummusContext)

    const planJson = JSON.parse(context.data.currScenario.steps[context.data.currOpenStep].jsonToEdit);
    const currStepPlansCount = planJson.Plan.length;
    const linkPlanPath = '/Plan/{0}/Homworks';

// {
//     planIndex: -1,
//     planLinkIndex: -1,
//     missionIndex: -1,
//     objectiveIndex: -1  
// }

    const linksTemplate = [{
        fromPath: '/Mission/{0}/FirstThing/name',
        toPath: '/Plan/{0}/Homworks/{0}/nameM',
        fromStep: -1,
    }, {
        fromPath: '/Mission/{0}/FirstThing/number',
        toPath: '/Plan/{0}/Homworks/{0}/numberM',
        fromStep: -1,
    }, {
        fromPath: '/Objective/{0}/FirstThing/name',
        toPath: '/Plan/{0}/Homworks/{0}/nameM',
        fromStep: -1,
    }, {
        fromPath: '/Objective/{0}/FirstThing/number',
        toPath: '/Plan/{0}/Homworks/{0}/numberM',
        fromStep: -1,
    },];


    // Get the objectives from all steps before curr step, for the EntitySelectInput
    var objectivesJson = {};
    for (var stepIndex = 0; stepIndex < context.data.currOpenStep; stepIndex++) {
        var currStep = context.data.currScenario.steps[stepIndex];
        if (currStep.entity === 'Objective') {
            var numberOfPlans = JSON.parse(currStep.jsonToEdit).Plan.length;
            objectivesJson[stepIndex + ' - ' + currStep.name] = new Array(numberOfPlans).fill("יעד")
        }
    }

    // Get the missions from all steps before curr step, for the EntitySelectInput
    var missionsJson = {};
    for (var stepIndex = 0; stepIndex < context.data.currOpenStep; stepIndex++) {
        var currStep = context.data.currScenario.steps[stepIndex];
        if (currStep.entity === 'Mission') {
            var numberOfPlans = JSON.parse(currStep.jsonToEdit).Plan.length;
            missionsJson[stepIndex + ' - ' + currStep.name] = new Array(numberOfPlans).fill("משימה")
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

    const addLink = () => {
        const currStepNumber = context.data.currOpenStep;
        var links = context.data.currScenario.steps[currStepNumber].links;
        links = links.concat(linksToAdd);

        context.data.currScenario.steps[currStepNumber].links = links;
        props.closePopupCallback();
    };

    return (

        <div style={{ paddingTop: 60 }} rtl>
            {[...Array(currStepPlansCount).keys()].map(planIndex =>
                <div style={{ marginBottom: 50 }}>
                    <center style={{ marginBottom: 30 }}>
                        <h2>תוכנית ({planIndex})</h2>
                    </center>
                    <div>

                        {getValue(planJson, linkPlanPath.format(planIndex)).map( (linkJson, linkIndex) => 
                            <Row style={{ marginRight: 15, marginBottom: 10 }}>
                                <Col style={{ padding: 0 }} lg='2'>
                                    <div style={{ textAlign: 'right' }}>קישור יעד למשימה: </div>
                                </Col>
                                <Col lg="4">
                                    <EntitySelectInput
                                        style={{ float: 'left' }}
                                        input={objectivesJson}
                                        header='בחר יעד'
                                        onChange={(event) => onLinksChecked(event, linkIndex, planIndex)}
                                        entitiesSelectLimit={1}
                                    />
                                </Col>
                                <Col>
                                    <EntitySelectInput
                                        style={{ float: 'left' }}
                                        input={missionsJson}
                                        header='בחר משימה'
                                        onChange={(event) => onLinksChecked(event, planIndex)}
                                        entitiesSelectLimit={1}
                                    />
                                </Col>
                            </Row>
                        )}



                    </div>

                </div>

            )}

            <i onClick={() => addLink()} className="fas fa-check link-check fa-2x"></i>

        </div>
    );
}
