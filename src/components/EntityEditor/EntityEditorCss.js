import styled from 'styled-components';

const green = 'green';

const Styles = styled.div`

.json-field {
    font-size: 18px;
    height: 36px; 
    margin-top : 5px;
    width:110%;
}

.key-name {
    padding-left: 3px;
    padding-right: 4px;
    margin-top: 4px;
    animation-name: enabled-field-fading;
    animation-duration: 0.5s;
}

.key-name-searched {
    background: #fff59d;
    border-radius: 7px;
}

.key-name-disabled {
    text-decoration: line-through;
    opacity: 0.3;
    animation-name: disabled-field-fading;
    animation-duration: 0.5s;
}

@keyframes disabled-field-fading {
    from {
        opacity: 1;
        text-decoration: none;
    }
    to {
        text-decoration: line-through;
        opacity: 0.3;
    }
}


@keyframes enabled-field-fading {
    from {
        opacity: 0.5;
    }
    to {
        opacity: 1;
    }
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

.fa-dice:active {
    color: #1b5e20;
}

.fa-clock:hover {
    color: #2196f3;
}

.fa-clock:active {
    color: #1565c0;
}

.plus-button {
    color: #81c784;
}

.plus-button:hover {
    color: #66bb6a;
}

.plus-button:active {
    color: #388e3c;
}


.field-info-popup:hover {
    color: #2196f3;
    cursor: arrow;
}

.search-info-popup {
    color: #424242;
}

.search-info-popup:hover {
    color: ${process.env.REACT_APP_searchInfoPopup};
    cursor:pointer;
}
`;

export default Styles;