import React from 'react';

import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { NavigationBar } from './components/NavigationBar';
import { ScenariosWindow } from './components/ScenariosWindow';
import NGRequest from './components/NGRequest';
import { Col, Row } from 'react-bootstrap';

function App() {
  return (
    <div className='main-body'>
      <React.Fragment>
        <Router>
          <NavigationBar />
        </Router>
        <Row>
          <Col>
            <NGRequest></NGRequest>
          </Col>
          <Col lg='3'>
            <ScenariosWindow></ScenariosWindow>
          </Col>
        </Row>
      </React.Fragment> 
    </div>
  );
}

export default App;
