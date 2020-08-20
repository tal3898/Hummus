import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

// First, checks if it isn't implemented yet.
if (!String.prototype.format) {
    String.prototype.format = function() {
      var args = arguments;
      return this.replace(/{(\d+)}/g, function(match, number) { 
        return typeof args[number] != 'undefined'
          ? args[number]
          : match
        ;
      });
    };
  }

document.onkeyup = function (e) {
    try {
        if (e.ctrlKey && e.keyCode == 8) {
            // ctrl + back
            document.getElementById("goBackBtn").click();
        } if (e.ctrlKey && e.keyCode == 66) {
            // ctrl + b
            document.getElementById("expandAllBtn").click();
        } else if (e.ctrlKey && e.which == 81) {
            // ctrl + q
            document.getElementById("scenariosListBtn").click();
        } else if (e.ctrlKey && e.altKey && e.which == 68) {
            // ctrl + alt + d
            document.getElementById("sendStepBtn").click();
        } else if (e.ctrlKey && e.shiftKey && e.which == 70) {
            // ctrl + shift + f
            document.getElementById("search-fields-button").click();
            document.getElementById("searchFieldInput").focus();
        } else if (e.ctrlKey && e.altKey && e.which == 79) {
            // ctrl + alt + o
            document.getElementById("openSavePopupBtn").click();
        } else if (e.ctrlKey && e.altKey && e.which == 83) {
            // ctrl + alt + s
            document.getElementById("saveScenarioBtn").click();
        } else if (e.ctrlKey && e.altKey && e.which == 83) {
            // ctrl + alt + o
            document.getElementById("saveScenarioBtn").click();
        } else if (e.ctrlKey && e.altKey && e.which == 78) {
            // ctrl + alt + n
            document.getElementById("addStepBtn").click();
        } else if (e.ctrlKey && e.altKey && e.which == 82) {
            // ctrl + alt + r
            document.getElementById("removeStepBtn").click();
        } else if (e.ctrlKey && e.altKey && e.which == 74) {
            // ctrl + alt + j
            document.getElementById("showJsonBtn").click();
        } else if (e.ctrlKey && e.altKey && e.which == 67) {
            // ctrl + alt + c
            document.getElementById("copyJsonBtn").click();
        } else if (e.keyCode == 27) {
            document.getElementsByClassName("glass")[0].click();
        }
    } catch (err) { }
};