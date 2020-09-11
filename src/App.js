import React, { useState } from 'react';
import { ThemeProvider } from 'styled-components';

import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { NavigationBar } from './components/NavigationBar';
import ScenariosWindow from './components/ScenariosWindow';
import Scenario from './components/Scenario';
import { Col, Row } from 'react-bootstrap';
import { HummusProvider } from './components/HummusContext';
import NgUrlsMap from './globals/NgUrlsMap.json'
import './App.css';
import ChatBot from 'react-simple-chatbot';

class App extends React.Component {

  constructor(props) {
    super(props);

    this.theme = {
      background: '#f5f8fb',
      fontFamily: 'Helvetica Neue',
      headerBgColor: '#EF6C00',
      headerFontColor: '#fff',
      headerFontSize: '15px',
      botBubbleColor: '#EF6C00',
      botFontColor: '#fff',
      userBubbleColor: '#fff',
      userFontColor: '#4a4a4a',
    };

    this.state = {
      data: {
        msg: 'aaa',
        ngEnv: '',
        reality: "0",
        scenariosHierarchy: {},
        currScenario: {
          name: '',
          steps: [{
            "name": "כתיבה",
            "jsonMap": {},
            "jsonToEdit": {},
            "entity": "Target",
            "system": "Tal",

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

    if (localStorage.getItem('NgUrl')) {
      this.state.data.ngEnv = localStorage.getItem('NgUrl');
    } else {
      // If not exist, set the localhost as default 
      this.state.data.ngEnv = Object.keys(NgUrlsMap)[1];
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
      <div style={{ backgroundColor: '#fafafa' }} className='main-body'>
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

        <ThemeProvider theme={{
          background: '#f5f8fb',
          fontFamily: 'Verdana',
          headerBgColor: '#0056e6',
          headerFontColor: '#fff',
          headerFontSize: '20px',
          botBubbleColor: '#0056e6',
          botFontColor: '#fff',
          userBubbleColor: '#fff',
          userFontColor: '#4a4a4a',
        }}>
          <ChatBot
            theme={this.theme}
            floating={true}
            floatingIcon={<i class="fas fa-headset" style={{ fontSize: 30, color: 'white' }}></i>}
            userAvatar={'./heavy.jpg'}

            steps={[
              {
                id: '1',
                message: 'היי, בורכים הבאים לחומוס. אם נתקלתם בבעיה, מצאתם באג או סתם צריכים תמיכה רגשית, אפשר לכתוב פה את הבעיה שלכם או לשלוח לטלטול במייל (טל?? באוטלוק)',
                trigger: '2'
              },
              {
                id: '2',
                user: true,
                trigger: '3'
              },
              {
                id: '3',
                message: 'איזה חמור, צחקתי איתך זה לא עובד. חפש אותי בראשון',
                trigger: '2'
              }
            ]}
          />
        </ThemeProvider>
      </div>
    );
  }
}

export default App;
