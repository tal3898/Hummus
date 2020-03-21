import React from 'react';
import styled from 'styled-components';
import { Nav, Navbar, Form, FormControl, Col, Row } from 'react-bootstrap';


const Styles = styled.div`



`;
export const NGRequest = () => (
  <Styles>
    <div dir='rtl' className='main-comp'>

    <Form>
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