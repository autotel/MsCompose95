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
    thiscontainer=$('<div class="color_'+chan+' mixerPanel" id="mixerPanel_'+chan+'" style="background-color:transparent"></div>');
    editorContainer=$('<div id="editor_'+chan+'" class="editorPanel"></div>');
    editorTrigger=$('<div id="trigger_'+chan+'" class="msbutton triggerButton"></div>');
    (function(){
      var mychan=chan;
      thiscontainer.on("mousedown",function(){
        focusChannel(mychan);
      });
    }());
    $("#mixerPane").append(thiscontainer);
    $("#editorPane").append(editorContainer);

    // nx.add( "button" ,{name:"trigger"+chan, parent:thiscontainer, class:"trhee"});
    thiscontainer.append(editorTrigger);
    // nx.add( "slider" ,{name:"vol"+chan, parent:thiscontainer,val:0.25});
    mixerSliders[chan]=new Slider(chan,thiscontainer,{height:87});
    $("#trigger"+chan).css({width:"30px",height:"30px",display:"block"});
    if(channel.type=="melodic"){
      channel.panelElements={};
      // nx.add( "waveform" ,{name:"cuep"+chan, parent:editorContainer,width:200,height:30});
      delay=new Tone.JCReverb(0.3);
      channel.filter=new Tone.Filter().connect(delay);
      delay.wet=0.1;
      channels[chan].synth=new Tone.SimpleFM (channels[chan].options).connect(channel.filter);
      channels[chan].engine=channels[chan].synth;
      channel.panelElements.carrierAttack=new Slider(chan,editorContainer,{width:"500px",height:"20px"},"carrierAttack");
      channel.panelElements.carrierDecay=new Slider(chan,editorContainer,{width:"500px",height:"20px"},"carrierDecay");
      channel.panelElements.filterfq=new Slider(chan,editorContainer,{width:"500px",height:"20px"},"filterfq");
      channel.panelElements.filterq=new Slider(chan,editorContainer,{width:"500px",height:"20px"},"filterq");
      channel.panelElements.filtergain=new Slider(chan,editorContainer,{width:"500px",height:"20px"},"filtergain");
      channel.panelElements.harmonicity=new Slider(chan,editorContainer,{width:"500px",height:"20px"},"harmonicity");
      channel.panelElements.modulationIndex=new Slider(chan,editorContainer,{width:"500px",height:"20px"},"modulationIndex");
      for(itm in channel.panelElements){
        panelElement=channel.panelElements[itm]
        panelElement.vertical=false;
      }
      delay.toMaster();
    }else{
      nx.add( "waveform" ,{name:"cuep"+chan, mode:"edge", parent:editorContainer,width:200,height:30});
      nx.widgets["cuep"+chan].mode="edge";
      // delay=new Tone.JCReverb(0.3);
      // delay.wet=0.2;
      channels[chan].sampler=new Tone.Sampler(channels[chan].source,{
        retrigger:true
      }).toMaster();
      channels[chan].engine=channels[chan].sampler.player;
      // delay.toMaster();
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
      function initSampler(){
        var thisChan=chan;
        $("#trigger_"+thisChan).on("click mouseenter",function(event){
          // console.log(event);
          if((event.type=="mouseenter"&!mouse.buttonDown)){
            return false;
          }
          var loopStart=channels[thisChan].startOffset;
          var loopEnd=channels[thisChan].endTime;
          channels[thisChan].sampler.triggerAttack(false,0,1,{start:loopStart,end:loopEnd});
        });
        initval=0.5;
        if(mixerSliders[thisChan].data.value==0){
          if(channels[thisChan].hasOwnProperty("volume")){
            initval=channels[thisChan].volume;
          }
        }else{
          initval=mixerSliders[thisChan].data.value;
        }
        // channels[thisChan].engine.volume.value=initval*70-60;
        // channels[thisChan].engine.volume=0.5*70-60;
        mixerSliders[thisChan].onChange(function(data){
          console.log(data);
          channels[thisChan].engine.volume.value=data.value*70-60;
          //just for export purposes:
          channels[thisChan].volume=data.value*70-60;
        })
        mixerSliders[thisChan].setData(initval);
        // mixerSliders[thisChan].addClass("color_"+thischan);
        nx.widgets["cuep"+thisChan].setBuffer( channels[thisChan].engine.buffer._buffer);
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
      function initSynth(){
        var thisChan=chan;
        var channel=channels[chan];
        nx.widgets["trigger"+thisChan].on("*",function(data){
          if(data.press==1){
            channel.engine.triggerAttackRelease(melodicScale[0], "8n");
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

        channel.panelElements.carrierAttack.onChange(function(data){
          channel.engine.carrier.envelope.attack=data.value*10+0.01;
          //just for export purposes:
          // channel.volume=channel.engine.attack.value;
        });
        channel.panelElements.carrierDecay.onChange(function(data){
          channel.engine.carrier.envelope.decay=data.value+1.01;
          channel.engine.carrier.envelope.sustain=data.value*5+0.01;
          channel.engine.carrier.envelope.release=data.value*10+0.01;
          //just for export purposes:
          // channel.volume=channel.engine.sustain.value;
        });
        channel.panelElements.filterfq.onChange(function(data){
          channel.filter.frequency.value=data.value*2200;
          //just for export purposes:
          // channel.volume=channel.engine.frequency.value;
        });
        channel.panelElements.filterq.onChange(function(data){
          channel.filter.Q.value=data.value*2;
          //just for export purposes:
          // channel.volume=channel.engine.frequency.value;
        });
        channel.panelElements.filtergain.onChange(function(data){
          channel.filter.gain.value=data.value*2;
          //just for export purposes:
          // channel.volume=channel.engine.frequency.value;
        });
        channel.panelElements.harmonicity.onChange(function(data){
          channel.engine.harmonicity.value=data.value*8-2;
          //just for export purposes:
          channel.volume=channel.engine.harmonicity.value;
        });
        channel.panelElements.modulationIndex.onChange(function(data){
          channel.engine.modulationIndex.value=data.value*30;
          //just for export purposes:
          channel.volume=channel.engine.modulationIndex.value;
        });
        for(i in channel.panelElements){
          if(channel.hasOwnProperty(i)){
            channel.panelElements[i].setData(channel[i]);
          }
        }
      }
      if(channels[chan].type=="sampler"){
        initSampler();
      }else{
        initSynth();
      }
    }
  });
};
focusChannel=function(id){
  console.log($("#color_"+id)[0]);
  $(".editorPanel").removeClass("onFocus");
  $("#editor_"+id).addClass("onFocus");
}