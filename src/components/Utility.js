import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';

/**
   * The method gets a json that the keys format are with |..|..|, and values or dynamic, like {random}, or {iso}, or enum.
   * so the method gets the json, and convert it to a normal json, when keys are only the name of the keys,
   * and values or normal values.
   * @param {*} json 
   * @param activateFunctionFields - boolean, indicates whether to replace function values with values. if true, 
   * it replace {random} with random string, else, it will leave it {random} (this optinal is for bomba)
   */


const getFieldFinalValue = (key, fieldValue, activateFunctionFields) => {
    var finalValue = fieldValue;
    var fieldType = key.split('|')[1];

    if (fieldValue == '{iso}' && activateFunctionFields) {
        finalValue = new Date().toISOString();;
    } else if (fieldType == "number" || fieldType == "enum" || fieldType == "creator") {
        finalValue = parseInt(fieldValue); // If enum, and looks like this : "50 - ABC", it will parse only the 50 to int
    } else if (fieldType == "float") {
        finalValue = parseFloat(fieldValue);
    } else if (typeof fieldValue == typeof "-" && (fieldValue.includes('{random}') || fieldValue.includes('{text}')) && activateFunctionFields) {
        var randomString = "";
        for (let step = 0; step < 5; step++) {
            var randomLetter = "abcdefghijklmnopqrstuvwxyz"[Math.floor(Math.random() * 1000) % 26];
            randomString += randomLetter
        }
        finalValue = fieldValue.replace('{random}', randomString).replace('{text}', randomString);

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

export const blackList = ['/', '.']; // Cant contain any of those

export const isInputValid = (value) => {
    if (value == '') {
        return false;
    }

    for (var index in blackList) {
        if (value.includes(blackList[index])) {
            return false;
        }
    }


    return true;
};

export const getValue = (obj, path) => {
    var i;
    path = path.split('/');
    path.splice(0, 1);
    for (i = 0; i < path.length - 1; i++)
        obj = obj[path[i]];

    return obj[path[i]];
};

export const isObjectEmpty = (object) => {
    return Object.keys(object) === 0;
}

export const toastProperties = {
    autoClose: 5000,
    position: toast.POSITION.BOTTOM_RIGHT,
    pauseOnFocusLoss: false
};