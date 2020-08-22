import React, { useState, useContext } from "react";
import EntitySelectInput from '../EntitySelectInput/EntitySelectInput'
import HummusContext, { HummusConsumer } from '../HummusContext'
import { getValue } from '../Utility';
import { Col, Row } from 'react-bootstrap';


export default function LinkTarget(props) {
    const [linksToAdd, setLinkstoAdd] = useState([]);

    const context = useContext(HummusContext)

    const targetJson = JSON.parse(context.data.currScenario.steps[context.data.currOpenStep].jsonToEdit);
    const currStepTargetsCount = targetJson.Target.length;
    const intelLinkPath = '/Target/{0}/Planning';
    const intelLinkTemplate = [{
        fromPath: '/Object/{0}/FirstThing/name',
        toPath: '/Target/{0}/Planning/{1}/name',
        fromStep: -1,
    }, {
        fromPath: '/Object/{0}/FirstThing/number',
        toPath: '/Target/{0}/Planning/{1}/number',
        fromStep: -1,
    }];


    // Get the objectives from all steps before curr step, for the EntitySelectInput
    var objectivesJson = {};
    for (var stepIndex=0; stepIndex < context.data.currOpenStep; stepIndex++  ) {
        var currStep = context.data.currScenario.steps[stepIndex];
        if (currStep.entity === 'Objective') {
            var numberOfObjectives = JSON.parse(currStep.jsonToEdit).Objective.length;
            objectivesJson[stepIndex + '-' + currStep.name] = new Array(numberOfObjectives).fill("יעד")
        }
    }

    const createIntelLinks = (stepOrigin, objectiveIndex, targetIndex, intelIndex) => {
        var links = [];
        for (var index in intelLinkTemplate) {
            var linkToCreate = JSON.parse(JSON.stringify(intelLinkTemplate[index]));
            linkToCreate.fromPath = linkToCreate.fromPath.format(objectiveIndex);
            linkToCreate.toPath = linkToCreate.toPath.format(targetIndex, intelIndex);
            linkToCreate.fromStep = stepOrigin;
            links.push(linkToCreate);
        }

        return links;
    }

    const onLinksChecked = (event, targetIndex) => {
        var checkedResult = event.value;
        var allIntelLinksToAdd = [];
        var linkIndex = 0;

        for (var key in checkedResult) {
            for (var objectiveIndex in checkedResult[key]) {
                if (checkedResult[key][objectiveIndex]) {

                    var intelLinksToAdd = createIntelLinks(parseInt(key), objectiveIndex, targetIndex, linkIndex);
                    linkIndex++;
                    allIntelLinksToAdd = allIntelLinksToAdd.concat(intelLinksToAdd);

                }
            }
        }

        setLinkstoAdd(allIntelLinksToAdd);
    };

    const addLink = () => {
        const currStepNumber = context.data.currOpenStep;
        var links = context.data.currScenario.steps[currStepNumber].links;
        var newLinksList = links.concat(linksToAdd);

        context.data.currScenario.steps[currStepNumber].links = newLinksList;
    };

    return (

        <div style={{ paddingTop: 60 }} rtl>
            <span>* מספר הישויות שניתן לקשר תואם למספר הקישורים שקיימים בגיסון. אם אתם רוצים לקשר יותר ישויות, תוסיפו קישורים לגיסון.</span>
            {[...Array(currStepTargetsCount).keys()].map(targetIndex =>
                <div rtl>
                    <center style={{marginBottom: 20}}>
                        <h2>מטרה</h2>
                    </center>
                    <div>

                    <Row>
                            <Col>
                                <label >קישור מודיעיני ליעד: </label>
                            </Col>
                            <Col>
                                <EntitySelectInput
                                    style={{ float: 'left' }}
                                    input={objectivesJson}
                                    onChange={(event) => onLinksChecked(event, targetIndex)}
                                    entitiesSelectLimit={getValue(targetJson, intelLinkPath.format(targetIndex)).length}
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
