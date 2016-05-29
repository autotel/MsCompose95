var mixerSliders=[];
var dials=[0];
function activate(){};

nx.onload = function() {

  nx.colorize("accent", "#0CC");
  nx.globalWidgets=false;
  // nx.widgets["metro1"].sendsTo(function(data){
  //   // console.log(data);
  //
  // });
  // nx.widgets["metro1"].speed=33;
  nx.widgets["number1"].set({
    value: Tone.Transport.bpm.value
  })
  // nx.widgets["number1"].sendsTo(function(data){
  //   nx.widgets["metro1"].speed=data.value;
  // });

  for(chan in channels){
    var channel=channels[chan];
    thiscontainer=$('<div class="color_'+chan+' mixerPanel" id="editorPanel_'+chan+'"></div>');
    editorContainer=$('<div class="color_'+chan+' editorPanel"></div>');
    (function(){
      var mychan=chan;
      thiscontainer.on("mousedown",function(){
        focusChannel(mychan);
      });
    }());
    $("#pane").append(thiscontainer);
    $(thiscontainer).append(editorContainer);
    nx.add( "button" ,{name:"trigger"+chan, parent:thiscontainer, class:"trhee"});
    // nx.add( "slider" ,{name:"vol"+chan, parent:thiscontainer,val:0.25});
    mixerSliders[chan]=new Slider(chan,thiscontainer);
    $("#trigger"+chan).css({width:"30px",height:"30px",display:"block"});
    if(channel.type=="melodic"){
      // nx.add( "waveform" ,{name:"cuep"+chan, parent:editorContainer,width:200,height:30});
      delay=new Tone.JCReverb(0.3);
      delay.wet=0.1;
      channels[chan].synth=new Tone.SimpleFM (channels[chan].options).connect(delay);
      channels[chan].engine=channels[chan].synth;
      delay.toMaster();
    }else{
      nx.add( "waveform" ,{name:"cuep"+chan, parent:editorContainer,width:200,height:30});
      delay=new Tone.JCReverb(0.3);
      delay.wet=0.2;
      channels[chan].sampler=new Tone.Sampler(channels[chan].source,{
        retrigger:true
      }).connect(delay);
      channels[chan].engine=channels[chan].sampler.player;
      delay.toMaster();
    }
  }
  // stepFunction=function(data){
  //   if(data.stepVal==1){
  //     selection=data.sequencer%channels.length;
  //     channels[selection].engine.start(0,channels[selection].startOffset,channels[selection].endTime);
  //   }
  // }


  // matrix.sequence(240);

        // channels[1].engine.start();
//

  Tone.Buffer.on('load',function(){
    // player.start();
    // console.log("tone buffer ready");
    for(chan in channels){
      function a(){
        var thisChan=chan;9
        nx.widgets["trigger"+thisChan].on("*",function(data){
          if(data.press==1){
            var loopStart=channels[thisChan].startOffset;
            var loopEnd=channels[thisChan].endTime;
            channels[thisChan].sampler.triggerAttack(false,0,1,{start:loopStart,end:loopEnd});
            //
            // console.log(thisChan);
          }
        });
        initval=0.5;
        if(channels[thisChan].hasOwnProperty("volume")){
          initval=channels[thisChan].volume;
        }
        mixerSliders[thisChan].setData(initval);

        channels[thisChan].engine.volume.value=initval*70-60;
        // channels[thisChan].engine.volume=0.5*70-60;
        mixerSliders[thisChan].onChange(function(data){
          console.log(data);
          channels[thisChan].engine.volume.value=data.value*70-60;
          //just for export purposes:
          channels[thisChan].volume=data.value*70-60;
        })
        // mixerSliders[thisChan].addClass("color_"+thischan);
        nx.widgets["cuep"+thisChan].setBuffer( channels[thisChan].engine._buffer._buffer);
        nx.widgets["cuep"+thisChan].select(channels[thisChan].startOffset*1000,(channels[thisChan].endTime+channels[thisChan].startOffset)*1000)
        $("#cuep"+thisChan).css({width:"390px",height:"100px"});
        nx.widgets["cuep"+thisChan].on("*",function(data){
          // if(data.press==1){
          //pendiente:endoffset??
            channels[thisChan].startOffset=data.starttime/1000;
            channels[thisChan].endTime=(data.stoptime-data.starttime)/1000;
            // channels[thisChan].engine.start(0,channels[thisChan].startOffset,channels[thisChan].endTime);
            // console.log(data);
          // }
        });

      };
      if(channels[chan].type=="sampler")
      a();
    }
  });
};