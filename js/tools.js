function addClass(elem, newClass){
  elem.setAttribute('class', elem.getAttribute('class') + " " + newClass);
}

function getRandomInt(min, max){
  return Math.floor(Math.random() * Math.floor(max - min) + min);
}
function removeClass(element, class_)
{
  let classes = element.getAttribute('class').split(' ').filter(
      function(c)
      {
        return c != class_;
      });
  
  element.setAttribute('class', classes);
}
