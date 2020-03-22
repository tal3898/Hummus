import React from 'react';
import styled from 'styled-components';
import { Nav, Navbar, Form, FormControl, Col, Row } from 'react-bootstrap';
import {JSONEditor} from 'react-json-editor-viewer';



const Styles = styled.div`

.json-text-editor {
}

`;

class EntityEditor extends React.Component {
    render() {

     const json = JSON.parse(this.props.jsondata)
     const level = parseInt(this.props.level) 
     
     const indent = 50 * level

     const items = []

      for (var key in json){ 
        if (typeof json[key] != 'object') {
            items.push(        
                <Row style={{fontSize: 20 , marginLeft: indent}}>
                    <Col xs lg="1">
                      <Form.Label >{key}</Form.Label>
                    </Col>
                    <Col xs lg="2">
                     <Form.Control size="sm" type="text" width="20px"/>
                    </Col>
                </Row>
                )
        } else {
            items.push(
                <div>
                
                    <Form.Label style={{fontSize: 20, marginLeft: indent}} >{key}</Form.Label>
                
                    <EntityEditor level={level+1} jsondata={JSON.stringify(json[key])}></EntityEditor>
                </div>
            )
        }
      }

      return (
        <Styles>
            {items}
        </Styles>
      );
    }
  }
  

export default EntityEditor;
