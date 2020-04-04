import React from 'react';
import { Nav, Navbar, Form, FormControl, Col, Row } from 'react-bootstrap';
import styled from 'styled-components';
import Logo from './logo.png'
import ScenariosWindow from './ScenariosWindow';
import Popup from "reactjs-popup";

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
  
  .code-style {
    background-color: #f7f7f7;
    color: #dd1144;
    fontFamily: monospace,monospace;
    margin-bottom: 10px;
  }

  .shortcut-desc {
    padding-bottom:12px;
    font-size:20px;   
  }
`;
export const NavigationBar = () => {
  const [isScenarioWindowOpen, setIsOpen] = React.useState(false);
  const [isShortcutPopupOpen, setIsShortcutPopupOpen] = React.useState(false);

  const openShortCutsPopup = () => {
    setIsShortcutPopupOpen(true);
  };

  const getShortcuts = () => {
    var shortcutsMap = {
      "פתיחת חלון תרחישים": "ctrl + q",
      "שליחת צעד": "ctrl + alt + d",
      "שליחת תרחיש": "ctlr + alt + shift + d",
      "expand/collapse all": "ctrl + b",
      "פתיחת חלון שמירת תרחיש": "ctrl + alt + o",
      "שמירת תרחיש": "atrl + alt + s",
    };

    var items = []
    for (var key in shortcutsMap) {
      items.push(
        <tr className="shortcut-desc">
          <td >{key}</td>
          <td><span className="code-style" >{shortcutsMap[key]}</span></td>
        </tr>
      )
    }

    return items;
  }

  return (
    <Styles>
      <Row className="navbar">
        <Col lg="0">
          <a href="/" style={{ textDecoration: 'none' }}><img className="logo" src={Logo} /></a>
        </Col>
        <Col >
          <a href="/" style={{ textDecoration: 'none' }}><span className="headline">HummusNG</span></a>
        </Col>



        <i onClick={() => openShortCutsPopup(true)} className="nav-button fas fa-cog fa-3x"></i>

        <i id="scenariosListBtn" onClick={() => setIsOpen(true)} className="nav-button fas fa-align-justify fa-3x"></i>


        <Popup
          open={isShortcutPopupOpen}
          onClose={() => setIsShortcutPopupOpen(false)}
          modal
          closeOnDocumentClick
        >
          <div style={{ fontSize: 40, marginBottom: 25 }}>
            <center>
              shortcuts
            </center>
          </div>

          <div style={{ marginBottom: 15 }}>
            <center>
              <table dir="rtl" style={{ width: '75%' }}>
                {getShortcuts()}
              </table>
            </center>
          </div>
        </Popup>

        <ScenariosWindow
          isOpen={isScenarioWindowOpen}
          onClose={() => setIsOpen(false)}
        />
      </Row>
    </Styles>
  )
}