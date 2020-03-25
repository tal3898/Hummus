import React from 'react';
import { Nav, Navbar, Form, FormControl, Col, Row } from 'react-bootstrap';
import styled from 'styled-components';
import Logo from './logo.png'


const Styles = styled.div`
  .navbar { 
    background-color: #1e88e5; 
    height: 100px;
  }

  .headline {
    font-size: 3.5em;
    color: #bbdefb;
    font-family: "Lucida Sans Unicode", "Lucida Grande", sans-serif;
    &:hover { color: #bbdefb; }
  }

  .logo {
    margin-left:10px;
    width:70px;
    height:70px;
  }

`;
export const NavigationBar = () => (
  <Styles>
    <Row className="navbar">
      <Col lg="0">
        <img className="logo" src={Logo} />
      </Col>
      <Col >
        <span className="headline">HummusNG</span>
      </Col>

    </Row>
  </Styles>
)