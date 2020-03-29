import React from 'react';
import styled from 'styled-components';
import { Form, Col, Row } from 'react-bootstrap';

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
export const ScenariosWindow = () => (
  <Styles>

    <div className="all w3-card-4" style={{ width: 400 }}>
      <header dir="rtl" class="w3-container w3-blue">
        <h1 className="headline">תרחישים</h1>
      </header>


      <div className="w3-container">

        <div dir="rtl" className='scenarios-list'>
          <Row className="field">
            <Col lg="1" className="col-md-2">
              <i class="action far fa-folder-open fa-2x"></i>
            </Col>
            <Col className="col-md-2">
              <span style={{ float: 'right' }} className="scenario-name">טל</span>
            </Col>
          </Row>

          <Row className="field">
            <Col lg="1" className="col-md-2">
              <i class="action far fa-folder-open fa-2x"></i>
            </Col>
            <Col className="col-md-2">
              <span dir="rtl" className="scenario-name">שחר</span>
            </Col>
          </Row>

          <Row className="field">
            <Col lg="1" className="col-md-2">
              <center>
                <i class="action far fa-file fa-2x"></i>
              </center>
            </Col>
            <Col className="col-md-2">
              <span className="scenario-name">כתיבה רגילה</span>
            </Col>
          </Row>

        </div>

      </div>

    </div>





  </Styles>
)