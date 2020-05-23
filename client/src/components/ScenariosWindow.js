import React, { useState, Children } from 'react';
import styled from 'styled-components';
import { Form, Col, Row, InputGroup } from 'react-bootstrap';
import HummusContext, { HummusConsumer } from './HummusContext'
import SaveFolderPopup from './SaveFolderPopup'
import SlidingPanel from 'react-sliding-side-panel';
import Logo from './logo.png'
import { toast } from 'react-toastify';

import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

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

.container { 
  height: 100%;
  position: relative;
}

.center {
  margin: 0;
  position: absolute;
  top: 45%;
  left: 50%;
  -ms-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
}

.path-font {
  max-width: 100%;
  overflow: hidden;
  white-space: nowrap; 
  text-overflow: ellipsis;  
}

.font {
  float: right;
  color: white;
  font-weight: lighter;
  font-size: 25px;
  margin-top: 1px;
  max-width: 100%;
  overflow: hidden;
  white-space: nowrap; 
  text-overflow: ellipsis;  
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

.window-content {
  overflow-y: scroll;
  height:100%;
}

.field {
  cursor: pointer;
  height:40px;
  width:100%;
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

.field:hover .fa-trash {
  display: block;
}


.fa-trash {
  margin-top:7px;
  margin-left:7px;
  font-size: 25px;
  width:35px;
  float:left;
  &:hover {
    color:#e53935;
  }

  display: none;
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


  removeFolder(folderName) {

    this.closePanel();
    confirmAlert({
      title: 'Confirm to submit',
      message: 'Are you sure you want to delete the folder "' + folderName + '" ?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => {
            var fullPath = this.state.currPath + "/" + folderName;
            var body = {
              path: fullPath
            }

            const requestOptions = {
              method: 'DELETE',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(body)
            };

            const toastProperties = {
              autoClose: 2000,
              position: toast.POSITION.BOTTOM_RIGHT,
              pauseOnFocusLoss: false
            };

            fetch('/folder', requestOptions)
              .then(response => response.json())
              .then(data => {
                toast.success("Deleted successfully", toastProperties);

                this.context.loadFolderHiierarchy((data) => {
                  this.context.data.scenariosHierarchy = data;
                  this.context.updateData(this.context);
                });

              }).catch(error => {
                toast.error("Error occurred while deleting", toastProperties);
              });
          }
        },
        {
          label: 'No',
          onClick: () => { }
        }
      ]
    });


  }

  removeFile(fileName) {

    this.closePanel();
    confirmAlert({
      title: 'Confirm to submit',
      message: 'Are you sure you want to delete the scenario "' + fileName + '" ?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => {
            var fullPath = this.state.currPath + "/" + fileName;
            var body = {
              path: fullPath
            }

            const requestOptions = {
              method: 'DELETE',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(body)
            };

            const toastProperties = {
              autoClose: 2000,
              position: toast.POSITION.BOTTOM_RIGHT,
              pauseOnFocusLoss: false
            };

            fetch('/scenarioFile', requestOptions)
              .then(response => response.json())
              .then(data => {
                toast.success("Deleted successfully", toastProperties);

                this.context.loadFolderHiierarchy((data) => {
                  this.context.data.scenariosHierarchy = data;
                  this.context.updateData(this.context);
                });

              }).catch(error => {
                toast.error("Error occurred while deleting", toastProperties);
              });
          }
        },
        {
          label: 'No',
          onClick: () => { }
        }
      ]
    });
  }

  //#region content rendering
  createFolderRow(folderName) {
    return (
      <Row onClick={() => this.openFolder(this.state.currPath + '/' + folderName)} className='field' dir="rtl" style={{ marginRight: 0, paddingRight: 0 }}>
        <Col lg="2">
          <center>
            <i style={{ marginTop: 5, color: 'white', fontSize: '30px' }} className="action fas fa-folder-open"></i>
          </center>
        </Col>
        <Col lg="7" >
          <div dir="rtl" className="font">
            {folderName}
          </div>
        </Col>
        {this.state.currPath != '' &&
          <Col>
            <i onClick={(event) => { this.removeFolder(folderName); event.stopPropagation(); }} class="fas fa-trash"></i>
          </Col>
        }

      </Row>
    )
  }





  createFileRow(fileName) {
    return (
      <Row className='field' onClick={() => this.openFile(this.state.currPath + '/' + fileName)} dir="rtl">
        <Col lg="2">
          <center>
            <i style={{ marginTop: 5, color: 'white', fontSize: '30px' }} className="action fas fa-file"></i>
          </center>
        </Col>
        <Col lg="7">
          <div dir="rtl" className="font">
            {fileName}
          </div>
        </Col>
        <Col>
          <i onClick={(event) => { this.removeFile(fileName); event.stopPropagation(); }} class="fas fa-trash"></i>
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

    const toastProperties = {
      autoClose: 2000,
      position: toast.POSITION.BOTTOM_RIGHT,
      pauseOnFocusLoss: false
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
        toast.error("Could not load scenario", toastProperties);
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

        <div class="container">
          <div class="center">
            <center style={{ fontSize: 50, color: '#b0bec5', fontFamily: '"Lucida Sans Unicode", "Lucida Grande", sans-serif' }}>
              Empty
            </center>
          </div>
        </div>

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
        size={24}
        backdropClicked={() => {
          this.closePanel();
        }}>

        <div className="window-content" style={{ background: '#4b4b4b', height: '100%' }}>

          <div style={{ paddingBottom: 10, background: '#1a80df', paddingTop: 10 }}>
            <div >

              {/**<img className="logo" src={Logo} />**/}
              <h2 style={{ paddingLeft: 20, color: 'white' }}>Scenarios</h2>

            </div>


            <div style={{ paddingLeft: 10, marginLeft: 15, backgroundColor: '#1a80df', borderRadius: 10, width: '90%' }}>
              <i id="goBackBtn" onClick={() => this.goBack()} style={{ float: 'left', marginTop: 6, fontSize: 20, marginRight: 12 }} className="back-button fas fa-undo-alt"></i>
              <div className="path-font" style={{ fontSize: 20 }}>
                {(this.state.currPath.length > 0 && this.state.currPath) ||
                  '/'}
              </div>
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
            parentPath={this.state.currPath}
            isOpen={this.state.isSavePopupOpen} />
        </div>
      </SlidingPanel>







    </Styles>)
  }
}

export default ScenariosWindow;
