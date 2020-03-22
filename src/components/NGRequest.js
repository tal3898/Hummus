import React from 'react';
import styled from 'styled-components';
import { Nav, Navbar, Form, FormControl, Col, Row } from 'react-bootstrap';
import {JSONEditor} from 'react-json-editor-viewer';


const Styles = styled.div`



`;
export const NGRequest = () => (
  <Styles>
    <div  className='main-comp'>

    <Form>

    <JSONEditor 
  data={{
	"Ids": {
		"code": "123456789",
		"name": "tal"
	},
	"Data": {
		"Location": [{
			"Street": "tzahala",
			"Number": "30",
			"City": "Tel Aviv",
			"IsBuilding": false
		}],
		"Info": "bla bla"
	}, 
	"Planing" : [{
		"Goal": "learn piano",
		"Way": "play piano",
		"Time": "2020-07-13T00:00:00Z"
	}]
}}
  collapsible

/>

        <Row>
            <Col>
              <Form.Label >שם תרחיש</Form.Label>
            </Col>
            <Col>
             <Form.Control type="text"/>
            </Col>
        </Row>

        <Row>
            <Col>
                <Form.Label >תיאור תרחיש</Form.Label>
            </Col>
            <Col>
                <Form.Control as="textarea" rows="3" />
            </Col>
        </Row>

        <Row>
            <Col>
                <Form.Label >ישות</Form.Label>
            </Col>
            <Col>
                <Form.Control as="select" value="Choose...">
                    <option>abcd</option>
                    <option>efgh</option>
                </Form.Control>
            </Col>
        </Row>

        <Row>
            <Col>
                <Form.Label >תקן</Form.Label>
            </Col>
            <Col>
                <Form.Control as="select" value="Choose...">
                    <option>2</option>
                    <option>2.1</option>
                    <option>X</option>
                </Form.Control>
            </Col>
        </Row>
    </Form>

    </div>
  </Styles>
)