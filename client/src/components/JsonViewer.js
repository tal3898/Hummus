import React from 'react';
import styled from 'styled-components';
import { Nav, Button, Form, FormControl, Col, Row } from 'react-bootstrap';
import { Treebeard } from 'react-treebeard';
import HummusContext from './HummusContext'

import Popup from "reactjs-popup";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Styles = styled.div`


`;



const backupData2 = {
    name: 'root',
    toggled: true,
    children: [
        {
            name: 'parent',
            children: [
                { name: 'child1' },
                { name: 'child2' }
            ]
        },
        {
            name: 'parent',
            children: [
                {
                    name: 'nested parent',
                    children: [
                        { name: 'nested child 1' },
                        {
                            name: 'nested child 2',
                            children: [
                                {
                                    name: 'nested parent',
                                    children: [
                                        { name: 'nested child 1' },
                                        {
                                            name: 'nested child 2', children: [
                                                {
                                                    name: 'nested parent',
                                                    children: [
                                                        { name: 'nested child 1' },
                                                        { name: 'nested child 2' }
                                                    ]
                                                }, {
                                                    name: 'nested parent',
                                                    children: [
                                                        { name: 'nested child 1' },
                                                        { name: 'nested child 2' }
                                                    ]
                                                }, {
                                                    name: 'nested parent',
                                                    children: [
                                                        { name: 'nested child 1' },
                                                        { name: 'nested child 2' }
                                                    ]
                                                }, {
                                                    name: 'nested parent',
                                                    children: [
                                                        { name: 'nested child 1' },
                                                        { name: 'nested child 2' }
                                                    ]
                                                }, {
                                                    name: 'nested parent',
                                                    children: [
                                                        { name: 'nested child 1' },
                                                        { name: 'nested child 2' }
                                                    ]
                                                }, {
                                                    name: 'nested parent',
                                                    children: [
                                                        { name: 'nested child 1' },
                                                        { name: 'nested child 2' }
                                                    ]
                                                }, {
                                                    name: 'nested parent',
                                                    children: [
                                                        { name: 'nested child 1' },
                                                        { name: 'nested child 2' }
                                                    ]
                                                }, {
                                                    name: 'nested parent',
                                                    children: [
                                                        { name: 'nested child 1' },
                                                        { name: 'nested child 2' }
                                                    ]
                                                }, {
                                                    name: 'nested parent',
                                                    children: [
                                                        { name: 'nested child 1' },
                                                        { name: 'nested child 2' }
                                                    ]
                                                }, {
                                                    name: 'nested parent',
                                                    children: [
                                                        { name: 'nested child 1' },
                                                        { name: 'nested child 2' }
                                                    ]
                                                }, {
                                                    name: 'nested parent',
                                                    children: [
                                                        { name: 'nested child 1' },
                                                        { name: 'nested child 2' }
                                                    ]
                                                }, {
                                                    name: 'nested parent',
                                                    children: [
                                                        { name: 'nested child 1' },
                                                        { name: 'nested child 2' }
                                                    ]
                                                }, {
                                                    name: 'nested parent',
                                                    children: [
                                                        { name: 'nested child 1' },
                                                        { name: 'nested child 2' }
                                                    ]
                                                }, {
                                                    name: 'nested parent',
                                                    children: [
                                                        { name: 'nested child 1' },
                                                        { name: 'nested child 2' }
                                                    ]
                                                }, {
                                                    name: 'nested parent',
                                                    children: [
                                                        { name: 'nested child 1' },
                                                        { name: 'nested child 2' }
                                                    ]
                                                }, {
                                                    name: 'nested parent',
                                                    children: [
                                                        { name: 'nested child 1' },
                                                        { name: 'nested child 2' }
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                }, {
                                    name: 'nested parent',
                                    children: [
                                        { name: 'nested child 1' },
                                        { name: 'nested child 2' }
                                    ]
                                }, {
                                    name: 'nested parent',
                                    children: [
                                        { name: 'nested child 1' },
                                        { name: 'nested child 2' }
                                    ]
                                }, {
                                    name: 'nested parent',
                                    children: [
                                        { name: 'nested child 1' },
                                        { name: 'nested child 2' }
                                    ]
                                }, {
                                    name: 'nested parent',
                                    children: [
                                        { name: 'nested child 1' },
                                        { name: 'nested child 2' }
                                    ]
                                }, {
                                    name: 'nested parent',
                                    children: [
                                        { name: 'nested child 1' },
                                        { name: 'nested child 2' }
                                    ]
                                }, {
                                    name: 'nested parent',
                                    children: [
                                        { name: 'nested child 1' },
                                        { name: 'nested child 2' }
                                    ]
                                }, {
                                    name: 'nested parent',
                                    children: [
                                        { name: 'nested child 1' },
                                        { name: 'nested child 2' }
                                    ]
                                }, {
                                    name: 'nested parent',
                                    children: [
                                        { name: 'nested child 1' },
                                        { name: 'nested child 2' }
                                    ]
                                }, {
                                    name: 'nested parent',
                                    children: [
                                        { name: 'nested child 1' },
                                        { name: 'nested child 2' }
                                    ]
                                }, {
                                    name: 'nested parent',
                                    children: [
                                        { name: 'nested child 1' },
                                        { name: 'nested child 2' }
                                    ]
                                }, {
                                    name: 'nested parent',
                                    children: [
                                        { name: 'nested child 1' },
                                        { name: 'nested child 2' }
                                    ]
                                }, {
                                    name: 'nested parent',
                                    children: [
                                        { name: 'nested child 1' },
                                        { name: 'nested child 2' }
                                    ]
                                }, {
                                    name: 'nested parent',
                                    children: [
                                        { name: 'nested child 1' },
                                        { name: 'nested child 2' }
                                    ]
                                }, {
                                    name: 'nested parent',
                                    children: [
                                        { name: 'nested child 1' },
                                        { name: 'nested child 2' }
                                    ]
                                }, {
                                    name: 'nested parent',
                                    children: [
                                        { name: 'nested child 1' },
                                        { name: 'nested child 2' }
                                    ]
                                }
                            ]
                        }
                    ]
                }, {
                    name: 'nested parent',
                    children: [
                        { name: 'nested child 1' },
                        { name: 'nested child 2' }
                    ]
                }, {
                    name: 'nested parent',
                    children: [
                        { name: 'nested child 1' },
                        { name: 'nested child 2' }
                    ]
                }, {
                    name: 'nested parent',
                    children: [
                        { name: 'nested child 1' },
                        { name: 'nested child 2' }
                    ]
                }, {
                    name: 'nested parent',
                    children: [
                        { name: 'nested child 1' },
                        { name: 'nested child 2' }
                    ]
                }, {
                    name: 'nested parent',
                    children: [
                        { name: 'nested child 1' },
                        { name: 'nested child 2' }
                    ]
                }, {
                    name: 'nested parent',
                    children: [
                        { name: 'nested child 1' },
                        { name: 'nested child 2' }
                    ]
                }, {
                    name: 'nested parent',
                    children: [
                        { name: 'nested child 1' },
                        { name: 'nested child 2' }
                    ]
                }, {
                    name: 'nested parent',
                    children: [
                        { name: 'nested child 1' },
                        { name: 'nested child 2' }
                    ]
                }, {
                    name: 'nested parent',
                    children: [
                        { name: 'nested child 1' },
                        { name: 'nested child 2' }
                    ]
                }, {
                    name: 'nested parent',
                    children: [
                        { name: 'nested child 1' },
                        { name: 'nested child 2' }
                    ]
                }, {
                    name: 'nested parent',
                    children: [
                        { name: 'nested child 1' },
                        { name: 'nested child 2' }
                    ]
                }, {
                    name: 'nested parent',
                    children: [
                        { name: 'nested child 1' },
                        { name: 'nested child 2' }
                    ]
                }, {
                    name: 'nested parent',
                    children: [
                        { name: 'nested child 1' },
                        { name: 'nested child 2' }
                    ]
                }, {
                    name: 'nested parent',
                    children: [
                        { name: 'nested child 1' },
                        { name: 'nested child 2' }
                    ]
                }, {
                    name: 'nested parent',
                    children: [
                        { name: 'nested child 1' },
                        { name: 'nested child 2' }
                    ]
                }
            ]
        }
    ]
};

class JsonViewer extends React.Component {

    static contextType = HummusContext;

    constructor(props) {
        super(props)
        this.state = {
            actualJson: props.json,
            jsonToDisplay: {
                name: 'root',
                toggled: true,
                children: []
            }
        }

        this.state.jsonToDisplay.children = this.buildData(this.state.actualJson);

        this.onToggle = this.onToggle.bind(this);

        this.onCloseCallback = props.onClose;
    }

    // TODO: make generic, to fit the save scenario popup, and the linking field popup.
    buildData(json) {
        var children = [];

        for (var key in json) {
            // if curr key, is folder, and not file
            if (!json[key].hasOwnProperty('steps')) {
                var keyObject = {
                    name: key
                };

                if (typeof json[key] == 'object') {
                    var keyChildren = this.buildData(json[key]);
                    if (keyChildren.length > 0) {
                        keyObject.children = keyChildren;
                    }
                }

                children.push(keyObject);
            }
        }

        return children;
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        this.state.actualJson = newProps.json;

        this.state.jsonToDisplay.children = this.buildData(this.state.actualJson);

        this.setState(this.state);
    }

    findFullPath(data, childFolder) {
        if (data == childFolder) {
            return '/' + childFolder.name;
        } else if (!data.hasOwnProperty('children')) {
            return false;
        } else {
            for (var index in data.children) {
                var childFullPath = this.findFullPath(data.children[index], childFolder);
                if (childFullPath != false) {
                    return '/' + data.name + childFullPath
                }
            }

            return false;
        }
    }

    /**
     * When clicking on a node, this will be called. it gets the selected node, and if toggled.
     * the function, dis-toggle the prev selected node, select the new one in state.cursor, and open
     * the node, if has children
     * 
     * @param {*} node 
     * @param {*} toggled 
     */
    onToggle(node, toggled) {
        const { cursor, jsonToDisplay } = this.state;
        if (cursor) {
            this.state.cursor.active = false;
        }
        node.active = true;
        if (node.children) {
            node.toggled = toggled;
        }
        console.log('full path ' + this.findFullPath(jsonToDisplay, node));
        this.setState({ cursor: node, jsonToDisplay: Object.assign({}, jsonToDisplay) });
    }

    getSelectedPath() {
        return this.findFullPath(this.state.jsonToDisplay, this.state.cursor).replace('/root', '');
    }

    isSelectedFieldHasChildren() {
        return this.state.cursor.hasOwnProperty('children');
    }

    render() {
        return (
            <Styles>
                <Treebeard
                    data={this.state.jsonToDisplay}
                    onToggle={this.onToggle}
                />
                <ToastContainer />
            </Styles>
        )
    }
}

export default JsonViewer;