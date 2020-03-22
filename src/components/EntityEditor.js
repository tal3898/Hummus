import React from 'react';
import styled from 'styled-components';
import { Nav, Navbar, Form, FormControl, Col, Row } from 'react-bootstrap';
import {JSONEditor} from 'react-json-editor-viewer';
import 'bootstrap/dist/css/bootstrap.css';
import { Collapse, Button, CardBody, Card } from 'reactstrap';




const Styles = styled.div`

.json-text-editor {
}

`;

class EntityEditor extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            json : JSON.parse(this.props.jsondata),
            objectFieldsOpen: {}
        }

        for (var key in this.state.json){ 
            if (typeof this.state.json[key] == 'object') {
                this.state.objectFieldsOpen[key] = false;
            }
        }

    }

    render() {

     const json = JSON.parse(this.props.jsondata)
     const level = parseInt(this.props.level) 
     
     const indent = 50 * level

     

     const items = []

     
     
    const toggle = (key) => {
        this.state.objectFieldsOpen[key] = !this.state.objectFieldsOpen[key];
        this.setState(this.state)
    }
    
    

      for (let key in json){ 
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
        } else if(!Array.isArray(json[key])) {
            items.push(
                <div style={{fontSize: 20, marginLeft: indent}} >
                    <Button size="sm" color="primary"  onClick={() => toggle(key) } style={{ marginBottom: '1rem' }}> 
                    {this.state.objectFieldsOpen[key] ? '-' : '+'} 
                    </Button>
                    <Form.Label>{key}</Form.Label>

                    <Collapse isOpen={this.state.objectFieldsOpen[key]}>                
                        <EntityEditor level={level+1} jsondata={JSON.stringify(json[key])}></EntityEditor>
                    </Collapse>
                </div>
            )
        } else {
            items.push(
                <div style={{fontSize: 20, marginLeft: indent}} >
                        <Button size="sm" color="primary"  onClick={() => toggle(key) } style={{ marginBottom: '1rem' }}> 
                        {this.state.objectFieldsOpen[key] ? '-' : '+'} 
                        </Button>
                        <Form.Label>{key}</Form.Label>
                </div>
            )

            for (let step = 0; step < json[key].length; step++) {
                const currJson = '{"' + step + '.":' + JSON.stringify(json[key][step]) + "}"
                items.push(
                    <div style={{fontSize: 20, marginLeft: indent}} >

                        <Collapse isOpen={this.state.objectFieldsOpen[key]}>                
                            <EntityEditor level={level+1} jsondata={ currJson  }></EntityEditor>
                        </Collapse>
                    </div>
                )
            }
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
