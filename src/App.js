import React from 'react';

import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { NavigationBar } from './components/NavigationBar';
import { ScenariosWindow } from './components/ScenariosWindow';

function App() {
  return (
    <div dir='rtl' className='main-body'>
      <React.Fragment>
        <Router>
          <NavigationBar />
        </Router>
        <ScenariosWindow></ScenariosWindow>
      </React.Fragment> 
    </div>
  );
}

export default App;
