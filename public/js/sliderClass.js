Slider=function(n,parent,css){
  this.jq=$('<div class="slider-container" style="position:relative"></div>');
  this.sjq=$('<div class="slider-inner" style="pointer-events:none; position:absolute"></div>');
  this.jq.append(this.sjq);
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
  // this.jq.css(css);
  this.data={value:0};
  this.n=n;
  // this.set=function(data){
  //   for(d in data){
  //     this[d]=data[d];
  //   }
  //   this.updateDom();
  // }
  this.setData=function(to,emit){
    if(emit===true){
      sockChange("seqs:"+parent.id+"/data:"+me.n+"","sV",to);
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
      me.setData(1-event.offsetY/me.jq.height());//,true
    }else{
      me.setData(event.offsetX/me.jq.width());//,true
    }
  });

  this.jq.on("mousemove touchenter",function(event){
    if(mouse.buttonDown){
      event.preventDefault();
      if(me.vertical){
        me.setData(1-event.offsetY/me.jq.height());//,true
      }else{
        me.setData(event.offsetX/me.jq.width());//,true
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
      this.sjq.css({bottom:0,width:this.data.value*this.jq.width(),height:"100%"});
    }
  }
}