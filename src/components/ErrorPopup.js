import React from 'react';
import styled from 'styled-components';
import Popup from "reactjs-popup";

const Styles = styled.div`

.feature-list-item {
    margin-bottom:11px;
}

`;
class ErrorPopup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: props.isOpen
        };

        this.onCloseCallback = props.onClose;
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        this.state.isOpen = newProps.isOpen;
        this.setState(this.state);
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
                    </div>

                </Popup>
            </Styles>
        )
    }
}

export default ErrorPopup;