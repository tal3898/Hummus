import React, { useState } from 'react';

/**
   * The method gets a json that the keys format are with |..|..|, and values or dynamic, like {text}, or {iso}, or enum.
   * so the method gets the json, and convert it to a normal json, when keys are only the name of the keys,
   * and values or normal values.
   * @param {*} json 
   */


const getFieldFinalValue = (key, fieldValue, activateFunctionFields) => {
    var finalValue = fieldValue;
    var fieldType = key.split('|')[1];

    if (fieldValue == '{iso}' && activateFunctionFields) {
        finalValue = new Date().toISOString();;
    } else if (fieldValue == '{text}' && activateFunctionFields) {
        var randomString = "";
        for (let step = 0; step < 5; step++) {
            var randomLetter = "abcdefghijklmnopqrstuvwxyz"[Math.floor(Math.random() * 1000) % 26];
            randomString += randomLetter
        }
        finalValue = randomString
    } else if (fieldType == "number" || fieldType == "enum") {
        finalValue = parseInt(fieldValue); // If enum, and looks like this : "50 - ABC", it will parse only the 50 to int
    } else if (fieldType == "float") {
        finalValue = parseFloat(fieldValue);
    }

    return finalValue;
}


export const convertJsonTemplateToActualJson = (json, disabledFields = [], activateFunctionFields = true, parentPath = '') => {
    var resultJson = {};

    // loop on all value fields
    for (var key in json) {
        if (typeof json[key] != 'object') {
            var keyName = key.split('|')[0];
            var keyPath = parentPath + '/' + keyName;

            // If field is not disabled
            if (!disabledFields.includes(keyPath)) {
                var keyValue = getFieldFinalValue(key, json[key], activateFunctionFields);
                resultJson[keyName] = keyValue;
            }
        }
    }

    // loop on all object fileds
    for (var key in json) {
        var keyName = key.split('|')[0];
        var keyFullPath = parentPath + '/' + keyName;

        // if array, and field is not disabled
        if (typeof json[key] == 'object' && Array.isArray(json[key]) && !disabledFields.includes(keyFullPath)) {
            resultJson[keyName] = []
            for (var index in json[key]) {
                var elementFullPath = keyFullPath + '/' + index;

                // If curr element in array, is not disabled
                if (!disabledFields.includes(elementFullPath)) {
                    var singleJsonResult = convertJsonTemplateToActualJson(json[key][index],
                        disabledFields,
                        activateFunctionFields,
                        elementFullPath);
                    resultJson[keyName].push(singleJsonResult);
                }
            }
        // else if object, and is not disabled
        } else if (typeof json[key] == 'object' && !disabledFields.includes(keyFullPath)) {
            var subObjectCovertResult = convertJsonTemplateToActualJson(json[key],
                disabledFields,
                activateFunctionFields,
                keyFullPath);
            resultJson[keyName] = subObjectCovertResult;

        }
    }

    return resultJson;
};
