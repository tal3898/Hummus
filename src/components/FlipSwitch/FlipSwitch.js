import React from 'react';
import './FlipSwitch.css';


function FlipSwitch(props) {

    return (
        <div class="flipswitch" onClick={props.onClick} style={{marginTop:5}}>

            <input type="checkbox" name="flipswitch" class="flipswitch-cb" 
                checked={props.checked} />
            <label class="flipswitch-label" for="fs">
                <div class="flipswitch-inner"></div>
                <div class="flipswitch-switch"></div>
            </label>
        </div>

    );
}

export default FlipSwitch;
