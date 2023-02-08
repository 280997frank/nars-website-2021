import { string, bool, setLocale } from "yup";

setLocale({
  mixed: {
    required: () => ({ key: "validation.mandatory" }),
    oneOf: () => ({ key: "validation.mandatory" }),
  },
  string: {
    matches: () => ({ key: "validation.invalidName" }),
  },
});

function validateNumber(value?: string) {
  const number = Number(value);
  return !isNaN(number);
}

function validateOnlyOneString(value?: string) {
  if (value.length !== 1) {
    return false;
  } else {
    return true;
  }
}

// const alphabetAndWhitespacePatter-n = /^[A-Za-z\s]*$/;
// source: https://stackoverflow.com/questions/40099273/how-to-use-regular-expression-to-validate-chinese-input
const alphabetAndWhitespaceAndChineseCharsPattern =
  /^[A-Za-z\s\u3000\u3400-\u4DBF\u4E00-\u9FFF]*$/;

export const chineseCharsPattern = /^[\u3000\u3400-\u4DBF\u4E00-\u9FFF]*$/;

export const requiredString = string().required();

export const requiredBoolean = bool().required();

export const requiredOnlyOneString = string()
  .test({
    name: "only-one-character",
    test: validateOnlyOneString,
    message: { key: "validation.onlyOneCharacter" },
  })
  .required();

export const requiredNumber = string()
  .test({
    name: "validate-number",
    test: validateNumber,
    message: { key: "validation.invalidNumber" },
  })
  .required();

export const requiredMobileNumber = string()
  .test({
    name: "validate-mobile-number",
    test: validateNumber,
    message: { key: "validation.invalidMobileNumber" },
  })
  .required();

export const requiredName = requiredString
  .matches(alphabetAndWhitespaceAndChineseCharsPattern)
  .trim();

export const optionalName = string()
  .matches(alphabetAndWhitespaceAndChineseCharsPattern)
  .trim();
