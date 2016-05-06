SequencerButton=function(n,parent){
  this.jq=$('<div class="seqbutton"></div>');
  parent.jq.append(this.jq);
  this.data=0;
  this.n=n;
  var me=this;
  this.setData=function(to,emit){
    if(emit==true){
      sockChange("seqs:"+parent.id+"/data:"+me.n+"","sV",to);
    }
    if(to==1){
      this.data=1;
      this.jq.addClass("on");
      parent.aliveChild++;
    }
    if(to==0){
      this.data=0;
      this.jq.removeClass("on");
      parent.aliveChild--;
    }
  }
  this.jq.on("mousedown tap touchstart",function(event){
    event.preventDefault();
    me.setData(Math.abs(me.data-1),true);
    // me.data=;
    if(me.data==1){
       mouse.switching=true;
    }else{
    //   $(this).removeClass("on");
    //   parent.aliveChild--;
       mouse.switching=false;
     }
  });
  this.jq.on("mouseenter touchenter",function(){
    if(mouse.buttonDown){
      if(mouse.switching){
        if(me.data==0){
          me.setData(1,true);
        }
      }else{
        if(me.data==1){
          me.setData(0,true);
        }
      }
    }
  });
  this.eval=function(){
    var jq=this.jq;
    jq.addClass("turn");
    window.setTimeout(function(){
      jq.removeClass("turn");
    },200);
    return this.data;
  }
}
//defines all the sequencer parameters by math,
//maybe in a funture by styling table
var seqProg=0;
Sequencer=function(n){
  $("#sequencers").append('<div class="sequencer" id="seq_'+n+'"><p style="position:absolute">'+n+'</p></div>');
  this.alive=false;
  this.jq=$('#seq_'+n);
  this.pos=0;
  this.data=[];
  this.len=Math.pow(2,(seqProg%5)+1);
  this.evry=Math.pow(2,(seqProg%4)+1);
  //must count an [every] amount of beats for each pos increment.
  this.subpos=0;
  this.jq.css({width:16*Math.ceil(this.len/4)+"px"});
  this.jq.addClass("color_"+seqProg%channels.length);
  this.disp=0;
  this.id=n;
  var me=this;
  seqProg++;
  this.channel=channels[this.id%channels.length];
  for(bn=0; bn<this.len; bn++){
    this.data[bn]=new SequencerButton(bn,this)
  }
  this.aliveChild=0;
  this.step=function(){
    this.alive=this.aliveChild>0;
    if(this.alive){
      if(this.subpos%this.evry==0){
        // console.log("sq"+this.pos);
        // data={sequencer:this.id,pos:this.pos,stepVal:this.data[this.pos].eval()};
        // this.onStepTrigger(data);
        // stepFunction(data);
        if(this.data[this.pos].eval()==1){
          // this.channel.engine.start(0,this.channel.startOffset,this.channel.endTime);
          //so, this is called elsewhere aswelll.... the channel should have a trigger function
          var loopStart=this.channel.startOffset;
          var loopEnd=this.channel.endTime;
          this.channel.sampler.triggerAttack(false,0,1,{start:loopStart,end:loopEnd});
        }
        this.pos=(this.pos+1)%this.len;
      }else{
      }
    }
    this.subpos++;
  }
  this.die=function(){
    for(bn in this.data){
      this.data[bn].setData(0);
    }
    this.alive=false;
    this.jq.detach();
  }
  // this.onStepTrigger=function(data){
  //   // console.log(data);
  // }
  this.jq.on("mouseenter",function(){
    focusChannel(me.channel.id);
  });
}