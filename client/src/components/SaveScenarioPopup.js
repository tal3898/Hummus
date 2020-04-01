import React from 'react';
import styled from 'styled-components';
import { Nav, Button, Form, FormControl, Col, Row } from 'react-bootstrap';
import { JSONEditor } from 'react-json-editor-viewer';
import EntityEditor from './EntityEditor';
import { Treebeard } from 'react-treebeard';
import HummusContext from './HummusContext'

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
    color: #607d8b;

    padding:10px;
    border-radius:5px;
    border-style:solid;
    border-width:0.012em;
    border-color: white;
}

.fa-save:active {
    border-color: #0091ea;
}

.fa-save:hover {
    color: #0091ea;
}

`;

const backupData2 = {
    name: 'root',
    toggled: true,
    children: [
        {
            name: 'parent',
            children: [
                { name: 'child1' },
                { name: 'child2' }
            ]
        },
        {
            name: 'parent',
            children: [
                {
                    name: 'nested parent',
                    children: [
                        { name: 'nested child 1' },
                        { name: 'nested child 2' }
                    ]
                }, {
                    name: 'nested parent',
                    children: [
                        { name: 'nested child 1' },
                        { name: 'nested child 2' }
                    ]
                }, {
                    name: 'nested parent',
                    children: [
                        { name: 'nested child 1' },
                        { name: 'nested child 2' }
                    ]
                }, {
                    name: 'nested parent',
                    children: [
                        { name: 'nested child 1' },
                        { name: 'nested child 2' }
                    ]
                }, {
                    name: 'nested parent',
                    children: [
                        { name: 'nested child 1' },
                        { name: 'nested child 2' }
                    ]
                }, {
                    name: 'nested parent',
                    children: [
                        { name: 'nested child 1' },
                        { name: 'nested child 2' }
                    ]
                }, {
                    name: 'nested parent',
                    children: [
                        { name: 'nested child 1' },
                        { name: 'nested child 2' }
                    ]
                }, {
                    name: 'nested parent',
                    children: [
                        { name: 'nested child 1' },
                        { name: 'nested child 2' }
                    ]
                }, {
                    name: 'nested parent',
                    children: [
                        { name: 'nested child 1' },
                        { name: 'nested child 2' }
                    ]
                }, {
                    name: 'nested parent',
                    children: [
                        { name: 'nested child 1' },
                        { name: 'nested child 2' }
                    ]
                }, {
                    name: 'nested parent',
                    children: [
                        { name: 'nested child 1' },
                        { name: 'nested child 2' }
                    ]
                }, {
                    name: 'nested parent',
                    children: [
                        { name: 'nested child 1' },
                        { name: 'nested child 2' }
                    ]
                }, {
                    name: 'nested parent',
                    children: [
                        { name: 'nested child 1' },
                        { name: 'nested child 2' }
                    ]
                }, {
                    name: 'nested parent',
                    children: [
                        { name: 'nested child 1' },
                        { name: 'nested child 2' }
                    ]
                }, {
                    name: 'nested parent',
                    children: [
                        { name: 'nested child 1' },
                        { name: 'nested child 2' }
                    ]
                }, {
                    name: 'nested parent',
                    children: [
                        { name: 'nested child 1' },
                        { name: 'nested child 2' }
                    ]
                }
            ]
        }
    ]
};



class SaveScenarioPopup extends React.Component {

    static contextType = HummusContext;

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
        this.state.folderHierarchy.children = this.buildData(this.context.data.scenariosHierarchy);

        this.setState(this.state);
    }

    close() {
        this.onCloseCallback();
        this.state.isOpen = false;
        this.setState(this.state);
    }

    save() {
        const toastProperties = {
            autoClose: 2000,
            position: toast.POSITION.BOTTOM_RIGHT,
            pauseOnFocusLoss: false
        };

        var folderPath = this.findFullPath(this.state.folderHierarchy, this.state.cursor);
        if (folderPath == false) {
            toast.error("Please select a folder.", toastProperties);
        } else {
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
                    toast.success("Scenario saved successfully", toastProperties);
                    this.context.loadFolderHiierarchy();
                }).catch(error => {
                    console.error("db error: ", error);
                    toast.success("error occured while saving", toastProperties);
                });

            console.log('data to save into ' + JSON.stringify(this.state.scenarioData));

            this.close();
            toast.warning("saving...", toastProperties);
        }
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
                <ToastContainer />


                <Popup
                    open={this.state.isOpen}
                    onClose={() => this.close()}
                    modal
                    active
                    closeOnDocumentClick
                >

                    <Row style={{ marginLeft: 0, marginTop: 7, marginBottom: 20 }}>
                        <Col lg="5">
                            <i class="far fa-save fa-3x" onClick={() => this.save()}></i>
                        </Col>
                        <Col>
                            <Form.Label style={{ fontSize: 30, marginBottom: 1 }}>בחר תקייה</Form.Label>
                        </Col>


                    </Row>

                    <div style={{ marginRight: 10, marginLeft: 10, height: 400, backgroundColor: '#21252b' }} className="directory-tree">
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