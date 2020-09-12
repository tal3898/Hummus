import React, { useState, useContext } from "react";
import HummusContext, { HummusConsumer } from './HummusContext'
import Graph from "react-graph-vis";
import { Form, Col, Row } from 'react-bootstrap';

export default function LinksVisualization(props) {

    const [selectedNode, setSelectedNode] = useState(0);

    const context = useContext(HummusContext);

    const buildParentsLinksDescriptoin = () => {
        var parentsLinks = {};
        var selectedNodeLinks = context.data.currScenario.steps[selectedNode].links;
        
        for (var linkIndex in selectedNodeLinks) {
            var parentStep = selectedNodeLinks[linkIndex].fromStep;
            var parentStepName = context.data.currScenario.steps[parentStep].name;
            var linkHeadline = parentStep + ' - ' + parentStepName;

            if (parentsLinks[linkHeadline] == undefined) {
                parentsLinks[linkHeadline] = [];
            }

            parentsLinks[linkHeadline].push(selectedNodeLinks[linkIndex]);
        }

        return parentsLinks;
    };

    const buildChildrenLinksDescription = () => {
        var childrenLinks = {};

        for (var childStep = selectedNode; childStep < context.data.currScenario.steps.length; childStep++) {
            var stepData = context.data.currScenario.steps[childStep];

            for (var linkIndex in stepData.links) {
                if (stepData.links[linkIndex].fromStep == selectedNode) {
                    var childStepName = stepData.name;
                    var linkHeadline = childStep + ' - ' + childStepName;

                    if (childrenLinks[linkHeadline] == undefined) {
                        childrenLinks[linkHeadline] = [];
                    }

                    childrenLinks[linkHeadline].push(stepData.links[linkIndex]);
                }
            }
        }

        return childrenLinks;
    };

    const removeDuplicatesElements = (arrayOfJson) => {
        const arrayWithoutDuplicates = [... new Set(
            arrayOfJson.map(element => JSON.stringify(element))
        )]
            .map(element => JSON.parse(element));

        return arrayWithoutDuplicates;
    }

    const buildGraphFromSteps = () => {
        var nodes = [];
        var edges = [];

        for (var stepIndex in context.data.currScenario.steps) {
            var stepData = context.data.currScenario.steps[stepIndex];
            nodes.push({
                id: stepIndex,
                label: stepIndex + ' - ' + stepData.name,
                title: stepIndex + ' - ' + stepData.name

            });

            for (var linkIndex in stepData.links) {
                edges.push({
                    from: stepData.links[linkIndex].fromStep,
                    to: stepIndex
                })
            }
        }

        edges = removeDuplicatesElements(edges);

        const finalGraph = {
            nodes: nodes,
            edges: edges
        };

        return finalGraph;
    }


    const options = {
        layout: {
            hierarchical: false
        },
        edges: {
            color: "#000000"
        },
        nodes: {
            color: "#bbdefb"
        },
        height: "350px"
    };

    const events = {
        selectNode: (event) => {
            setSelectedNode(event.nodes[0]);
        }
    };

    const graph = buildGraphFromSteps();
    const parentsLinks = buildParentsLinksDescriptoin();
    const childrenLinks = buildChildrenLinksDescription();

    return (
        <div >
            <Graph
                graph={graph}
                options={options}
                events={events}
                getNetwork={network => {
                    //  if you want access to vis.js network api you can set the state in a parent component using this property
                }}
            />
            <hr />
            <Row>
                <Col>
                    <h4>Parents Links:</h4>
                </Col>
                <Col>
                    <h4>Children Links:</h4>
                </Col>
            </Row>
            <Row style={{ overflowY: 'scroll', height: 100, width: '100%' }}>
                <Col>
                    {Object.keys(parentsLinks).map(step =>
                        <div>
                            <h5 style={{ paddingLeft: 20 }}>{step}</h5>
                            {parentsLinks[step].map(link =>
                                <div style={{ paddingLeft: 40, marginBottom: 10 }}>
                                    <p style={{ marginBottom: 0, fontSize: 12 }}>from: {link.fromPath}</p>
                                    <p style={{ marginBottom: 0, fontSize: 12 }}>to: {link.toPath}</p>
                                </div>
                            )}
                        </div>
                    )}
                </Col>
                <Col>
                    {Object.keys(childrenLinks).map(step =>
                        <div>
                            <h5 style={{ paddingLeft: 20 }}>{step}</h5>
                            {childrenLinks[step].map(link =>
                                <div style={{ paddingLeft: 40, marginBottom: 10 }}>
                                    <p style={{ marginBottom: 0, fontSize: 12 }}>from: {link.fromPath}</p>
                                    <p style={{ marginBottom: 0, fontSize: 12 }}>to: {link.toPath}</p>
                                </div>
                            )}
                        </div>
                    )}
                </Col>
            </Row>

        </div>
    );
}
