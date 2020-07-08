import styled from 'styled-components';

const green='green';

const Styles = styled.div`
.json-field {
    font-size: 18px;
    height: 36px; 
    margin-top : 5px;
    width:110%;
}

.failed-searching:focus {
    outline: none !important;
    border:1px solid red;
    box-shadow: 0 0 10px #719ECE;
}

.info-popup-text {
    overflow-wrap: break-word;
    z-index: 100;
}

.ReactVirtualized__Grid__innerScrollContainer { overflow: initial !important; }

.info-popup-div {
    z-index: 100;
}

.json-field:hover {
    background: ${process.env.REACT_APP_entityEditorJsonFieldHover}; 
}

.collapse {
    padding-top: 0.01%;
    padding-bottom:1px;
}

.field-component {
    margin-right: 6px;
}

.color-hover:hover {
    background: #bbdefb; 
}

.field-action {
    padding: 3px;
    margin-left:7px;
    display: none;
    cursor: pointer;
}

.json-field:hover .field-action {
    display: block;
}

.info-txt {
    font-size:13px;
}

.info-field-path-txt {
    font-size:12px;
}


.fa-trash:hover {
    color: #d32f2f;
}

.fa-times:hover {
    color: #d32f2f;
}

.fa-dice:hover {
    color: #388e3c;
}

.fa-clock:hover {
    color: #2196f3;
}

.plus-button {
    color: #81c784;
}

.plus-button:hover {
    color: #66bb6a;
}

.field-info-popup:hover {
    color: #2196f3;
    cursor: arrow;
}

.search-info-popup:hover {
    color: ${process.env.REACT_APP_searchInfoPopup};
    cursor:pointer;
}
`;

export default Styles;