import React, { useState } from "react";
import 'react-toastify/dist/ReactToastify.css';
import styled from 'styled-components';
import { getValue } from './Utility';

const Styles = styled.div`

.key-row {
    color: #616161;
    border-radius: 4px;
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
const SELECTED_KEY_BACKGROUND = '#e0e0e0';

const TOGGLE_ICONS = {
    folder: {
        closed: "fas fa-folder",
        open: "fas fa-folder-open"
    },
    json: {
        closed: "fas fa-angle-right",
        open: "fas fa-angle-down"
    }
}

// Set default props
JsonViewer.defaultProps = {
    type: "folder",
    isShowLeaves: true,
    onKeySelected: () => { }
};

export default function JsonViewer(props) {
    const [selectedPath, setSelectedPath] = useState('');
    const [collapsedKeys, setCollapsedKeys] = useState({ '/': true });

    const getKeyPathList = (json) => {
        var stack = [];
        var jsonFieldsPathList = [];

        for (var key in json) {
            stack.push('/' + key);
        }

        stack.reverse();
        while (stack.length != 0) {
            var currElement = stack.pop();
            var keyPath = currElement;
            var keyValue = getValue(json, keyPath);

            if (!jsonFieldsPathList.includes(keyPath)) {
                jsonFieldsPathList.push(keyPath);

                if (typeof keyValue == typeof {}) {
                    var children = Object.keys(keyValue)
                        .map(child => keyPath + '/' + child)
                        .reverse();

                    stack = stack.concat(children);
                }
            }
        }

        return jsonFieldsPathList;
    }

    const isAllParentsExpanded = (keyPath) => {
        var keyParts = keyPath.split('/').slice(1);
        var allParentsExpanded = true;

        for (var keyPartIndex in keyParts) {
            var parent = '/' + keyParts.slice(0, keyPartIndex).join('/');
            if (collapsedKeys[parent] == undefined || collapsedKeys[parent] == false) {
                allParentsExpanded = false;
            }
        }

        return allParentsExpanded;
    }

    const isKeyVisible = (keyPath) => {
        return (typeof getValue(props.json, keyPath) == typeof {} || props.isShowLeaves)
            &&
            (keyPath.split('/').length == 2 || isAllParentsExpanded(keyPath))
    }


    const keyClicked = (keyPath) => {
        var customEvent = {
            clickedPath: keyPath,
            hasChildren: typeof getValue(props.json, keyPath) == typeof {}
        };

        props.onKeySelected(customEvent);

        if (collapsedKeys[keyPath] == undefined) {
            collapsedKeys[keyPath] = false;
        }


        setCollapsedKeys({ ...collapsedKeys, [keyPath]: !collapsedKeys[keyPath] });
        setSelectedPath(keyPath);
    }

    const ToggleIcon = (props) => {
        const { keyPath } = props;

        if (typeof getValue(props.json, keyPath) == typeof {}) {
            if (collapsedKeys[keyPath]) {
                return <i className={"toggle-icon " + TOGGLE_ICONS[props.type].open} />
            } else {
                return <i className={"toggle-icon " + TOGGLE_ICONS[props.type].closed} />
            }
        }
    }

    const getIndentation = (keyPath) => {
        return INDENT * (keyPath.split('/').length - 2) + 7;
    }

    const Field = (props) => {
        const { keyPath } = props;
        var keyName = keyPath.split('/')[keyPath.split('/').length - 1];
        var keyStyle = {
            background: selectedPath === keyPath ? SELECTED_KEY_BACKGROUND : '',
            paddingLeft: getIndentation(keyPath)
        };

        return (
            <div onClick={() => keyClicked(keyPath)} className="key-row" style={keyStyle}>
                <ToggleIcon keyPath={keyPath} {...props} /> 
                <p style={{}} className="key-name" >{keyName}</p>
            </div>
        )
    }

    const keyPathList = getKeyPathList(props.json);

    return (

        <Styles>
            <div className="main">
                {keyPathList
                    .filter(keyPath => isKeyVisible(keyPath))
                    .map(keyPath => (
                        <Field keyPath={keyPath} {...props} />
                    ))
                }
            </div>

        </Styles>
    );
}
