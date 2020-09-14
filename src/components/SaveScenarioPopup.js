import React from 'react';
import styled from 'styled-components';
import { Form, Col, Row } from 'react-bootstrap';

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
    cursor: pointer;
    
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


class SaveScenarioPopup extends React.Component {

    static contextType = HummusContext;

    constructor(props) {
        super(props)
        this.state = {
            isOpen: props.isOpen,
            scenarioData: props.scenarioData,
            folderHierarchy: {}
        }

        this.onCloseCallback = props.onClose;
        this.selectedPath = '';
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


        if (!isInputValid(this.state.scenarioData.name)) {
            toast.error("Scenario name cannot be empty, or contain one of these characters: " + blackList.join(' '), toastProperties);
        } else {
            var folderPath = this.selectedPath;
            if (folderPath == '') {
                toast.error("Please select a folder.", toastProperties);
            } else {
                var fileFullPath = folderPath + '/' + this.state.scenarioData.name;

                var jsonToSaveInDB = {
                    path: fileFullPath,
                    name: this.state.scenarioData.name,
                    description: this.state.scenarioData.description,
                    steps: this.state.scenarioData.steps
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
                        this.context.loadFolderHiierarchy((data) => {
                            this.context.data.scenariosHierarchy = data;
                            this.context.updateData(this.context);
                        });
                    }).catch(error => {
                        console.error("db error: ", error);
                        toast.error("error occured while saving", toastProperties);
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


                        <div style={{ marginBottom: 40, marginTop: 10 }}>
                            <center>
                                <i id="saveScenarioBtn" style={{ position: 'absolute', top: 5, left: 15 }} className="far fa-save fa-3x" onClick={() => this.save()}></i>

                                <h1 style={{ fontSize: 30, marginBottom: 1 }}>Choose a folder</h1>
                            </center>
                        </div>
                        <div style={{ marginRight: 10, height: 400 }} className="directory-tree">
                            <JsonViewer
                                type="folder"
                                isShowLeaves={false}
                                onKeySelected={(event) => this.selectedPath = event.clickedPath}
                                json={this.state.folderHierarchy}
                                level={0}
                            />
                        </div>
                    </div>
                </Popup>

                <ToastContainer />
            </Styles>
        )
    }
}

export default SaveScenarioPopup;