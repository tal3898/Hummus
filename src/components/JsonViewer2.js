import React from 'react';
import styled from 'styled-components';
import { Treebeard } from 'react-treebeard';
import HummusContext from './HummusContext'

import 'react-toastify/dist/ReactToastify.css';

const Styles = styled.div`

.key-name {
    margin: 0px;
    font-size: 17px;
}

.toggle-icon {
    margin-top: 3px;
    font-size: 20px;
    width: 18px; 
    float: left; 
}

`;


class JsonViewer extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            json: props.json,
            level: props.level,
            indent: 25 * props.level,
            expandedKeys: {}
        }

        for (var key in this.state.json) {
            this.state.expandedKeys[key] = false;
        }

    }

    keyClicked(key) {
        this.state.expandedKeys[key] = !this.state.expandedKeys[key];
        this.setState(this.state);
    }

    getKeyToggleIcon(key) {
        if (typeof this.state.json[key] == typeof {}) {
            if (this.state.expandedKeys[key]) {
                return <i className="fas toggle-icon fa-angle-down" />
            } else {
                return <i className="fas toggle-icon fa-angle-right" />
            }
        }
    }

    render() {
        return (
            <Styles>
                {Object.keys(this.state.json).map(key =>
                    <div style={{ paddingLeft: this.state.indent }}>
                        {this.getKeyToggleIcon(key)}

                        <p onClick={() => this.keyClicked(key)} className="key-name" >{key}</p>

                        {typeof this.state.json[key] == typeof {} && this.state.expandedKeys[key] &&
                            <JsonViewer
                                json={this.state.json[key]}
                                level={this.state.level + 1}
                            />
                        }
                    </div>
                )}
            </Styles>
        )
    }
}

export default JsonViewer;