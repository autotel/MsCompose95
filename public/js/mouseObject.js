
var mouse={
  tool:"draw"
};


$(document).ready(function(){
  $(document).on("mousedown",function(event){
    mouse.buttonDown=true;
  });
  $(document).on("mouseup",function(event){
    mouse.buttonDown=false;
  });
});