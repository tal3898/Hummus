import React, { useState } from "react";
import styled from "styled-components";

const Main = styled("div")`
  font-family: sans-serif;
  background: #f0f0f0;
  height: 100vh;
`;

const DropDownContainer = styled("div")`
`;

const DropDownHeader = styled("div")`
  margin-bottom: 0.2em;

  border-radius: 0px 0px 0px 0px;
-moz-border-radius: 0px 0px 0px 0px;
-webkit-border-radius: 0px 0px 0px 0px;
border: 1px solid #d1d1d1;

  padding: 0.4em 2em 0.4em 1em;
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.15);
  font-weight: 500;
  font-size: 1.3rem;
  color: #3faffa;
  background: #ffffff;
`;

const DropDownListContainer = styled("div")`
  max-height: 0em;
`;

const DropDownList = styled("ul")`
  padding: 0;
  margin: 0;
  padding-left: 1em;

  max-height:9em;
  overflow-y: scroll;

  background: #ffffff;
  border: 2px solid #e5e5e5;
  box-sizing: border-box;
  color: #3faffa;
  font-size: 1.2rem;
  font-weight: 500;
  &:first-child {
    padding-top: 0.8em;
  }
`;

const ListItem = styled("div")`
  list-style: none;
  margin-bottom: 0.4em;
  margin-left: 0.5em;
`;

const ListItemTitle = styled("li")`
  list-style: none;
  font-weight: 800;
  margin-bottom: 0.5em;
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
    <DropDownContainer style={{width: props.width || '13.7em'}}>
      <DropDownHeader onClick={toggling}>select objectives</DropDownHeader>
      {isOpen && (
        <DropDownListContainer>
          <DropDownList>
            {Object.keys(inputJson).map((key) => (
              <div>
                <ListItemTitle>{key}</ListItemTitle>
                {inputJson[key].map((value, index) => (
                  <ListItem>
                    <input
                      style={{ display: "inline-block" }}
                      type="checkbox"
                      id="vehicle1"
                      name="vehicle1"
                      value="Bike"
                      checked={checkedEntities[key][index]}
                      disabled={
                        numberOfSelectedEntities === numberOfEntitiesToSelect &&
                        !checkedEntities[key][index]
                      }
                      onChange={(e) => checklistClicked(e, key, index)}
                    />
                    <span>{value}</span>
                  </ListItem>
                ))}
              </div>
            ))}
          </DropDownList>
        </DropDownListContainer>
      )}
    </DropDownContainer>
  );
}
