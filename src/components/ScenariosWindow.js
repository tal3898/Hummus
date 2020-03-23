import React from 'react';
import styled from 'styled-components';

const Styles = styled.div`
  .headline {
    font-size: 3.0em;
    font-family: "Lucida Sans Unicode", "Lucida Grande", sans-serif;
    background-color: #1e88e5;
    box-shadow: 1px 5px 5px #666666;
    
    border-radius: 20px;
}

  .main-comp {
      width: 400px;
      height: 700px;
      background: #fafafa;
      border-radius: 20px;
      border-color: black;
      border-width: medium;
      margin: 20px;

      border-width:1px;
      border-style:outset;
  }

  .item {
    height: 40px;
    align: right;
    font-size: 20px;
    padding-left: 15px;
    &:hover { background: #bbdefb; }
  }

`;
export const ScenariosWindow = () => (
  <Styles>
    <div dir='rtl' className='main-comp'>
        <div className='headline'>
            <p>תרחישים</p>
        </div>
        <div className='scenarios-list'>
            <div className='item'>
                a
            </div>
            <div className='item'>
                a
            </div>
            <div className='item'>
                a
            </div>
        </div>
    </div>
  </Styles>
)