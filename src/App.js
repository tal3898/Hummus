import React, { useState } from 'react';

import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { NavigationBar } from './components/NavigationBar';
import ScenariosWindow from './components/ScenariosWindow';
import Scenario from './components/Scenario';
import { Col, Row } from 'react-bootstrap';
import { HummusProvider } from './components/HummusContext';
import './App.css';

class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      data: {
        msg: 'aaa',
        scenariosHierarchy: {},
        currScenario: {
          name:'',
          steps:[{
            "name": "כתיבה",
            "jsonMap": {},
            "jsonToEdit": "{}",
            "entity": "English",
            "system": "Tal",
            "reality": "0",
            "action": "DELETE",
            "version": "X",
            "links": [],
            "disabledFields": []
          }]
        },
        currOpenStep: 0
      },
      updateData: (newValue) => {
        this.setState(newValue)
      },
      loadFolderHiierarchy: this.loadFolderHiierarchy
    }
  }
  

  loadFolderHiierarchy(callback) {

    fetch('/folder')
      .then(response => response.json())
      .then(data => {
        delete data._id;
        //this.data.scenariosHierarchy = data;
        //this.setState()

        if (callback) {
          callback(data);
        }
      }).catch(error => {
        console.log(' error while getting scenarios')
      });

  }

  render() {
    return (
      <div style={{backgroundColor:'#fafafa'}} className='main-body'>
        <HummusProvider value={this.state}>
          
          <React.Fragment>
            <Router>
              <NavigationBar />
            </Router>
            <Row>
              <Col lg="10">
                <Scenario></Scenario>
              </Col>  
            </Row>
          </React.Fragment>
        </HummusProvider>
      </div>
    );
  }
}

export default App;
