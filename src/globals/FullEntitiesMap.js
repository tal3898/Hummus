
import target_2 from '../jsonFormats/target_2.json'
import objective_2 from '../jsonFormats/objective_2.json'
import mission_2 from '../jsonFormats/mission_2.json'
import plan_2 from '../jsonFormats/plan_2.json'


import target_x from '../jsonFormats/target_x.json'
import objective_x from '../jsonFormats/objective_x.json'
import mission_x from '../jsonFormats/mission_x.json'
import plan_x from '../jsonFormats/plan_x.json'


export const FullEntitiesMap = {
    "Target": {
        "2": {
            data: JSON.stringify(target_2),
            disabledFields: ['/PrevLesson',
                '/Planing',
                '/Homworks']
        },
        "X": {
            data: JSON.stringify(target_x),
            disabledFields: []
        }
    },
    "Objective": {
        "2": {
            data: JSON.stringify(objective_2),
            disabledFields: []
        },
        "X": {
            data: JSON.stringify(objective_x),
            disabledFields: []
        }
    },
    "Mission": {
        "2": {
            data: JSON.stringify(mission_2),
            disabledFields: []
        },
        "X": {
            data: JSON.stringify(mission_x),
            disabledFields: []
        }
    },
    "Plan": {
        "2": {
            data: JSON.stringify(plan_2),
            disabledFields: []
        },
        "X": {
            data: JSON.stringify(plan_x),
            disabledFields: []
        }
    }
}

