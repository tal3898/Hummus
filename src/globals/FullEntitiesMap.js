
import english_2 from '../jsonFormats/english_2.json'
import math_2 from '../jsonFormats/math_2.json'
import chemistry_2 from '../jsonFormats/chemistry_2.json'

import english_x from '../jsonFormats/english_x.json'
import math_x from '../jsonFormats/math_x.json'
import chemistry_x from '../jsonFormats/chemistry_x.json'

import english_2_Description from '../jsonFormats/english_2_Description.json'

console.log('bla ' + JSON.stringify(english_2_Description))

export const FullEntitiesMap = {
    "English": {
        "2": {
            data: JSON.stringify(english_2),
            description: english_2_Description,
            disabledFields: ['/PrevLesson',
                '/Planing',
                '/Homworks']
        },
        "X": {
            data: JSON.stringify(english_x),
            description: {},
            disabledFields: []
        }
    },
    "Math": {
        "2": {
            data: JSON.stringify(math_2),
            description: {},
            disabledFields: []
        },
        "X": {
            data: JSON.stringify(math_x),
            description: {},
            disabledFields: []
        }
    },
    "Chemistry": {
        "2": {
            data: JSON.stringify(chemistry_2),
            description: {},
            disabledFields: []
        },
        "X": {
            data: JSON.stringify(chemistry_x),
            description: {},
            disabledFields: []
        }
    }
}

