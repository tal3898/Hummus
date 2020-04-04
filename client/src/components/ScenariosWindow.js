import React, { useState, Children } from 'react';
import styled from 'styled-components';
import { Form, Col, Row, InputGroup } from 'react-bootstrap';
import HummusContext, { HummusConsumer } from './HummusContext'
import SaveFolderPopup from './SaveFolderPopup'
import SlidingPanel from 'react-sliding-side-panel';

const Styles = styled.div`
.panel-container {
  height: 100%;
  width: 100%;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.headline {
  float: right;
  margin-bottom:20px;
  margin-top:10px; 
  margin-right:15px;
  font-size:50px;
  letter-spacing: 0.05em;
  fontFamily:"Lucida Sans Unicode", "Lucida Grande", sans-serif;
}

.fa-plus {
  color: #66bb6a;
  cursor: pointer;
  margin-left: 15px;
  margin-top: 20px;
  font-size: 45px;
  &:hover { 
    color: #4caf50; 
  }
}

.field {
  cursor: pointer;
  height:40px;
  &:hover { 
    background: #bbdefb; 
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
      isSavePopupOpen: false,
      isOpen: false
    }

    this.onCloseCallback = props.onClose;
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

  UNSAFE_componentWillReceiveProps(newProps) {
    this.state.isOpen = newProps.isOpen;
    this.setState(this.state);
  }

  closePanel() {
    if (this.onCloseCallback) {
      this.onCloseCallback();
    }
    this.state.isOpen = false;
    this.setState(this.state);
  }

  render() {
    return (<Styles>

      <SlidingPanel
        type={'right'}
        isOpen={this.state.isOpen}
        size={25}
        backdropClicked={() => {
          this.closePanel();
        }}>

        <div className="panel-container">
          <HummusConsumer>
            {(value) =>
              this.getWindowContent(value)
            }
          </HummusConsumer>
        </div>
      </SlidingPanel>







    </Styles>)
  }
}

export default ScenariosWindow;
