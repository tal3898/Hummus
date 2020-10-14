import React from 'react';
import { Col, Row } from 'react-bootstrap';
import styled from 'styled-components';
import Logo from './logo.png'
import Logo2 from './logo2.png'
import ScenariosWindow from './ScenariosWindow';
import ShortcutsPopup from './ShortcutsPopup'
import InfoPopup from './InfoPopup'
import Popup from "reactjs-popup";

const Styles = styled.div`
  .navbar { 
    background-color: white; 
    height: 100px; 
    border-bottom-style: inset;
    border-bottom-width: 1px;
    border-bottom-color: #dddddd;

    
    -webkit-box-shadow: -1px -3px 16px -6px rgba(0,0,0,0.75);
    -moz-box-shadow: -1px -3px 16px -6px rgba(0,0,0,0.75);
    box-shadow: -1px -3px 16px -6px rgba(0,0,0,0.75);


  }

  .headline {
    font-size: 3.5em;
    color: #000000;
    font-family:Verdana;
    

    &:hover { color: #000000; }
  }


  .logo {
    margin-left:10px;
    width:70px;
    height:70px;
  }

  .nav-button {
    color: #000000;
    margin-right: 40px;
    cursor: pointer;
    &:hover {
      color: ${process.env.REACT_APP_navbarButtonHover};
    }
  }
`;
export const NavigationBar = () => {
  const [isScenarioWindowOpen, setIsOpen] = React.useState(false);
  const [isShortcutPopupOpen, setIsShortcutPopupOpen] = React.useState(false);
  const [isInfoPopupOpen, setIsInfoPopupOpen] = React.useState(false);
  const [isEasterOpenPopupOpen, setIsEasterOpenPopupOpen] = React.useState(false);

  return (
    <Styles>
      <Row className="navbar">
        <Col lg="0">
          <a style={{ textDecoration: 'none' }} onClick={() => setIsEasterOpenPopupOpen(true)} ><img className="logo" src={Logo} /></a>
        </Col>
        <Col >
          <a href="/" style={{ textDecoration: 'none' }}><span className="headline">HummusNG</span></a>
          <span> - Tal Ben Yosef</span>
        </Col>

        <i style={{marginRight:35}} onClick={() => setIsInfoPopupOpen(true)} className="nav-button fas fa-baby fa-3x"></i>

        <i onClick={() => setIsShortcutPopupOpen(true)} className="nav-button fas fa-dragon fa-3x"></i>

        <i id="scenariosListBtn" onClick={() => setIsOpen(true)} className="nav-button fas fa-align-justify fa-3x"></i>


        <Popup
          open={isEasterOpenPopupOpen}
          onClose={() => setIsEasterOpenPopupOpen(false)}
          modal
          closeOnDocumentClick
        >

          <div>meme</div>
        </Popup>

        <ShortcutsPopup isOpen={isShortcutPopupOpen} onClose={() => setIsShortcutPopupOpen(false)} />

        <InfoPopup isOpen={isInfoPopupOpen} onClose={() => setIsInfoPopupOpen(false)} />

        <ScenariosWindow
          isOpen={isScenarioWindowOpen}
          onClose={() => setIsOpen(false)}
        />
      </Row>
    </Styles>
  )
}