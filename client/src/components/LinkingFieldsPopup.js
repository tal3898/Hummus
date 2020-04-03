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


class LinkingFieldsPopup extends React.Component {

    static contextType = HummusContext;

    constructor(props) {
        super(props)
        this.state = {
            isOpen: false,
            json: props.json
        }
        this.onCloseCallback = props.onClose;
        this.jsonViewerNode = React.createRef();
    }


    UNSAFE_componentWillReceiveProps(newProps) {
        this.state.isOpen = newProps.isOpen;
        this.setState(this.state);
    }

    close() {
        this.onCloseCallback();
        this.state.isOpen = false;
        this.setState(this.state);
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
                        <Col>
                            <Form.Label style={{ fontSize: 30, marginBottom: 1 }}>בחר תקייה</Form.Label>
                        </Col>
                    </Row>

                    <div style={{ marginRight: 10, marginLeft: 10, height: 400, backgroundColor: '#21252b' }} className="directory-tree">
                        <JsonViewer
                            json={this.state.folderHierarchy}
                            ref={this.jsonViewerNode}
                        />
                    </div>
                </Popup>

            </Styles>
        )
    }
}

export default LinkingFieldsPopup;