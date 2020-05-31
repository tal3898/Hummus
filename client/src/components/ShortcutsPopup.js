import React from 'react';
import styled from 'styled-components';
import Popup from "reactjs-popup";

const Styles = styled.div`

  .code-style {
    background-color: #f7f7f7;
    color: #dd1144;
    fontFamily: monospace,monospace;
    margin-bottom: 10px;
  }

  .shortcut-desc {
    padding-bottom:12px;
    font-size:20px;   
  }
`;
class ShortcutsPopup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: props.isOpen,
            shortcutsMap: {
                "פתיחת חלון תרחישים": "ctrl + q",
                "לעשות פוקוס על חיפוש שדה": "ctrl + shift + f",
                "שליחת צעד": "ctrl + alt + d",
                "שליחת תרחיש": "ctlr + alt + shift + d",
                "expand/collapse all": "ctrl + b",
                "פתיחת חלון שמירת תרחיש": "ctrl + alt + o",
                "שמירת תרחיש": "atrl + alt + s",
                "חזרה אחורה בתיקיות": "Backspace->"
            }
        };

        this.onCloseCallback = props.onClose;
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        this.state.isOpen = newProps.isOpen;
        this.setState(this.state);
    }


    getShortcuts() {

        var items = []
        for (var key in this.state.shortcutsMap) {
            items.push(
                <tr className="shortcut-desc">
                    <td >{key}</td>
                    <td><span className="code-style" >{this.state.shortcutsMap[key]}</span></td>
                </tr>
            )
        }

        return items;
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
                            shortcuts
                        </center>
                    </div>

                    <div style={{ marginBottom: 15 }}>
                        <center>
                            <table dir="rtl" style={{ width: '75%' }}>
                                {this.getShortcuts()}
                            </table>
                        </center>
                    </div>
                </Popup>
            </Styles>
        )
    }
}

export default ShortcutsPopup;