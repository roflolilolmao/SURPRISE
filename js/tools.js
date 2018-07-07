function addClass(elem, newClass){
  elem.setAttribute('class', elem.getAttribute('class') + " " + newClass);
}

function getRandomInt(min, max){
  return Math.floor(Math.random() * Math.floor(max - min) + min);
}