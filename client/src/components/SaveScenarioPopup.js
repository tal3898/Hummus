import React from 'react';
import styled from 'styled-components';
import { Nav, Button, Form, FormControl, Col, Row } from 'react-bootstrap';
import { JSONEditor } from 'react-json-editor-viewer';
import EntityEditor from './EntityEditor';
import { Treebeard } from 'react-treebeard';

import Popup from "reactjs-popup";
import ReactJson from 'react-json-view'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ScenariosWindow from './ScenariosWindow';

const Styles = styled.div`

.directory-tree {
    padding:10px;
    max-height: 500px;
    overflow-y: scroll;
}

.scenario-name-form {
    margin-top: 30px;
    margin-bottom: 20px;
}

.fa-save {
    margin-right:30px;
}

.fa-save:hover {
    color: red;
}

`;

const backupData = {
    name: 'root',
    toggled: true,
    children: [
        {
            name: 'a',
            children: [
                { name: 'b' }
            ]
        },
        {
            name: 'c'
        }, {
            name: 'd'
        }
    ]
};


class SaveScenarioPopup extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            isOpen: false,
            scenarioData: props.scenarioData,
            folderHierarchy: {}
        }

        this.state.folderHierarchy = {
            name: 'root',
            toggled: true,
            children: []
        };
        this.state.folderHierarchy.children = this.buildData(props.folderHierarchy)

        this.onToggle = this.onToggle.bind(this);

        this.onCloseCallback = props.onClose;
    }

    buildData(json) {
        var children = [];

        for (var key in json) {
            // if curr key, is folder, and not file
            if (!json[key].hasOwnProperty('steps')) {
                var keyObject = {
                    name: key
                };

                var keyChildren = this.buildData(json[key]);
                if (keyChildren.length > 0) {
                    keyObject.children = keyChildren;
                }

                children.push(keyObject);
            }
        }

        return children;
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        this.state.scenarioData = newProps.scenarioData;
        this.state.isOpen = JSON.parse(newProps.isOpen);

        this.state.folderHierarchy = {
            name: 'root',
            toggled: true,
            children: []
        };
        this.state.folderHierarchy.children = this.buildData(newProps.scenariosHierarchy)

        this.setState(this.state);
    }

    close() {
        this.onCloseCallback();
        this.state.isOpen = false;
        this.setState(this.state);
    }

    save() {
        var folderPath = this.findFullPath(this.state.folderHierarchy, this.state.cursor);
        folderPath = folderPath.replace('/root', '');
        var fileFullPath = folderPath + '/' + this.state.scenarioData.name;

        var jsonToSaveInDB = {
            path: fileFullPath,
            steps: [this.state.scenarioData]
        }

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(jsonToSaveInDB)
        };

        fetch('/scenario', requestOptions)
            .then(response => response.json())
            .then(data => {
                console.log("db response: " + JSON.stringify(data));
            }).catch(error => {
                console.error("db error: ", error)
            });

        console.log('data to save into ' + JSON.stringify(this.state.scenarioData))
    }

    findFullPath(data, childFolder) {
        if (data == childFolder) {
            return '/' + childFolder.name;
        } else if (!data.hasOwnProperty('children')) {
            return false;
        } else {
            for (var index in data.children) {
                var childFullPath = this.findFullPath(data.children[index], childFolder);
                if (childFullPath != false) {
                    return '/' + data.name + childFullPath
                }
            }

            return false;
        }
    }

    /**
     * When clicking on a node, this will be called. it gets the selected node, and if toggled.
     * the function, dis-toggle the prev selected node, select the new one in state.cursor, and open
     * the node, if has children
     * 
     * @param {*} node 
     * @param {*} toggled 
     */
    onToggle(node, toggled) {
        const { cursor, folderHierarchy } = this.state;
        if (cursor) {
            this.state.cursor.active = false;
        }
        node.active = true;
        if (node.children) {
            node.toggled = toggled;
        }
        console.log('full path ' + this.findFullPath(folderHierarchy, node));
        this.setState({ cursor: node, folderHierarchy: Object.assign({}, folderHierarchy) });
    }


    render() {
        return (
            <Styles>

                <Popup
                    open={this.state.isOpen}
                    onClose={() => this.close()}
                    modal
                    active
                    closeOnDocumentClick
                >

                    <center>
                        <Form.Label style={{ fontSize: 30, marginTop: 10, marginBottom: 1 }}>בחר תקייה</Form.Label>
                    </center>

                    <div dir="rtl" className="scenario-name-form">
                        <Row style={{ marginTop: 1 }}>
                            <Col lg="1">
                                <i class="far fa-save fa-3x" onClick={() => this.save()}></i>
                            </Col>
                        </Row>
                    </div>


                    <div className="directory-tree">
                        <Treebeard
                            data={this.state.folderHierarchy}
                            onToggle={this.onToggle}
                        />
                    </div>
                </Popup>

                <ToastContainer />
            </Styles>
        )
    }
}

export default SaveScenarioPopup;