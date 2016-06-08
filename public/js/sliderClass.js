//pendant: towards a data binding controllers, slidersBindList should be a member of a socket class, and seqs also, therefore, the sockGlobal stuff makes more sense.
//actually there should not be a different list for each kind of element, just a single list for every data-bint element, so in sockgobal's stringtoobject we dont have to hardcode the selection of element seq/slider. The condition woudl be that the addressed object always has the setdata, and also use string names in the emission to sent a warning whenever data crosses object types
var slidersBindList=[];
Slider=function(n,parent,css,label){
  this._bindN=slidersBindList.push(this)-1;
  this.jq=$('<div class="slider-container" style="position:relative"></div>');
  this.sjq=$('<div class="slider-inner" style="pointer-events:none; position:absolute"></div>');
  this.label=label||"";
  this.labeljq=$('<p class="sliderlabel"></p>');
  this.jq.append(this.sjq);
  this.jq.append(this.labeljq);
  if(css)
    this.jq.css(css);
  this.onChangeCallback=function(){};
  if(typeof (parent.append||false)=="function"){
    parent.append(this.jq);
  }else if(typeof (parent.jq.append||false)=="function"){
    parent.jq.append(this.jq);
  }else{
    console.log("a slider couldn't find dom element to attach himself");
  }
  var me=this;
  this.onChange=function(callback){
    me.onChangeCallback=function(){callback(me.data)};
  }
  this.data={value:0};
  this.n=n;
  this.setData=function(to,emit){
    if(emit===true){
      //pendant: in sequencers we use parent.id, and here we use _bindN. Towards a controller API and a more sensical code, I think both should use the bind element array. read note in first line of this file.
      //pendant: parent in seq is what me is here. this is pretty confusing var name decision
      sockChange("slid:"+me._bindN+"","sV",to);
    }
    this.data.value=to;
    this.onChangeCallback();
    this.updateDom();
  }
  this.addClass=function(to){
    this.jq.addClass(to);
  }
  this.vertical=true;
  this.addClass("vertical");
  this.jq.on("mousedown tap touchstart",function(event){
    event.preventDefault();
    if(me.vertical){
      me.setData(1-event.offsetY/me.jq.height(),true);//,true
    }else{
      me.setData(event.offsetX/me.jq.width(),true);//,true
    }
  });

  this.jq.on("mousemove touchenter mouseleave mouseup",function(event){
    if(mouse.buttonDown){
      event.preventDefault();
      var emitThis=event.type=="mouseleave"||event.type=="mouseup"
      if(me.vertical){
        //the strange second paramenter in setdata was true, but it could clog the socket
        me.setData(1-event.offsetY/me.jq.height(),emitThis);//,true
      }else{
        me.setData(event.offsetX/me.jq.width(),emitThis);//,true
      }
    }else{
      // me.jq.addClass("hover");
    }
  });
  this.eval=function(){
    var jq=this.jq;
    jq.addClass("turn");
    window.setTimeout(function(){
      jq.removeClass("turn");
    },200);
    return this.data.value;
  }
  this.updateDom=function(){
    if(this.vertical){
      this.sjq.css({bottom:0,width:"100%",height:this.data.value*this.jq.height()});
    }else{
      this.labeljq.html(this.label);
      this.sjq.css({bottom:0,width:this.data.value*this.jq.width(),height:"100%"});
    }
  }
}