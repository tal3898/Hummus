
import english_2 from '../jsonFormats/english_2.json'
import math_2 from '../jsonFormats/math_2.json'
import chemistry_2 from '../jsonFormats/chemistry_2.json'

import english_x from '../jsonFormats/english_x.json'
import math_x from '../jsonFormats/math_x.json'
import chemistry_x from '../jsonFormats/chemistry_x.json'


export const FullEntitiesMap = {
    "אנגלית": {
        "2": {
            data: JSON.stringify(english_2),
            disabledFields: ['/PrevLesson',
                '/Planing',
                '/Homworks']
        },
        "X": {
            data: JSON.stringify(english_x),
            disabledFields: []
        }
    },
    "חשבון": {
        "2": {
            data: JSON.stringify(math_2),
            disabledFields: []
        },
        "X": {
            data: JSON.stringify(math_x),
            disabledFields: []
        }
    },
    "כמיה": {
        "2": {
            data: JSON.stringify(chemistry_2),
            disabledFields: []
        },
        "X": {
            data: JSON.stringify(chemistry_x),
            disabledFields: []
        }
    }
}

