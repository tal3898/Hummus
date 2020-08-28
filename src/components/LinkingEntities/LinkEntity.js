import React, { useState, useContext } from "react";
import HummusContext from '../HummusContext'
import LinkTarget from './LinkTarget'
import LinkObjective from './LinkObjective'
import LinkMission from './LinkMission'
import LinkPlan from './LinkPlan'
import styled from 'styled-components';
import { ToastContainer, toast } from 'react-toastify';


const Styles = styled.div`
.main {
    padding-top: 60px;    
}

.entity-headline {
    margin-bottom: 30px;
}

.description {
    margin-right: 15px;
    margin-bottom: 15px;
    text-align: right;
}
`;


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
            />,
        Mission:
            <LinkMission
                closePopupCallback={() => { props.closePopupCallback() }}
            />,
        Plan:
            <LinkPlan
                closePopupCallback={() => { props.closePopupCallback() }}
            />

    }

    const currStepEntity = context.data.currScenario.steps[context.data.currOpenStep].entity;

    return (

        <Styles>
            <ToastContainer />
            <div className="main">
                {entitiesLinkPage[currStepEntity]}
            </div>
        </Styles>
    );
}
