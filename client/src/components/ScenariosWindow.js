import React, { useState, Children } from 'react';
import styled from 'styled-components';
import { Form, Col, Row, InputGroup } from 'react-bootstrap';
import HummusContext, { HummusConsumer } from './HummusContext'
import SaveFolderPopup from './SaveFolderPopup'
import SlidingPanel from 'react-sliding-side-panel';
import Logo from './logo.png'

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
  
  position: absolute;
  left:1;
  bottom: 0;
  margin-left: 20px;
  margin-bottom: 20px;

  font-size: 45px;
  &:hover { 
    color: #43a047; 
  }
}

.field {
  cursor: pointer;
  height:40px;
  width:100%
  &:hover { 
    background: #016795; 
  }
}

.font {
  color:#bbdefb;
  font-size: 25px;
  margin-top: 1px;
}



.back-button {
  cursor: pointer;
  color: #424242;
}

.back-button:hover {
  color: #212121;
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
        <Col lg="1" className="font">
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
        <Col lg="1" className="font">
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

        this.closePanel();

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
        <center style={{ marginTop: 300, fontSize: 50, color: '#b0bec5' }}>
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

        <div style={{ background: '#1B2431', height: '100%' }}>

          <div style={{ height: 170, background: '#1E488F' ,paddingTop:10}}>
            <center >
              <img className="logo" src={Logo} />
              <h1>תרחישים</h1>
            </center>


            <div style={{ paddingLeft:10, marginLeft: 15, backgroundColor: '#2E5A88', borderRadius: 10, width: '90%' }}>
              <i onClick={() => this.goBack()} style={{ fontSize: 20, marginRight: 12 }} className="back-button fas fa-undo-alt"></i>
              <span style={{ fontSize: 20 }}>
                {(this.state.currPath.length > 0 && this.state.currPath) ||
                  '/'}
              </span>
            </div>
          </div>

          <HummusConsumer>
            {(value) =>
              this.getWindowContent(value)
            }
          </HummusConsumer>

          <i 
            className="fas fa-plus"
            onClick={() => this.openNewFolderPopup()}></i>

          <SaveFolderPopup
            onClose={() => this.closePopup()}
            folderHierarchy={this.context.scenariosHierarchy}
            isOpen={this.state.isSavePopupOpen} />
        </div>
      </SlidingPanel>







    </Styles>)
  }
}

export default ScenariosWindow;
