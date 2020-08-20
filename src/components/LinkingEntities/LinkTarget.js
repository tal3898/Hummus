import React, { useState, useContext } from "react";
import EntitySelectInput from '../EntitySelectInput/EntitySelectInput'
import HummusContext, { HummusConsumer } from '../HummusContext'


export default function LinkTarget(props) {
    //this.currStepEnglishCount = JSON.parse(this.context.data.currScenario.steps[this.context.data.currOpenStep].jsonToEdit).English.length;
    const [linksToAdd, setLinkstoAdd] = useState([]);
    const context = useContext(HummusContext)
    

    var objectivesJson = {};
    for (var stepIndex in context.data.currScenario.steps) {
        var currStep = context.data.currScenario.steps[stepIndex];
        if (currStep.entity === 'Objective') {
            var numberOfObjectives = JSON.parse(currStep.jsonToEdit).Objective.length;
            objectivesJson[stepIndex + '-' + currStep.name] = new Array(numberOfObjectives).fill("יעד")
        }
    }

    const intelLinkTemplate = [{
        fromPath: '/Object/{0}/FirstThing/name',
        toPath: '/Target/{0}/Planning/{1}/name',
        fromStep: -1,
    }, {
        fromPath: '/Object/{0}/FirstThing/number',
        toPath: '/Target/{0}/Planning/{1}/number',
        fromStep: -1,
    }];

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

    const onLinksChecked = (event) => {
        var checkedResult = event.value;
        for (var key in checkedResult) {
            for (var index in checkedResult[key]) {
                if (checkedResult[key][index]) {
                    //var intelLinkToAdd = createIntelLinks(key)
                }
            }
        }
    };



    const currStepEnglishCount = 7;
    return (

        <div>
            <p >* מספר הישויות שניתן לקשר תואם למספר הקישורים שקיימים בגיסון. אם אתם רוצים לקשר יותר ישויות, תוסיפו קישורים לגיסון.</p>
            {new Array(currStepEnglishCount).fill(0).map(index =>
                <div rtl>
                    <center>
                        <h2>מטרה</h2>
                    </center>
                    <div>
                        <div dir="rtl" style={{ paddingTop: 10, display: 'inline-block' }}>
                            <input
                                style={{ marginLeft: 10 }}
                                dir="rtl"
                                type="checkbox"
                                id="intelConn" />
                            <label for="intelConn">קישור  1</label>
                        </div>
                        <EntitySelectInput style={{ float: 'left' }} 
                            input={objectivesJson}
                        />
                    </div>
   
                </div>

            )}

        </div>
    );
}
