import React, { useState, useContext } from "react";
import EntitySelectInput from '../EntitySelectInput/EntitySelectInput'
import HummusContext, { HummusConsumer } from '../HummusContext'
import { getValue, toastProperties } from '../Utility';
import { Col, Row } from 'react-bootstrap';
import { toast } from 'react-toastify';


export default function LinkTarget(props) {
    const [intelLinksToAdd, setIntelLinkstoAdd] = useState([]);
    const [agamLinksToAdd, setAgamLinkstoAdd] = useState([]);

    const context = useContext(HummusContext)

    const targetJson = context.data.currScenario.steps[context.data.currOpenStep].jsonToEdit;
    const currStepTargetsCount = targetJson.Target.length;
    const intelLinkPath = '/Target/{0}/Planning';
    const agamLinkPath = '/Target/{0}/Homworks';

    const linksType = {
        agam: {
            changeLinksList: setAgamLinkstoAdd,
            linksTemplate: [{
                fromPath: '/Object/{0}/FirstThing/name',
                toPath: '/Target/{0}/Homworks/{1}/Pages',
                fromStep: -1,
            }, {
                fromPath: '/Object/{0}/FirstThing/number',
                toPath: '/Target/{0}/Homworks/{1}/better',
                fromStep: -1,
            }]
        },
        intel: {
            changeLinksList: setIntelLinkstoAdd,
            linksTemplate: [{
                fromPath: '/Object/{0}/FirstThing/name',
                toPath: '/Target/{0}/Planning/{1}/name',
                fromStep: -1,
            }, {
                fromPath: '/Object/{0}/FirstThing/number',
                toPath: '/Target/{0}/Planning/{1}/number',
                fromStep: -1,
            }]
        }
    }


    // Get the objectives from all steps before curr step, for the EntitySelectInput
    var objectivesJson = {};
    for (var stepIndex = 0; stepIndex < context.data.currOpenStep; stepIndex++) {
        var currStep = context.data.currScenario.steps[stepIndex];
        if (currStep.entity === 'Objective') {
            var numberOfObjectives = currStep.jsonToEdit.Objective.length;
            objectivesJson[stepIndex + ' - ' + currStep.name] = new Array(numberOfObjectives).fill("יעד")
        }
    }

    const createLinks = (stepOrigin, objectiveIndex, targetIndex, linkIndex, linksTemplate) => {
        var links = [];
        for (var index in linksTemplate) {
            var linkToCreate = JSON.parse(JSON.stringify(linksTemplate[index]));
            linkToCreate.fromPath = linkToCreate.fromPath.format(objectiveIndex);
            linkToCreate.toPath = linkToCreate.toPath.format(targetIndex, linkIndex);
            linkToCreate.fromStep = stepOrigin;
            links.push(linkToCreate);
        }

        return links;
    }

    const onLinksChecked = (event, targetIndex, linkType) => {
        var checkedResult = event.value;
        var allLinksToAdd = [];
        var linkIndex = 0;

        for (var key in checkedResult) {
            for (var objectiveIndex in checkedResult[key]) {
                if (checkedResult[key][objectiveIndex]) {
                    var currLinksToAdd = createLinks(parseInt(key),
                        objectiveIndex,
                        targetIndex,
                        linkIndex,
                        linksType[linkType].linksTemplate);
                    linkIndex++;
                    allLinksToAdd = allLinksToAdd.concat(currLinksToAdd);
                }
            }
        }

        linksType[linkType].changeLinksList(allLinksToAdd);
    };

    const validateLinks = () => {
        if (agamLinksToAdd.length === 0 && intelLinksToAdd.length === 0) {
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
            var newLinksList = links.concat(intelLinksToAdd)
                .concat(agamLinksToAdd);

            context.data.currScenario.steps[currStepNumber].links = newLinksList;
            props.closePopupCallback();
        }
    };

    return (

        <div>

            <div className="description">* מספר הישויות שניתן לקשר אליהם תואם למספר הקישורים שקיימים בגיסון. אם אתם רוצים לקשר את המטרה ליותר ישויות, תוסיפו עוד קישורים לגיסון. </div>
            {[...Array(currStepTargetsCount).keys()].map(targetIndex =>
                <div style={{ marginBottom: 50 }}>
                    <center className="entity-headline">
                        <h2>מטרה ({targetIndex})</h2>
                    </center>
                    <div>

                        <Row style={{ marginRight: 15 }}>
                            <Col style={{ padding: 0 }} lg='2'>
                                <div style={{ textAlign: 'right' }}>קישור מודיעיני ליעד: </div>
                            </Col>
                            <Col>
                                <EntitySelectInput
                                    style={{ float: 'left' }}
                                    input={objectivesJson}
                                    header='בחר יעדים'
                                    onChange={(event) => onLinksChecked(event, targetIndex, 'intel')}
                                    entitiesSelectLimit={getValue(targetJson, intelLinkPath.format(targetIndex)).length}
                                />
                            </Col>
                        </Row>
                        <br />
                        <Row style={{ marginRight: 15 }}>
                            <Col style={{ padding: 0 }} lg='2'>
                                <div style={{ textAlign: 'right' }}>קישור אגמי ליעד: </div>
                            </Col>
                            <Col>
                                <EntitySelectInput
                                    style={{ float: 'left' }}
                                    input={objectivesJson}
                                    header='בחר יעדים'
                                    onChange={(event) => onLinksChecked(event, targetIndex, 'agam')}
                                    entitiesSelectLimit={getValue(targetJson, agamLinkPath.format(targetIndex)).length}
                                />
                            </Col>
                        </Row>



                    </div>

                </div>

            )}

            <i onClick={() => addLink()} className="fas fa-check link-check fa-2x"></i>
            <p style={{position:'absolute', bottom: -15, left: 0, fontSize: 15}}>נוי מלכת הקישורים</p>

        </div>
    );
}
