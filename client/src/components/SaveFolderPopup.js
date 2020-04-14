import React from 'react';
import styled from 'styled-components';
import { Nav, Button, Form, FormControl, Col, Row } from 'react-bootstrap';
import { JSONEditor } from 'react-json-editor-viewer';
import EntityEditor from './EntityEditor';
import { Treebeard } from 'react-treebeard';
import HummusContext from './HummusContext'

import Popup from "reactjs-popup";
import ReactJson from 'react-json-view'
import JsonViewer from './JsonViewer';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ScenariosWindow from './ScenariosWindow';
import { isInputValid, blackList } from './Utility';

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




class SaveFolderPopup extends React.Component {

    static contextType = HummusContext;

    constructor(props) {
        super(props)
        this.state = {
            isOpen: false,
            scenarioData: props.scenarioData,
            folderHierarchy: {}
        }
        this.newFolderName = '';
        this.onCloseCallback = props.onClose;
        this.jsonViewerNode = React.createRef();
    }


    UNSAFE_componentWillReceiveProps(newProps) {
        this.state.isOpen = JSON.parse(newProps.isOpen);
        this.state.folderHierarchy = this.context.data.scenariosHierarchy;
        this.setState(this.state);
    }

    close() {
        this.onCloseCallback();
        this.state.isOpen = false;
        this.setState(this.state);
    }

    save() {
        const toastProperties = {
            autoClose: 6000,
            position: toast.POSITION.BOTTOM_RIGHT,
            pauseOnFocusLoss: false
        };

        if (!isInputValid(this.newFolderName)) {
            toast.error("Scenario name cannot be empty, or contain one of these characters: " + blackList.join(' '), toastProperties);
        } else {
            var folderPath = this.jsonViewerNode.current.getSelectedPath();
            if (folderPath == false) {
                toast.error("Please select a folder.", toastProperties);
            } else {
                var newFolderFullPath = folderPath + '/' + this.newFolderName;
    
                var requestBody = {
                    path: newFolderFullPath,
                }
    
                const requestOptions = {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(requestBody)
                };
    
                fetch('/folder', requestOptions)
                    .then(response => response.json())
                    .then(data => {
                        console.log("db response: " + JSON.stringify(data));
                        toast.success("Folder saved successfully", toastProperties);
                        this.context.loadFolderHiierarchy((data) => {
                            this.context.data.scenariosHierarchy = data;
                            this.context.updateData(this.context);
                        });
                    }).catch(error => {
                        console.error("db error: ", error);
                        toast.success("error occured while saving", toastProperties);
                    });
    
                console.log('data to save into ' + JSON.stringify(this.state.scenarioData));
    
                this.close();
                toast.warning("saving...", toastProperties);
            }
        }
        
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

                    <div>
                        <Row style={{ marginLeft: 0, marginTop: 7, marginBottom: 20 }}>
                            <Col lg="5">
                                <i className="far fa-save fa-3x" onClick={() => this.save()}></i>
                            </Col>
                            <Col>
                                <Form.Label style={{ fontSize: 30, color: '#424242', marginBottom: 1 }}>תקיה חדשה</Form.Label>
                            </Col>
                        </Row>

                        <div style={{marginBottom:70, marginRight:30}}>
                            
                            <Form.Label style={{ fontSize: 15, float:'right', marginLeft:20,  color: '#424242', marginBottom: 1 }}>שם תקייה חדשה</Form.Label>
                            <Form.Control
                                style={{width:200, float:'right'}}
                                size="sm"
                                onChange={(event) => this.newFolderName = event.target.value}
                                width="2px" />

                        </div>

                        <p style={{color: '#424242', float:'right', marginRight:30}}>מיקום תקיה חדשה</p>
                        <br/><br/>
                        <div style={{ marginRight: 10, marginLeft: 10, height: 400, backgroundColor: '#21252b' }} className="directory-tree">
                            <JsonViewer
                                json={this.state.folderHierarchy}
                                ref={this.jsonViewerNode}
                            />
                        </div>
                    </div>
                </Popup>

                <ToastContainer />
            </Styles>
        )
    }
}

export default SaveFolderPopup;