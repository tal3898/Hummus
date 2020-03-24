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
        this.state = {
            isOpen: false,
            json: JSON.parse(props.json)
        }
    }

    copyToClipboard() {
        var str = JSON.stringify(this.state.json)
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

    UNSAFE_componentWillReceiveProps(newProps) {
        this.state.json = JSON.parse(newProps.json);
        this.setState(this.state);
    }

    click() {
        this.state.isOpen = true;
        this.setState(this.state);
        console.log('is open ' + this.state.isOpen)
    }

    close() {
        this.state.isOpen = false;
        this.setState(this.state);
    }

    render() {
        return (
            <Styles>
                <button className="button" onClick={()=> this.click()}> Open Modal </button>
                <Popup
                    open={this.state.isOpen}
                    onClose={()=>this.close()}
                    modal
                    closeOnDocumentClick
                >
                    <div className='json-popup'>
                        <Button onClick={() => this.copyToClipboard("hellllooo")} className='copy-json-btn' variant="outline-secondary">העתק</Button>
                        <br /><br />

                        <div className="json-display">
                            <ReactJson
                             src={this.state.json} 
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