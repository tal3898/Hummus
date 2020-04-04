import React, { useState } from 'react';

/**
   * The method gets a json that the keys format are with |..|..|, and values or dynamic, like {text}, or {iso}, or enum.
   * so the method gets the json, and convert it to a normal json, when keys are only the name of the keys,
   * and values or normal values.
   * @param {*} json 
   */


const getFieldFinalValue = (key, fieldValue) => {
    var finalValue = fieldValue;
    var fieldType = key.split('|')[1];

    if (fieldValue == '{iso}') {
        finalValue = new Date().toISOString();;
    } else if (fieldValue == '{text}') {
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


export const convertJsonTemplateToActualJson = (json) => {
    var resultJson = {};

    // loop on all value fields
    for (var key in json) {
        if (typeof json[key] != 'object') {
            var keyName = key.split('|')[0];
            var keyValue = getFieldFinalValue(key, json[key]);

            resultJson[keyName] = keyValue;
        }
    }

    // loop on all object fileds
    for (var key in json) {
        var keyName = key.split('|')[0];

        // arrays
        if (typeof json[key] == 'object' && Array.isArray(json[key])) {
            resultJson[keyName] = []
            for (var index in json[key]) {
                var singleJsonResult = convertJsonTemplateToActualJson(json[key][index]);
                resultJson[keyName].push(singleJsonResult);
            }
        } else if (typeof json[key] == 'object') {
            var subObjectCovertResult = convertJsonTemplateToActualJson(json[key]);
            resultJson[keyName] = subObjectCovertResult;
        }
    }

    return resultJson;
};
