import React from 'react';
import styled from 'styled-components';
import { Treebeard } from 'react-treebeard';
import HummusContext from './HummusContext'
import { getValue } from './Utility';
import 'react-toastify/dist/ReactToastify.css';

const Styles = styled.div`

.key-row {
    color: #616161;
    cursor: pointer;
}

.key-name {
    margin: 0px;
    font-size: 17px;
    display: inline-block;
    padding-left: 3px;
    padding-right: 3px;
    border-radius: 4px;
}

.toggle-icon {
    margin-top: 7px;
    font-size: 13px;
    width: 18px; 
    float: left; 
}

`;


const INDENT = 25;

class JsonViewer extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            json: props.json,
            level: props.level,
            indent: 25 * props.level,
            selectedPath: '',
            collapsedKeys: this.getKeyCollapsedMap(props.json)
        }


        this.keyPathList = this.getKeyPathList(props.json);

    }

    getKeyPathList(json) {
        var stack = [];
        var jsonFieldsPathList = [];

        for (var key in json) {
            stack.push('/' + key);
        }

        while (stack.length != 0) {
            var currElement = stack.pop();
            var keyPath = currElement;
            var keyValue = getValue(json, keyPath);

            if (!jsonFieldsPathList.includes(keyPath)) {
                jsonFieldsPathList.push(keyPath);

                if (typeof keyValue == typeof {}) {
                    var children = Object.keys(keyValue)
                        .map(child => keyPath + '/' + child);

                    stack = stack.concat(children);
                }
            }
        }

        return jsonFieldsPathList;
    }

    getKeyCollapsedMap(json) {
        var collapsedKeys = {};
        var stack = [];
        var jsonFieldsPathList = [];

        for (var key in json) {
            stack.push('/' + key);
        }

        while (stack.length != 0) {
            var currElement = stack.pop();
            var keyPath = currElement;
            var keyValue = getValue(json, keyPath);

            if (!jsonFieldsPathList.includes(keyPath)) {
                jsonFieldsPathList.push(keyPath);

                if (typeof keyValue == typeof {}) {
                    collapsedKeys[keyPath] = false;
                    var children = Object.keys(keyValue)
                        .map(child => keyPath + '/' + child);

                    stack = stack.concat(children);
                }
            }
        }

        return collapsedKeys;
    }

    isAllParentsExpanded(keyPath) {
        return !Object.keys(this.state.collapsedKeys)
            .some(path => keyPath.includes(path + '/') && !this.state.collapsedKeys[path])
    }

    isKeyVisible(keyPath) {
        return (typeof getValue(this.state.json, keyPath) == typeof {} || this.props.isShowLeaves)
            && 
            this.isAllParentsExpanded(keyPath)
    }


    keyClicked(keyPath) {
        this.state.collapsedKeys[keyPath] = !this.state.collapsedKeys[keyPath];
        this.state.selectedPath = keyPath;
        this.setState(this.state);
    }
    
    isAtLeastOneChildVisible(keyPath) {
        var children = getValue(this.state.json, keyPath);

        return Object.keys(children).some(child => this.isKeyVisible(keyPath + '/' + child));
    }

    getKeyToggleIcon(keyPath) {
        if (typeof getValue(this.state.json, keyPath) == typeof {}) {
            if (this.state.collapsedKeys[keyPath] && this.isAtLeastOneChildVisible(keyPath)) {
                return <i className="toggle-icon fas fa-folder-open" />
            } else {
                return <i className="toggle-icon fas fa-folder" />
            }
        }
    }

    getIndentation(keyPath) {
        return INDENT * (keyPath.split('/').length - 1);
    }

    getFieldDiv(keyPath) {
        var keyName = keyPath.split('/')[keyPath.split('/').length - 1];
        return (
            <div onClick={() => this.keyClicked(keyPath)} className="key-row" style={{ paddingLeft: this.getIndentation(keyPath) }}>
                {this.getKeyToggleIcon(keyPath)}

                <p style={{ background: this.state.selectedPath === keyPath ? '#e0e0e0' : '' }} className="key-name" >{keyName}</p>
            </div>
        )
    }

    render() {
        return (
            <Styles>
                {this.keyPathList
                    .filter(keyPath => this.isKeyVisible(keyPath))
                    .map(keyPath => this.getFieldDiv(keyPath))
                }

            </Styles>
        )
    }
}

export default JsonViewer;