import React from 'react';
import styled from 'styled-components';
import Popup from "reactjs-popup";

const Styles = styled.div`

.step-error {
    font-size: 20px;
}

`;
class ErrorPopup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: props.isOpen,
            error: props.error
        };

        this.onCloseCallback = props.onClose;
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        this.state.isOpen = newProps.isOpen;
        this.state.error = newProps.error;
        this.setState(this.state);
    }

    getErrorDiv() {
        if (this.state.error.length == 1) {
            return <div className="step-error"><pre> {JSON.stringify(this.state.error[0], undefined, 4)} </pre></div>
        } 

        var allErrors = [];
        for(var index in this.state.error) {
            allErrors.push(
                <span> {index} - {JSON.stringify(this.state.error[index], undefined, 4)} </span>
            )
        }

        return allErrors;
    }

    closePopup() {
        this.state.isOpen = false;
        this.setState(this.state);

        if (this.onCloseCallback) {
            this.onCloseCallback();
        }
    }

    render() {
        return (
            <Styles>
                <Popup
                    open={this.state.isOpen}
                    onClose={() => this.closePopup()}
                    modal
                    closeOnDocumentClick
                >
                    <div style={{ fontSize: 40, marginBottom: 25 }}>
                        <center>
                            <h1>Error</h1>
                        </center>

                        {this.getErrorDiv()}
                    </div>

                </Popup>
            </Styles>
        )
    }
}

export default ErrorPopup;