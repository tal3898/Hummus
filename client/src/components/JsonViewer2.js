import React from 'react';
import styled from 'styled-components';
import { Treebeard } from 'react-treebeard';
import HummusContext from './HummusContext'

import 'react-toastify/dist/ReactToastify.css';

const Styles = styled.div`


`;


class JsonViewer2 extends React.Component {

    static contextType = HummusContext;

    constructor(props) {
        super(props)
        this.state = {
            json: props.json,
            level: props.level,
            indent: 30 * props.level
        }
    }

    didSelectedField() {
        var selectedPath = this.getSelectedPath();
        return selectedPath != '/';
    }

    isSelectedFieldHasChildren() {
        return this.state.cursor.hasOwnProperty('children');
    }

    getKeyRender(key, indent) {
        return (
            <div>
                <Row className="mb-1" style={{ paddingLeft: indent }} onClick={() => this.collapseEntityEditor(key)}>

                    <div className="field-component">
                        {this.state.objectFieldsOpen[key] ?
                            <i className="fas fa-angle-down" style={{ width: 18 }}></i> :
                            <i className="fas fa-angle-right" style={{ width: 18 }}></i>
                        }
                    </div>

                    <div className="field-component">
                        {disabledFields.includes(keyFullPath) &&
                            <Form.Label style={{ textDecoration: 'line-through' }}>{keyName}</Form.Label>
                        }
                        {!disabledFields.includes(keyFullPath) &&
                            <Form.Label >{keyName}</Form.Label>
                        }
                    </div>



                    <div className="field-component">
                        <Form.Label style={{ fontSize: 10 }}> {keyRequiredValue} </Form.Label>
                    </div>

                    <div className="field-component">
                        <i onClick={(event) => this.disableField(event, key)} className="fas fa-times field-action mt-1"></i>
                    </div>


                    {this.createInfoPopup(key, 2)}

                    <div className="field-component">
                        <i className=" fas fa-trash field-action mt-1" onClick={() => this.removeField(key)}></i>
                    </div>


                </Row>

                <Collapse isOpen={this.state.objectFieldsOpen[key]}>
                    <EntityEditor
                        parentPath={keyPath}
                        expandAll={this.state.expandAll}
                        onInnerFieldChanged={(event) => this.innerFieldChanged(event)}
                        name={key}
                        ref={this.children[key]}
                        level={this.state.level + 1}
                        fullJson={JSON.stringify(this.state.fullJson[key])}
                        jsondata={JSON.stringify(this.state.json[key])}></EntityEditor>
                </Collapse>
            </div>
        )
    }

    render() {
        return (
            <Styles>

            </Styles>
        )
    }
}

export default JsonViewer2;