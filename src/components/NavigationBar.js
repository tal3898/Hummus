import React from 'react';
import { Nav, Navbar, Form, FormControl } from 'react-bootstrap';
import styled from 'styled-components';
const Styles = styled.div`
  .navbar { background-color: #1e88e5; }

  .navbar-brand {
    font-size: 2.4em;
    color: #bbdefb;
    
    &:hover { color: #bbdefb; }
  }

`;
export const NavigationBar = () => (
  <Styles>
    <Navbar expand="lg">
      <Navbar.Brand href="/">Hummus</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav"/>

    </Navbar>
  </Styles>
)