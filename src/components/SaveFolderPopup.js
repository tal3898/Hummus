import React from 'react';
import styled from 'styled-components';
import {Form, Col, Row } from 'react-bootstrap';
import HummusContext from './HummusContext'

import Popup from "reactjs-popup";
import JsonViewer from './JsonViewer';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
    color: ${process.env.REACT_APP_scenarioActionHover};
}

.fa-save:hover {
    color: ${process.env.REACT_APP_scenarioActionHover};
}


`;

class SaveFolderPopup extends React.Component {

    static contextType = HummusContext;

    constructor(props) {
        super(props)
        this.state = {
            isOpen: false,
            parentPath: props.parentPath,
            scenarioData: props.scenarioData
        }
        this.newFolderName = '';
        this.onCloseCallback = props.onClose;
        this.jsonViewerNode = React.createRef();
    }


    UNSAFE_componentWillReceiveProps(newProps) {
        this.state.isOpen = JSON.parse(newProps.isOpen);
        this.state.parentPath = newProps.parentPath;
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
            if (this.state.parentPath == '') {
                toast.error("You cant create folder in root.", toastProperties);
            } else {
                var newFolderFullPath = this.state.parentPath + '/' + this.newFolderName;
    
                var requestBody = {
                    path: newFolderFullPath,
                }
    
                const requestOptions = {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(requestBody)
                };
                var toastId = toast.warning("saving...", toastProperties);
    
                fetch('/folder', requestOptions)
                    .then(response => response.json())
                    .then(data => {
                        console.log("db response: " + JSON.stringify(data));
                        toast.update(toastId,  {render:"Folder saved successfully", type: toast.TYPE.SUCCESS, autoClose: 2000 });
                        this.context.loadFolderHiierarchy((data) => {
                            this.context.data.scenariosHierarchy = data;
                            this.context.updateData(this.context);
                        });
                    }).catch(error => {
                        console.error("db error: ", error);
                        toast.update(toastId,  {render:"Error occured while saving", type: toast.TYPE.ERROR, autoClose: 2000 });
                    });
    
                console.log('data to save into ' + JSON.stringify(this.state.scenarioData));
    
                this.close();
                
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
                        <div style={{ marginLeft: 0, marginTop: 7, marginBottom: 30 }}>
                            <div style={{position:'absolute', left:0}}>
                                <i className="far fa-save fa-3x" onClick={() => this.save()}></i>
                            </div>
                            <center>
                                <h1 style={{ fontSize: 30, color: '#424242', marginBottom: 1 }}>New Folder</h1>
                            </center>
                        </div>

                        <div style={{marginBottom:70, marginRight:30}}>
                            
                            <Form.Label style={{ fontSize: 15, float:'right', marginLeft:20,  color: '#424242', marginBottom: 1 }}>שם תקייה חדשה</Form.Label>
                            <Form.Control
                                style={{width:200, float:'right'}}
                                size="sm"
                                onChange={(event) => this.newFolderName = event.target.value}
                                width="2px" />

                        </div>

                    </div>
                </Popup>

                <ToastContainer />
            </Styles>
        )
    }
}

export default SaveFolderPopup;