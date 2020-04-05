import React from 'react';
import { Nav, Navbar, Form, FormControl, Col, Row } from 'react-bootstrap';
import styled from 'styled-components';
import Logo from './logo.png'
import ScenariosWindow from './ScenariosWindow';
import Popup from "reactjs-popup";
import ShortcutsPopup from './ShortcutsPopup'

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

  .nav-button {
    color: #bbdefb;
    margin-right: 40px;
    cursor: pointer;
    &:hover {
      color: #90caf9;
    }
  }
`;
export const NavigationBar = () => {
  const [isScenarioWindowOpen, setIsOpen] = React.useState(false);
  const [isShortcutPopupOpen, setIsShortcutPopupOpen] = React.useState(false);

  return (
    <Styles>
      <Row className="navbar">
        <Col lg="0">
          <a href="/" style={{ textDecoration: 'none' }}><img className="logo" src={Logo} /></a>
        </Col>
        <Col >
          <a href="/" style={{ textDecoration: 'none' }}><span className="headline">HummusNG</span></a>
        </Col>

        <p style={{fontSize:20, color: '#bbdefb', cursor:'pointer', marginRight:30, marginTop:10}}>כניסה</p>

        <i onClick={() => setIsShortcutPopupOpen(true)} className="nav-button fas fa-cog fa-3x"></i>

        <i id="scenariosListBtn" onClick={() => setIsOpen(true)} className="nav-button fas fa-align-justify fa-3x"></i>

        

        <ShortcutsPopup isOpen={isShortcutPopupOpen} onClose={()=> setIsShortcutPopupOpen(false)}/>

        <ScenariosWindow
          isOpen={isScenarioWindowOpen}
          onClose={() => setIsOpen(false)}
        />
      </Row>
    </Styles>
  )
}