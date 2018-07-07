function addClass(elem, newClass){
  elem.setAttribute('class', elem.getAttribute('class') + " " + newClass);
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
