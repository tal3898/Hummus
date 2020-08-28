import React, { useState, useContext } from "react";
import EntitySelectInput from '../EntitySelectInput/EntitySelectInput'
import HummusContext from '../HummusContext'
import { getValue } from '../Utility';
import { Col, Row } from 'react-bootstrap';


export default function LinkPlan(props) {
    const [missionLinksToAdd, setMissionLinksToAdd] = useState([]);
    const [objectiveLinksToAdd, setObjectiveLinksToAdd] = useState([]);

    const context = useContext(HummusContext)

    const planJson = JSON.parse(context.data.currScenario.steps[context.data.currOpenStep].jsonToEdit);
    const currStepPlansCount = planJson.Plan.length;
    const linkPlanPath = '/Plan/{0}/Homworks';

    const linksTypes = {
        mission: {
            linksTemplate: [{
                fromPath: '/Mission/{0}/FirstThing/name',
                toPath: '/Plan/{0}/Homworks/{0}/nameM',
                fromStep: -1,
            }, {
                fromPath: '/Mission/{0}/FirstThing/number',
                toPath: '/Plan/{0}/Homworks/{0}/numberM',
                fromStep: -1,
            }]
        },
        objective: {
            linksTemplate: [{
                fromPath: '/Objective/{0}/FirstThing/name',
                toPath: '/Plan/{0}/Homworks/{0}/nameO',
                fromStep: -1,
            }, {
                fromPath: '/Objective/{0}/FirstThing/number',
                toPath: '/Plan/{0}/Homworks/{0}/numberO',
                fromStep: -1,
            }]
        }
    };

    // Get the objectives from all steps before curr step, for the EntitySelectInput
    var objectivesJson = {};
    for (var stepIndex = 0; stepIndex < context.data.currOpenStep; stepIndex++) {
        var currStep = context.data.currScenario.steps[stepIndex];
        if (currStep.entity === 'Objective') {
            var numberOfMissions = JSON.parse(currStep.jsonToEdit).Objective.length;
            objectivesJson[stepIndex + ' - ' + currStep.name] = new Array(numberOfMissions).fill("יעד")
        }
    }

    // Get the missions from all steps before curr step, for the EntitySelectInput
    var missionsJson = {};
    for (var stepIndex = 0; stepIndex < context.data.currOpenStep; stepIndex++) {
        var currStep = context.data.currScenario.steps[stepIndex];
        if (currStep.entity === 'Mission') {
            var numberOfMissions = JSON.parse(currStep.jsonToEdit).Mission.length;
            missionsJson[stepIndex + ' - ' + currStep.name] = new Array(numberOfMissions).fill("משימה")
        }
    }

    const createLinks = (planIndex, linkIndex, entityStep, entityIndex, linksTemplate) => {
        var links = [];
        for (var linkTemplateIndex in linksTemplate) {
            var linkToCreate = JSON.parse(JSON.stringify(linksTemplate[linkTemplateIndex]));

            linkToCreate.fromPath = linkToCreate.fromPath.format(entityIndex);
            linkToCreate.toPath = linkToCreate.toPath.format(planIndex, linkIndex);
            linkToCreate.fromStep = entityStep;
            links.push(linkToCreate);
        }

        return links;
    }

    const onObjectiveChecked = (event, linkIndex, planIndex) => {
        const { step, childIndex, checked } = event.selected;
        const stepNumber = parseInt(step);
        
        if (checked) {
            var linksToAdd = createLinks(planIndex, linkIndex, stepNumber, childIndex, linksTypes.objective.linksTemplate);
            setObjectiveLinksToAdd(linksToAdd);
        } else {
            setObjectiveLinksToAdd([]);
        }
    };

    const onMissionChecked = (event, linkIndex, planIndex) => {
        const { step, childIndex, checked } = event.selected;
        const stepNumber = parseInt(step);
        
        if (checked) {
            var linksToAdd = createLinks(planIndex, linkIndex, stepNumber, childIndex, linksTypes.mission.linksTemplate);
            setMissionLinksToAdd(linksToAdd);
        } else {
            setMissionLinksToAdd([]);
        }
    }

    const addLink = () => {
        const currStepNumber = context.data.currOpenStep;
        var links = context.data.currScenario.steps[currStepNumber].links;
        var newLinksList = links.concat(missionLinksToAdd)
            .concat(objectiveLinksToAdd);

        context.data.currScenario.steps[currStepNumber].links = newLinksList;
        props.closePopupCallback();
    };

    return (

        <div>
            
            <div className="description">* מספר הקישרוים שניתן לבצע, תואם למספר הקישורים שנמצאים בגיסון. אם אתם רוצים לבצע יותר קישורים, יש להוסיף את קישורים לגיסון של התוכנית. היקשור ליעד ומשימה מתקיים בהתאמה למספר הקישור.</div>

            {[...Array(currStepPlansCount).keys()].map(planIndex =>
                <div style={{ marginBottom: 50 }}>
                    <center className="entity-headline">
                        <h2>תוכנית ({planIndex})</h2>
                    </center>
                    <div>

                        {getValue(planJson, linkPlanPath.format(planIndex)).map((linkJson, linkIndex) =>
                            <Row style={{ marginRight: 15, marginBottom: 10 }}>
                                <Col style={{ padding: 0 }} lg='3'>
                                    <div style={{ textAlign: 'right' }}>({linkIndex}) קישור יעד למשימה: </div>
                                </Col>
                                <Col lg="4">
                                    <EntitySelectInput
                                        style={{ float: 'left' }}
                                        input={objectivesJson}
                                        header='בחר יעד'
                                        onChange={(event) => onObjectiveChecked(event, linkIndex, planIndex)}
                                        entitiesSelectLimit={1}
                                    />
                                </Col>
                                <Col>
                                    <EntitySelectInput
                                        style={{ float: 'left' }}
                                        input={missionsJson}
                                        header='בחר משימה'
                                        onChange={(event) => onMissionChecked(event, linkIndex, planIndex)}
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
