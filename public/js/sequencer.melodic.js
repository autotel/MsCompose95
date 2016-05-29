
// var seqProg=0;
var melodicScale=["C2","E2","F#2","A2"];
MelodicSequencer=function(n){
  $("#sequencers").append('<div class="sequencer" id="seq_'+n+'"><p style="position:absolute">'+n+'</p></div>');
  this.alive=false;
  this.jq=$('#seq_'+n);
  this.pos=0;
  this.data=[];
  this.len=Math.pow(2,(seqProg%5)+1);
  this.evry=Math.pow(2,(seqProg%4)+1);
  //must count an [every] amount of beats for each pos increment.
  this.subpos=0;
  this.jq.css({width:16*Math.ceil(this.len)+"px"});
  this.jq.addClass("color_"+seqProg%channels.length);
  this.disp=0;
  this.id=n;
  var me=this;
  seqProg++;
  this.channel=channels[this.id%channels.length];
  for(bn=0; bn<this.len*4; bn++){
    this.data[bn]=new SequencerButton(bn,this)
  }
  this.aliveChild=0;
  this.step=function(){
    this.alive=this.aliveChild>0;
    if(this.alive){
      //each sequencer has a different speed rates. while some plays one step per click, others will have one step per several clock ticks.
      if(this.subpos%this.evry==0){
        //the melodic version of sequencer plays four sequencer steps at each time, like a piano roll of four notes.
        for(paral=0; paral<4; paral++){
          if(this.data[paral*4+this.pos].eval()==1){
            //so, this is called elsewhere aswell.... the channel should have a trigger function

            this.channel.engine.triggerAttackRelease(melodicScale[paral], "8n");
          }
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