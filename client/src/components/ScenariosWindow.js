import React, { useState, Children } from 'react';
import styled from 'styled-components';
import { Form, Col, Row, InputGroup } from 'react-bootstrap';
import HummusContext, { HummusConsumer } from './HummusContext'

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
  static contextType = HummusContext;

  constructor(props) {
    super(props);

    this.state = {
      currPath: ''
    }
  }

  componentDidMount() {
    this.context.loadFolderHiierarchy((data) => {
      this.context.data.scenariosHierarchy = data;
      this.context.updateData(data);
    });
  }

  //#region navigation functions
  openFolder(path) {
    this.state.currPath = path;
    this.setState(this.state);
  }

  goBack() {
    var prevPath = this.state.currPath.substring(0, this.state.currPath.lastIndexOf('/'));
    this.openFolder(prevPath);
  }
  //#endregion

  //#region get curr folder content
  getCurrPathFolders(context) {
    var currChildren = this.state.currPath.split('/').splice(1).reduce((o, n) => o[n], context.data.scenariosHierarchy);
    var folders = [];
    for (var key in currChildren) {
      if (!currChildren[key].hasOwnProperty('steps')) {
        folders.push(key);
      }
    }
    return folders;
  }

  getCurrPathFiles(context) {
    var currChildren = this.state.currPath.split('/').splice(1).reduce((o, n) => o[n], context.data.scenariosHierarchy);
    var files = [];
    for (var key in currChildren) {
      if (currChildren[key].hasOwnProperty('steps')) {
        files.push(key);
      }
    }
    return files;
  }
  //#endregion

  //#region content rendering
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

  openFile(filePath) {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: filePath })
    };

    fetch('/scenarioFile', requestOptions)
    .then(response => response.json())
    .then(data => {
      delete data._id;
      console.log('bb ' + this.context);
      this.context.data.currScenario = data;
      this.context.updateData(this.context);

      //this.data.scenariosHierarchy = data;
      //this.setState()
        
    }).catch(error => {
      console.log(' error while getting scenarios')
    });
  }

  createFileRow(fileName) {
    return (
      <Row className="field" onClick={() => this.openFile(this.state.currPath + '/' + fileName)}>
        <Col lg="1" className="col-md-2">
          <i class="action far fa-file fa-2x"></i>
        </Col>
        <Col className="col-md-2">
          <span style={{ float: 'right' }} className="scenario-name">{fileName}</span>
        </Col>
      </Row>
    )
  }

  getWindowContent(context) {
    var totalItems = [];

    var folders = this.getCurrPathFolders(context).map((folderName) => this.createFolderRow(folderName));
    var files = this.getCurrPathFiles(context).map((fileName) => this.createFileRow(fileName));

    totalItems = totalItems.concat(folders);
    totalItems = totalItems.concat(files);
    if (totalItems.length > 0) {
      return totalItems;
    } else {
      return (
        <center style={{ marginTop: 250, fontSize: 40, color: '#b0bec5' }}>
          Folder is empty
        </center>
      )
    }
  }
  //#endregion

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
                value={(this.state.currPath.length > 0 && this.state.currPath) ||
                  '/'}
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

        <HummusConsumer>
          {(value) =>

            <div className="w3-container">
              <div dir="rtl" className='scenarios-list'>
                {this.getWindowContent(value)}
              </div>
            </div>
          }
        </HummusConsumer>

      </div>
    </Styles>)
  }
}

export default ScenariosWindow;
