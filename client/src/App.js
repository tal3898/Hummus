import React, { useState } from 'react';

import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { NavigationBar } from './components/NavigationBar';
import ScenariosWindow from './components/ScenariosWindow';
import NGRequest from './components/NGRequest';
import { Col, Row } from 'react-bootstrap';
import { HummusProvider } from './components/HummusContext';


function App() {
  const [state, setState] = React.useState({ msg: 'aaa', scenariosHierarchy: {} });

  const updateData = (data) => {
    setState(data);
  }

  const loadFolderHiierarchy = (thenFunction) => {

    fetch('/scenario')
      .then(response => response.json())
      .then(data => {
        delete data._id;
        state.scenariosHierarchy = data;
        updateData(state);
        
        if (thenFunction) {
          thenFunction();
        }
      }).catch(error => {
        console.log(' error while getting scenarios')
      });

  }

  return (
    <div className='main-body'>
      <HummusProvider value={{ data: state, 
                               updateData: updateData, 
                               loadFolderHiierarchy: loadFolderHiierarchy }}>
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
      </HummusProvider>
    </div>
  );
}

export default App;
