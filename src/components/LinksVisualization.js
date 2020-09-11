import React, { useState, useContext } from "react";
import HummusContext, { HummusConsumer } from './HummusContext'
import Graph from "react-graph-vis";
import { Form, Col, Row } from 'react-bootstrap';

export default function LinksVisualization(props) {

    const [selectedNode, setSelectedNode] = useState(0);

    const context = useContext(HummusContext);

    // build the parentsLinks
    var parentsLinks = {};
    var a = context.data.currScenario.steps[selectedNode].links;
    for (var linkIndex in a) {
        var parentStep = a[linkIndex].fromStep;
        var parentStepName = context.data.currScenario.steps[parentStep].name;
        var linkHeadline = parentStep + ' - ' + parentStepName;

        if (parentsLinks[linkHeadline] == undefined)  {
            parentsLinks[linkHeadline] = [];
        }

        parentsLinks[linkHeadline].push(a[linkIndex]);
    }

    // build the childrenLinks
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

    // build graph
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

    edges = [... new Set(
        edges.map(edge => JSON.stringify(edge))
    )]
        .map(edge => JSON.parse(edge))


    const graph = {
        nodes: nodes,
        edges: edges
    };

    const options = {
        layout: {
            hierarchical: false
        },
        click: (e) => alert('e'),
        edges: {
            color: "#000000"
        },
        nodes: {
            color: "#bbdefb"
        },
        height: "400px"
    };

    const events = {
        selectNode: function (event) {
            setSelectedNode(event.nodes[0]);
        }
    };

    return (
        <div>
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
                    {Object.keys(parentsLinks).map(step => 
                        <div>
                            <h5 style={{paddingLeft: 20}}>{step}</h5>
                            {parentsLinks[step].map(link => 
                                <div style={{paddingLeft: 40, marginBottom: 10}}>
                                    <p style={{marginBottom: 0, fontSize: 12}}>from: {link.fromPath}</p>
                                    <p style={{marginBottom: 0,fontSize: 12}}>to: {link.toPath}</p>
                                </div>
                                )}
                        </div>
                        )}
                </Col>
                <Col>
                <h4>Children Links:</h4>
                    {Object.keys(childrenLinks).map(step => 
                        <div>
                            <h5 style={{paddingLeft: 20}}>{step}</h5>
                            {childrenLinks[step].map(link => 
                                <div style={{paddingLeft: 40, marginBottom: 10}}>
                                    <p style={{marginBottom: 0, fontSize: 12}}>from: {link.fromPath}</p>
                                    <p style={{marginBottom: 0,fontSize: 12}}>to: {link.toPath}</p>
                                </div>
                                )}
                        </div>
                        )}
                </Col>
            </Row>

        </div>
    );
}
