
import target_2 from '../jsonFormats/target_2.json'
import objective_2 from '../jsonFormats/objective_2.json'
import mission_2 from '../jsonFormats/mission_2.json'
import plan_2 from '../jsonFormats/plan_2.json'


import target_x from '../jsonFormats/target_x.json'
import objective_x from '../jsonFormats/objective_x.json'
import mission_x from '../jsonFormats/mission_x.json'
import plan_x from '../jsonFormats/plan_x.json'

import target_2_desc from '../jsonFormats/descriptions/target_2_desc.json';
import objective_2_desc from '../jsonFormats/descriptions/objective_2_desc.json';
import mission_2_desc from '../jsonFormats/descriptions/mission_2_desc.json';
import plan_2_desc from '../jsonFormats/descriptions/plan_2_desc.json';

export const FullEntitiesMap = {
    "Target": {
        "2": {
            data: target_2,
            description: target_2_desc,
            disabledFields: ['/PrevLesson',
                '/Planing',
                '/Homworks']
        },
        "X": {
            data: target_x,
            description: target_2_desc,
            disabledFields: []
        }
    },
    "Objective": {
        "2": {
            data: objective_2,
            description: objective_2_desc,
            disabledFields: []
        },
        "X": {
            data: objective_x,
            description: objective_2_desc,
            disabledFields: []
        }
    },
    "Mission": {
        "2": {
            data: mission_2,
            description: mission_2_desc,
            disabledFields: []
        },
        "X": {
            data: mission_x,
            description: mission_2_desc,
            disabledFields: []
        }
    },
    "Plan": {
        "2": {
            data: plan_2,
            description: plan_2_desc,
            disabledFields: []
        },
        "X": {
            data: plan_x,
            description: plan_2_desc, 
            disabledFields: []
        }
    }
}

