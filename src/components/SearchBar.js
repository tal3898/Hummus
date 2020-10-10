import React from 'react';
import styled from 'styled-components';
import Popup from "reactjs-popup";

const Styles = styled.div`

.search-button {
    z-index: 100;
}

.search-fields-button {
    font-size: 25px;
    margin-top: 5px;
    cursor: pointer;
    color: #616161;

    position: relative;
    right: 0;
    top: 0;
}

.search-fields-button-expanding {
    font-size: 25px;
    margin-top: 5px;
    cursor: pointer;
    color: #616161;

    position: relative;
    right: 0;
    top: 0;

    animation-name: button-searchbar-expanding;
    animation-duration: 0.2s;
}

@keyframes button-searchbar-expanding {
    from {
        font-size: 5px;
    }
    to {
        font-size: 25px;
    }
}

.search-fields-button-collapsing {
    font-size: 0px;
    margin-top: 5px;
    cursor: pointer;
    color: #616161;

    position: relative;
    right: 0;
    top: 0;

    animation-name: button-searchbar-collapsing;
    animation-duration: 0.2s;
}

@keyframes button-searchbar-collapsing {
    from {
        font-size: 25px;
    }
    to {
        font-size: 5px;
    }
}


.search-fields-button:hover {
    color: #212121;
}

.search-fields-button-expanding:hover {
    color: #212121;
}

.search-fields-input {
    width: 250px;
    animation-name: searchbar-expanding;
    animation-duration: 0.5s;
}

@keyframes searchbar-expanding {
    from {
        width: 60px;
        opacity: 0;
    }
    to {
        width: 250px;
        opacity: 1;
    }
}


.not-search-fields-input {
    width: 60px;
    opacity: 0;
    animation-name: searchbar-collapsing;
    animation-duration: 0.5s;
}

@keyframes searchbar-collapsing {
    from {
        width: 250px;
        opacity: 1;
    }
    to {
        width: 60px;
        opacity: 0;
    }
}

.searching:focus {
    outline: none !important;
    box-shadow: 0 0 10px #719ECE;
}

.failed-searching:focus {
    outline: none !important;
    border-color: #e57373;
    box-shadow: 0 0 10px #e57373;
}

`;

const SearchStatus = {
    NONE: 'none',
    SEARCHING: 'searching',
    NOT_SEARCHING: 'not_searching'
}

class SearchBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchingStatus: SearchStatus.NONE,
            userFilter: '',
        };

        this.onCloseCallback = props.onClose;
    }

    UNSAFE_componentWillReceiveProps(newProps) {
      
    }

    openSearchBar() {
        this.setState({searchingStatus: SearchStatus.SEARCHING});
    }

    getSearchInputClassName() {
        if (this.state.searchingStatus === SearchStatus.SEARCHING) {
            return "search-fields-input"
        } else if (this.state.searchingStatus === SearchStatus.NOT_SEARCHING) {
            return "not-search-fields-input"
        }
        

        return '';
    }

    getSearchButtonClassName() {
        if (this.state.searchingStatus === SearchStatus.SEARCHING) {
            return "search-fields-button-collapsing"
        } else if (this.state.searchingStatus === SearchStatus.NOT_SEARCHING) {
            return "search-fields-button-expanding"
        } else {
            return 'search-fields-button';   
        }
    }

    inputChanged(event) {
        this.state.userFilter = event.target.value;
        this.setState(this.state); 

        if (this.props.onInputChanged != undefined) {
            this.props.onInputChanged(event);
        }
    }

    keyDown(event) {
        console.log(this.props.isTextNotFound());

        if (this.props.onInputKeyDown != undefined) {
            this.props.onInputKeyDown(event);
        }
    }


    render() {
        return (
            <Styles style={{textAlign: 'right'}}>
                {(this.state.searchingStatus !== SearchStatus.SEARCHING || true) &&
                    <i
                        id="search-fields-button"
                        className={"fas fa-search search-button " + this.getSearchButtonClassName()}
                        style={{position: 'absolute'}}
                        onClick={() => this.openSearchBar()}></i>
                }

                {this.state.searchingStatus !== SearchStatus.NONE &&
                    <div className={this.getSearchInputClassName()} dir="ltr" style={{position: 'absolute', boxShadow: '2px 2px 10px grey' }}>

                        <div class="inner-addon left-addon">
                            <Popup
                                className="action-btn"
                                position="bottom center"
                                on="hover"
                                trigger={
                                    <i style={{ left: 0, top: 5, marginLeft: 10, fontSize: 20, position: 'absolute' }} className="fas search-info-popup fa-info-circle  mt-1"></i>}
                            >
                                <div dir="rtl">
                                    <center>
                                        <div style={{ marginBottom: 2 }}>ניתן לחפש:</div>

                                                1) שם שדה
                                                <br />
                                                2) תיאור שדה
                                                <br />
                                                3) [0] / [1] / [1..0] / [1..1]
                                                </center>
                                </div>
                            </Popup>


                            <input style={{ paddingLeft: 35 }}
                                type="text"
                                className=""
                                placeholder="search"
                                onBlur={() => this.setState({searchingStatus: SearchStatus.NOT_SEARCHING})}
                                id="searchFieldInput"
                                value={this.state.userFilter}
                                placeholder="search"
                                className={" form-control " + (this.props.isTextNotFound() && "failed-searching") }
                                onChange={(event) => this.inputChanged(event)}
                                onKeyDown={(event) => this.keyDown(event)}
                                />
                        </div>
                    </div>
                }
            </Styles>
        )
    }
}

export default SearchBar;