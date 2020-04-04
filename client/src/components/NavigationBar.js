import React from 'react';
import { Nav, Navbar, Form, FormControl, Col, Row } from 'react-bootstrap';
import styled from 'styled-components';
import Logo from './logo.png'
import ScenariosWindow from './ScenariosWindow';


const Styles = styled.div`
  .navbar { 
    background-color: #1B2431; 
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
export const NavigationBar = () => {
  const [isScenarioWindowOpen, setIsOpen] = React.useState(false);

  return (
  <Styles>
    <Row className="navbar">
      <Col lg="0">
        <a href="/" style={{ textDecoration: 'none' }}><img className="logo" src={Logo} /></a>
      </Col>
      <Col >
        <a href="/" style={{ textDecoration: 'none' }}><span className="headline">HummusNG</span></a>
      </Col>

      <i onClick={()=> setIsOpen(true)} style={{color:'#bbdefb', marginRight:40}} className="fas fa-align-justify fa-3x"></i>

      <ScenariosWindow 
        isOpen={isScenarioWindowOpen}
        onClose={()=> setIsOpen(false)}
      />
    </Row>
  </Styles>
  )
}