import React, { useState } from 'react';
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

.w3-card-4 {
  height:600px;
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

    this.getCurrPathContent();
  }

  getCurrPathContent() {

    console.log('seanding')

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        path: this.state.currPath
      })
    };

    fetch('/scenario', requestOptions)
      .then(response => response.json())
      .then(data => {
        var currPathContent = data;
        var files = [];
        var folders = [];

        for (var index in currPathContent) {
          var currContent = currPathContent[index];

          if (currContent.hasOwnProperty('steps')) {
            files.push(currContent);
          } else {
            folders.push(currContent);
          }
        }
        this.setState({ folders: folders });
        this.setState({ files: files });



      }).catch(error => {
        console.error("local error: ", error)
      });
  }

  openFolder(folderJson) {
    var newFolderPath = folderJson.path;
    this.state.currPath = newFolderPath;
    this.setState(this.state);
    this.getCurrPathContent();
  }

  createFolderRow(folderJson) {
    return (
      <Row onClick={() => this.openFolder(folderJson)} className="field">
        <Col lg="1" className="col-md-2">
          <i class="action far fa-folder-open fa-2x"></i>
        </Col>
        <Col className="col-md-2">
          <span style={{ float: 'right' }} className="scenario-name">{folderJson.path.split('/')[folderJson.path.split('/').length - 1]}</span>
        </Col>
      </Row>
    )
  }

  createFileRow(fileJson) {
    return (
      <Row className="field">
        <Col lg="1" className="col-md-2">
          <i class="action far fa-file fa-2x"></i>
        </Col>
        <Col className="col-md-2">
          <span style={{ float: 'right' }} className="scenario-name">{fileJson.path.split('/')[fileJson.path.split('/').length - 1]}</span>
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
              <Form.Control.Feedback type="invalid">
                Please choose a username.
            </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>
        </header>


        <div className="w3-container">

          <div dir="rtl" className='scenarios-list'>
            {this.state.folders.map((folderJson) => this.createFolderRow(folderJson))}

            {this.state.files.map((fileJson) => this.createFileRow(fileJson))}

          </div>

        </div>

      </div>





    </Styles>)
  }
}

export default ScenariosWindow;
