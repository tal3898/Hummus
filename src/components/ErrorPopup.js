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

    getSingleErrorDiv(errorJson) {
        return <p className="step-error"><pre> {JSON.stringify(errorJson, undefined, 4)} </pre></p>
    }

    getSingleErrorDivWithStep(errorJson, stepIndex) {
        return <div className="step-error"><pre> {stepIndex} - {JSON.stringify(errorJson, undefined, 4)} </pre><hr /></div>
    }

    getErrorDiv() {
        if (this.state.error.length == 1) {
            return this.getSingleErrorDiv(this.state.error[0]);
        }

        var allErrors = [<hr />];
        for (var index in this.state.error) {
            allErrors.push(this.getSingleErrorDivWithStep(this.state.error[index], index))
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
                    <center>
                        <h1>Error</h1>
                    </center>
                    <div style={{ fontSize: 40, marginBottom: 5, maxHeight: 500, overflowY: 'scroll' }}>



                        {this.getErrorDiv()}
                    </div>

                </Popup>
            </Styles>
        )
    }
}

export default ErrorPopup;