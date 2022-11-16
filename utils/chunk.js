export const chunkArray = (myArray, divider) => {
  this.teamsGenerated = [];
  let i = 0;
  let arrayLen = myArray.length;
  let tempArray = [];
  for (i = 0; i < arrayLen; i += divider) {
    let divide = myArray.slice(i, i + divider);
    tempArray.push(divide);
  }
  this.teamsGenerated.push(...tempArray);
  this.teamsNumb = this.teamsGenerated.length;
  this.playerSelectionIsVisible = false;
  this.resetBtnIsVisible = true;
  this.MsgIsVisible = false;
  return tempArray;
};
