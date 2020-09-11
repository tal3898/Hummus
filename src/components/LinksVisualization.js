import React, { useState, useContext } from "react";
import HummusContext, { HummusConsumer } from './HummusContext'
import Graph from "react-graph-vis";

export default function LinksVisualization(props) {

    const context = useContext(HummusContext);

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
        edges: {
            color: "#000000"
        },
        height: "500px"
    };

    const events = {
        select: function (event) {
            var { nodes, edges } = event;
        }
    };

    return (
        <Graph
            graph={graph}
            options={options}
            events={events}
            getNetwork={network => {
                //  if you want access to vis.js network api you can set the state in a parent component using this property
            }}
        />
    );
}
