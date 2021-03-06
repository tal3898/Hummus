import React from 'react';
import styled from 'styled-components';
import { Col, Row } from 'react-bootstrap';
import Popup from "reactjs-popup";
import ReactJson from 'react-json-view'

import ReactTooltip from "react-tooltip";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Styles = styled.div`

.json-display {
    margin: 0px !important;
}

.json-popup {
    max-height: 500px;
    overflow-y: scroll;
}

.copy-json-btn {
    float:right;
    margin-right: 10px;
    margin-top: 10px;
}

.json-display {
    margin: 10px;
}

.fa-copy{
    color: #607d8b;
    cursor: pointer;

    padding:10px;
}


.fa-copy:hover {
    color: ${process.env.REACT_APP_scenarioActionHover};
}

.fa-copy:active {
    color: ${process.env.REACT_APP_scenarioActionActive};
}
`;

class JsonPopup extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            isOpen: false,
            json: JSON.parse(props.json),
            bombaJson: JSON.parse(props.bombaJson)
        }

        this.onCloseCallback = props.onClose;
    }

    copyToClipboard(json) {
        var str = JSON.stringify(json, undefined, 4)
        const el = document.createElement('textarea');
        el.value = str;
        el.setAttribute('readonly', '');
        el.style.position = 'absolute';
        el.style.left = '-9999px';
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);

        toast.success("Copied to clipboard", {
            autoClose: 2000,
            position: toast.POSITION.BOTTOM_RIGHT,
            pauseOnFocusLoss: false
        });
    };

    UNSAFE_componentWillReceiveProps(newProps) {
        this.state.json = JSON.parse(newProps.json);
        this.state.bombaJson = JSON.parse(newProps.bombaJson);
        this.state.isOpen = JSON.parse(newProps.isOpen);
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

                <Popup
                    open={this.state.isOpen}
                    onClose={() => this.close()}
                    modal
                    closeOnDocumentClick
                >
                    <ReactTooltip place="bottom" type="light" />

                    <div className='json-popup'>

                        <i data-tip="העתק לבומבה" id="copyJsonBtn" style={{ position: 'absolute', right: 45, top: 15, zIndex: 10, fontSize: 20 }} onClick={() => this.copyToClipboard(this.state.bombaJson)} className="far fa-copy"></i>
                        <i data-tip="העתק" id="copyJsonBtn" style={{ position: 'absolute', right: 20, top: 15, zIndex: 10, fontSize: 20 }} onClick={() => this.copyToClipboard(this.state.json)} className="fas fa-copy"></i>


                        <div style={{ marginTop: 10, backgroundColor: '#27281e', height: 500 }} className="json-display">
                            <ReactJson
                                src={this.state.json}
                                theme="monokai"
                                name={false}
                                enableClipboard={false}
                                collapseStringsAfterLength={50}
                                displayDataTypes={false} />
                        </div>

                    </div>
                </Popup>

                <ToastContainer />
            </Styles>
        )
    }
}

export default JsonPopup;