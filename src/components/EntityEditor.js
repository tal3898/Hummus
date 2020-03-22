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
      const json= JSON.parse(this.props.jsondata);
      console.log(json)
      const items = []

      for (var key in json){ 
        items.push(        
        <Row>
            <Col xs lg="1">
              <Form.Label >{key}</Form.Label>
            </Col>
            <Col xs lg="2">
             <Form.Control type="text" value="" width="10px"/>
            </Col>
        </Row>
        )
      }

      return (
        <Styles>
            {items}
        </Styles>
      );
    }
  }
  

export default EntityEditor;
