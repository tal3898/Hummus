import React, { useState, Children } from 'react';
import styled from 'styled-components';
import { Form, Col, Row, InputGroup } from 'react-bootstrap';

const Styles = styled.div`


.all {
  margin-top:20px
}

.headline {
  font-family: "Lucida Sans Unicode", "Lucida Grande", sans-serif;
  color: #bbdefb;

}

.back-button {
  color: #546e7a;
  cursor: pointer;
}

.back-button:hover {
  color: #212121;
  cursor: pointer;
}

.w3-card-4 {
  height:750px;
}

  .action {
    margin-top:5px;
  }

  .scenario-name {
    font-size: 1.7em;
    width:300px;
    
    float:right;
    margin-right: 10px;
  }

  .field {
    height: 40px; 
    float:right;
    margin-top : 5px;
    &:hover { background: #bbdefb; }
}

`;
class ScenariosWindow extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currPath: '',
      files: [],
      folders: []
    }

    if (!this.state.hasOwnProperty('scenariosHierarchy')) {
      this.getScenariosHierarchy();
    }

    this.getCurrPathContent();
  }

  saveScenarios(data) {
    this.state.scenariosHierarchy = data;
    this.setState(this.state);
    this.getCurrPathContent();
  }

  getScenariosHierarchy() {

    fetch('/scenario')
      .then(response => response.json())
      .then(data => { 
        this.state.scenariosHierarchy = data;
        this.setState(this.state);    
        this.getCurrPathContent();
      }).catch(error => {
        console.log(' error while getting scenarios')
      });
  }


  getCurrPathContent() {

    var currChildren = this.state.currPath.split('/').splice(1).reduce((o, n) => o[n], this.state.scenariosHierarchy);
    console.log('a ' + JSON.stringify(currChildren))

    this.state.files = [];
    this.state.folders = [];

    for (var key in currChildren) {

      if (currChildren[key].hasOwnProperty('steps')) {
        this.state.files.push(key);
      } else if (typeof currChildren[key] == 'object') {
        this.state.folders.push(key);
      }
    }

    this.setState(this.state);
  }

  openFolder(path) {
    this.state.currPath = path;
    this.setState(this.state);
    this.getCurrPathContent();
  }

  goBack() {
    var prevPath = this.state.currPath.substring(0, this.state.currPath.lastIndexOf('/'));
    this.openFolder(prevPath);
  }

  createFolderRow(folderName) {
    return (
      <Row onClick={() => this.openFolder(this.state.currPath + '/' + folderName)} className="field">
        <Col lg="1" className="col-md-2">
          <i class="action far fa-folder-open fa-2x"></i>
        </Col>
        <Col className="col-md-2">
          <span style={{ float: 'right' }} className="scenario-name">{folderName}</span>
        </Col>
      </Row>
    )
  }

  createFileRow(fileName) {
    return (
      <Row className="field">
        <Col lg="1" className="col-md-2">
          <i class="action far fa-file fa-2x"></i>
        </Col>
        <Col className="col-md-2">
          <span style={{ float: 'right' }} className="scenario-name">{fileName}</span>
        </Col>
      </Row>
    )
  }

  render() {
    return (<Styles>

      <div className="all w3-card-4" style={{ width: 400 }}>
        <header dir="rtl" class="w3-container w3-blue">
          <h1 className="headline">תרחישים</h1>
          <Form.Group dir="ltr" md="4" controlId="validationCustomUsername">
            <InputGroup>
              <InputGroup.Prepend>
                <InputGroup.Text id="inputGroupPrepend">path</InputGroup.Text>
              </InputGroup.Prepend>
              <Form.Control
                disabled
                type="text"
                value={this.state.currPath}
                aria-describedby="inputGroupPrepend"
                required
              />
              <InputGroup.Prepend>

                <InputGroup.Text onClick={() => this.goBack()} className="back-button" id="inputGroupPrepend">
                  <i class="fas fa-undo-alt"></i>
                </InputGroup.Text>
              </InputGroup.Prepend>
            </InputGroup>
          </Form.Group>
        </header>


        <div className="w3-container">

          <div dir="rtl" className='scenarios-list'>
            {this.state.folders.map((folderName) => this.createFolderRow(folderName))}

            {this.state.files.map((fileName) => this.createFileRow(fileName))}

            {this.state.files.length == 0 && this.state.folders.length == 0 &&
              <center style={{ marginTop: 250, fontSize: 40, color: '#b0bec5' }}>
                Folder is empty
              </center>
            }
          </div>

        </div>

      </div>





    </Styles>)
  }
}

export default ScenariosWindow;
