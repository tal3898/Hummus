import React, { useState } from "react";
import styled from "styled-components";

const Styles = styled.div`
.container-drop-down:focus {
  outline: none !important;
  border: 1px solid #123456;
}

.dropdown-list {
  animation-name: dropdown-animation;
  animation-duration: 0.5s;
}

@keyframes dropdown-animation {
  from {
      height:0em;
  }
  to {
      max-height:9em;
  }
}

`;

const DropDownContainer = styled("div")`
`;



const DropDownHeader = styled("div")`
  margin-bottom: 0.2em;
  cursor: default;

  border-radius: 5px;
  -moz-border-radius: 5px;
  -webkit-border-radius: 5px;
  border: 1px solid #ced4da;

  apadding: 0.4em 2em 0.4em 1em;
  
  text-align: right;
  padding-right: 0.4em;

  font-weight: 350;
  font-size: 1.2rem;
  color: #3faffa;
  background: #ffffff;
  position: relative;
  z-index: 1;
`;

const DropDownListContainer = styled("div")`
  max-height: 0em;
  
`;

const DropDownList = styled("ul")`
  position: relative;
  z-index: 2;
  padding: 0;
  margin: 0;
  padding-left: 1em;

  max-height:9em;
  overflow-y: scroll;

  -webkit-box-shadow: 0px 0px 13px 0px rgba(0,0,0,0.38);
  -moz-box-shadow: 0px 0px 13px 0px rgba(0,0,0,0.38);
  box-shadow: 0px 0px 13px 0px rgba(0,0,0,0.38);

  background: #ffffff;
  border: 2px solid #e5e5e5;
  box-sizing: border-box;
  color: #3faffa;
  font-size: 1.2rem;
  font-weight: 500;

`;

const ListItem = styled("div")`
  list-style: none;
  text-align: right;
  display: flex;
  font-family:Verdana;

  margin-bottom: 0.2em;
  margin-right: 1.3em;
`;

const ListItemTitle = styled("li")`
  list-style: none;
  text-align: right;
  cursor: default;
  margin-right: 0.5em;
`;

export default function App(props) {
  const [isOpen, setIsOpen] = useState(false);
  const [numberOfSelectedEntities, setNumberOfSelectedEntities] = useState(0);

  const inputJson = props.input;
  const inputJsonCopy = {};

  for (var key in inputJson) {
    inputJsonCopy[key] = new Array(inputJson[key].length).fill(false);
  }

  const [checkedEntities, setCheckedEntities] = useState(inputJsonCopy);

  const numberOfEntitiesToSelect = props.entitiesSelectLimit;

  const toggling = () => setIsOpen(!isOpen);

  const checklistClicked = (event, step, index) => {
    console.log("tal");
    checkedEntities[step][index] = event.target.checked;
    setCheckedEntities(checkedEntities);

    if (event.target.checked) {
      setNumberOfSelectedEntities(numberOfSelectedEntities + 1);
    } else {
      setNumberOfSelectedEntities(numberOfSelectedEntities - 1);
    }

    console.log(JSON.stringify(checkedEntities));
    var customEvent = {
      value: checkedEntities
    };
    props.onChange(customEvent);
    console.log(JSON.stringify(customEvent));
  };

  return (
    <Styles>
      <div style={{ width: props.width || '13.7em' }} tabIndex="0"  >
        <DropDownHeader onClick={toggling} className="container-drop-down" >
          בחר יעדים 
        <i className="fas fa-angle-down" style={{ float: 'left', marginTop: 5, marginLeft: 5 }} ></i>
        </DropDownHeader>
        {isOpen && (
          <DropDownListContainer >
            <DropDownList className="dropdown-list">
              {Object.keys(inputJson).map((key) => (
                <div>
                  <ListItemTitle>{key}</ListItemTitle>
                  {inputJson[key].map((value, index) => (
                    <ListItem>
                      <input
                        style={{marginTop:8, marginLeft:5}}
                        type="checkbox"
                        id={"entity"+index}
                        value="Bike"
                        checked={checkedEntities[key][index]}
                        disabled={
                          numberOfSelectedEntities === numberOfEntitiesToSelect &&
                          !checkedEntities[key][index]
                        }
                        onChange={(e) => checklistClicked(e, key, index)}
                      />
                      <label for={"entity"+index} style={{ width: '95%', marginBottom:0 }}>{value}</label>
                    </ListItem>
                  ))}
                </div>
              ))}
            </DropDownList>
          </DropDownListContainer>
        )}
      </div>
    </Styles>
  );
}
