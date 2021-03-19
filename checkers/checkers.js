// check string input (alphaberic only)
const isStringInput = /^[A-Za-z ]+$/;

// check string input (alphanumeric)
const isStringInputWithNumber = /^[A-Za-z0-9 ]+$/;

// check number input (numeric only)
const isNumberInput = /^\d+$/;

// check number input (float only)
const isFloatInput = /[+-]?([0-9]*[.])?[0-9]{2}$/i;

// check valid email format
const isValidEmail = /^[a-z0-9]+[\._]?[a-z0-9]+[@]\w+[.]\w{2,5}$/;

const checkIsValidAlphabeticString = (input) => {
    if(!input) return;
    input = input.toString();
    if(!isStringInput.test(input)) return false;
    return true;
};

const checkIsValidAlphabeticStringWithNumber = (input) => {
    if(!input) return;
    input = input.toString();
    if(!isStringInputWithNumber.test(input)) return false;
    return true;
};

const checkIsValidNumberInput = (input) => {
    if(!input) return;
    input = input.toString();
    if(!isNumberInput.test(input)) return false;
    return true;
};

const checkIsValidEmailInput = (input) => {
    if(!input) return;
    input = input.toString();
    if(!isValidEmail.test(input)) return false;
    return true;
};

module.exports = {
    checkIsValidAlphabeticString,
    checkIsValidAlphabeticStringWithNumber,
    checkIsValidNumberInput,
    checkIsValidEmailInput
};