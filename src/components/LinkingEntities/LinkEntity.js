import React, { useState, useContext } from "react";
import HummusContext from '../HummusContext'
import LinkTarget from './LinkTarget'
import LinkObjective from './LinkObjective'

export default function LinkEntity(props) {

    const context = useContext(HummusContext)

    const entitiesLinkPage = {
        Target:
            <LinkTarget
                closePopupCallback={() => { props.closePopupCallback() }}
            />,
        Objective:
            <LinkObjective
                closePopupCallback={() => { props.closePopupCallback() }}
            />

    }

    const currStepEntity = context.data.currScenario.steps[context.data.currOpenStep].entity;

    return (

       <div>
           {entitiesLinkPage[currStepEntity]}
       </div>
    );
}
