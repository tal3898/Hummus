import React, { useState, Children } from 'react';
import styled from 'styled-components';
import { Form, Col, Row, InputGroup } from 'react-bootstrap';
import HummusContext, { HummusConsumer } from './HummusContext'
import SaveFolderPopup from './SaveFolderPopup'

const Styles = styled.div`

.headline {
  float: right;
  margin-bottom:20px;
  margin-top:10px; 
  margin-right:15px;
  font-size:50px;
  letter-spacing: 0.05em;
  fontFamily:"Lucida Sans Unicode", "Lucida Grande", sans-serif;
}

.field {
  height:40px;
  &:hover { 
    background: #bbdefb; 
    cursor: pointer;
  }
}

.back-button:hover {
  color: #212121;
  cursor: pointer;
}

.w3-card-4 {
  margin-top:35px;
  margin-right:35px;
  height:700px;
  padding: 0px !important;

}

.header {
  padding-left: 0px !important;
  padding-right: 0px !important;
}

.main-content{
  overflow-y: scroll;
  height:574px;
}

`;
class ScenariosWindow extends React.Component {
  static contextType = HummusContext;

  constructor(props) {
    super(props);

    this.state = {
      currPath: '',
      isSavePopupOpen: false
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
      if (currChildren[key] != 'file') {
        folders.push(key);
      }
    }
    return folders;
  }

  getCurrPathFiles(context) {
    var currChildren = this.state.currPath.split('/').splice(1).reduce((o, n) => o[n], context.data.scenariosHierarchy);
    var files = [];
    for (var key in currChildren) {
      if (currChildren[key] == 'file') {
        files.push(key);
      }
    }
    return files;
  }
  //#endregion

  //#region content rendering
  createFolderRow(folderName) {
    return (
      <Row onClick={() => this.openFolder(this.state.currPath + '/' + folderName)} className='field' dir="rtl">
        <Col lg="2">
          <center>
            <i style={{ marginTop: 5, color: '#ffa726' }} className="action fas fa-folder-open fa-2x"></i>
          </center>
        </Col>
        <Col style={{ fontSize: 25, marginTop: 1 }} lg="1">
          {folderName}
        </Col>
      </Row>
    )
  }

  createFileRow(fileName) {
    return (
      <Row className='field' onClick={() => this.openFile(this.state.currPath + '/' + fileName)} dir="rtl">
        <Col lg="2">
          <center>
            <i style={{ marginTop: 5, color: '#90a4ae' }} className="action fas fa-file fa-2x"></i>
          </center>
        </Col>
        <Col style={{ fontSize: 25, marginTop: 1 }} lg="1">
          {fileName}
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
        <center style={{ marginTop: 200, fontSize: 40, color: '#b0bec5' }}>
          Folder is empty
        </center>
      )
    }
  }
  //#endregion

  openNewFolderPopup() {
    this.state.isSavePopupOpen = true;
    this.setState(this.state);
  }

  closePopup() {
    this.state.isSavePopupOpen = false;
    this.setState(this.state);
  }

  render() {
    return (<Styles>


      <div className="w3-card-4">
        <header style={{ marginBottom: 0 }} className="w3-container w3-blue header">
          <h1 className="headline" >תרחישים</h1>

          <i style={{ color: '#66bb6a', cursor: 'pointer', marginLeft: 15, marginTop: 15, fontSize: 55, }}
            class="fas fa-plus"
            onClick={() => this.openNewFolderPopup()}></i>

          <SaveFolderPopup
            onClose={() => this.closePopup()}
            folderHierarchy={this.context.scenariosHierarchy}
            isOpen={this.state.isSavePopupOpen} />

          <Form.Group style={{ marginBottom: 0, marginLeft: 0, width: '100%' }} md="4" controlId="validationCustomUsername">
            <InputGroup>

              <InputGroup.Prepend>
                <InputGroup.Text style={{ borderRadius: 0 }} id="inputGroupPrepend">path</InputGroup.Text>
              </InputGroup.Prepend>

              <Form.Control
                disabled
                type="text"
                value={(this.state.currPath.length > 0 && this.state.currPath) ||
                  '/'}
                aria-describedby="inputGroupPrepend"
                required
              />
              <InputGroup.Prepend style={{ marginLeft: -2 }}>

                <InputGroup.Text onClick={() => this.goBack()} className="back-button" id="inputGroupPrepend">
                  <i className="fas fa-undo-alt"></i>
                </InputGroup.Text>
              </InputGroup.Prepend>
            </InputGroup>
          </Form.Group>
        </header>

        <div className="main-content w3-container">

          <HummusConsumer>
            {(value) =>
              this.getWindowContent(value)
            }
          </HummusConsumer>

        </div>

      </div>

    </Styles>)
  }
}

export default ScenariosWindow;
