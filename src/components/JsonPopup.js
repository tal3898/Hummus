import React from 'react';
import styled from 'styled-components';
import { Nav, Button, Form, FormControl, Col, Row } from 'react-bootstrap';
import { JSONEditor } from 'react-json-editor-viewer';
import EntityEditor from './EntityEditor';
import Popup from "reactjs-popup";
import ReactJson from 'react-json-view'


const Styles = styled.div`

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


`;

class JsonPopup extends React.Component {

    constructor(props) {
        super(props)
    }

    copyToClipboard(str) {
        const el = document.createElement('textarea');
        el.value = str;
        el.setAttribute('readonly', '');
        el.style.position = 'absolute';
        el.style.left = '-9999px';
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
    };

    render() {
        return (
            <Styles>
                <Popup
                    trigger={<button className="button"> Open Modal </button>}
                    modal
                    closeOnDocumentClick
                >
                    <div className='json-popup'>
                        <Button onClick={() => this.copyToClipboard("hellllooo")} className='copy-json-btn' variant="outline-secondary">העתק</Button>
                        <br /><br />

                        <div className="json-display">
                            <ReactJson
                             src={{ "Ids": { "name": "abcdefghijklmnop" }, "werwerIds": { "name": "a" }, "asdIds": { "name": "a" }, "Idasdasds": { "name": "a" }, "Idcs": { "name": "a" }, "aIds": { "name": "a" }, "Planing": [{ "Goal": "learn piano", "Way": "play piano", "Time": "2020-07-13T00:00:00Z" }] }} 
                             theme="monokai" 
                             enableClipboard={false}
                             collapseStringsAfterLength={10}
                             displayDataTypes={false} />
                        </div>

                    </div>
                </Popup>
            </Styles>
        )
    }
}

export default JsonPopup;