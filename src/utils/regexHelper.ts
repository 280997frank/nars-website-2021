export const replaceEnVersionWithHelvetica = (text: string) => {
  return replaceEnVersion(text, 400);
};
export const replaceEnVersionWithHelvetica100 = (text: string) => {
  return replaceEnVersion(text, 100);
};
export const replaceEnVersionWithHelvetica200 = (text: string) => {
  return replaceEnVersion(text, 200);
};
export const replaceEnVersionWithHelvetica300 = (text: string) => {
  return replaceEnVersion(text, 300);
};

// flow ->
// replaceAllTags is eliminate all html tag
// replaceWTag is replace word with brand style, especially for brand font
// replaceAll is find specific word and replace it
// filteredBetweenStrongTag is filter and replace all -thin class to use a normal style between strong tag

const replaceEnVersion = (text: string, fontWeight: number) => {
  const replacedText = replaceAllTags(text);
  const word = replacedText.match(/[a-zA-Z0-9#*.,]+/g);
  let newWord = text;

  // exclude words with '', nbsp, and '-'
  const excludeWord = ["", "nbsp", "*"];

  if (word) {
    // filter all word except exclude word
    const filteredWord = word.filter(
      (item) => excludeWord.indexOf(item) === -1
    );

    // making array to unique
    const uniqueArray = filteredWord.filter(function (item, pos) {
      return filteredWord.indexOf(item) === pos;
    });

    // sort array by length, cause we want to replace the longest word first
    const sortByLength = uniqueArray.sort((a, b) => b.length - a.length);

    // replace all word with font weight
    sortByLength.forEach((item: string) => {
      const textWTag = replaceWTag(item, fontWeight);
      newWord = replaceAll(newWord, item, textWTag);
    });
  }

  return filteredBetweenStrongTag(newWord);
};

export const replaceAllTags = (text: string) => {
  return text.replace(/<\/?[^>]+(>|$)/g, "");
};

const replaceAll = (str: string, find: string, replace: string) => {
  try {
    // g* belongs to the regex category
    // NOTE: `find` = "*" causes error
    let finded: string | RegExp = new RegExp(find, "g");
    if (find.toLowerCase().indexOf("g*") !== -1) {
      finded = find;
    }

    return str.replace(finded, replace);
  } catch (error) {
    console.error(error.message);
    return str;
  }
};

const replaceWTag = (text: string, fontWeight: number) => {
  switch (fontWeight) {
    case 100:
      return `<span class="helvetica-neue-thin">${text}</span>`;
    case 200:
      return `<span class="helvetica-neue-extra-light">${text}</span>`;
    case 300:
      return `<span class="helvetica-neue-light">${text}</span>`;
    default:
      return `<span class="helvetica-neue">${text}</span>`;
  }
};

//(?<=\/) not support in safari, so we use /<strong>\s*(.*?)\s*strong>/g; instead /(?<=\/)<strong>\s*(.*?)\s*strong>/g
const filteredBetweenStrongTag = (text: string) => {
  const regex = /<strong>\s*(.*?)\s*strong>/g;
  const filteredText = text.match(regex);
  let result = text;
  if (filteredText) {
    filteredText.forEach((item) => {
      let replacedText = item;
      if (item.includes("-thin")) {
        replacedText = replaceAll(item, "-thin", "");
      }
      result = result.replace(item, replacedText);
    });
    return result;
  }
  return result;
};
