
nx.onload = function() {

  nx.colorize("accent", "#0CC");
  nx.globalWidgets=false;
  nx.widgets["metro1"].sendsTo(function(data){
    // console.log(data);
    for(n in seqs){
      seqs[n].step();
    }
  });
  nx.widgets["metro1"].speed=64;
  nx.widgets["number1"].set({
    value: nx.widgets["metro1"].speed
  })
  nx.widgets["number1"].sendsTo(function(data){
    nx.widgets["metro1"].speed=data.value;
  });

  for(chan in channels){
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
    nx.add( "slider" ,{name:"vol"+chan, parent:thiscontainer,val:0.25});
    $("#trigger"+chan).css({width:"30px",height:"30px",display:"block"});
    nx.add( "waveform" ,{name:"cuep"+chan, parent:editorContainer,width:200,height:30});
    channels[chan].engine=new Tone.Player({
      url:channels[chan].source,
      retrigger:true
    }).toMaster();
  }
  // stepFunction=function(data){
  //   if(data.stepVal==1){
  //     selection=data.sequencer%channels.length;
  //     channels[selection].engine.start(0,channels[selection].startOffset,channels[selection].endTime);
  //   }
  // }

  var dials=[0];
  function activate(){};

  // matrix.sequence(240);

        // channels[1].engine.start();
//

  Tone.Buffer.onload = function(){
    // player.start();
    console.log("tone buffer ready");
    for(chan in channels){

      function a(){
        var thisChan=chan;
        nx.widgets["trigger"+thisChan].on("*",function(data){
          if(data.press==1){
            channels[thisChan].engine.start(0,channels[thisChan].startOffset,channels[thisChan].endTime);
            // console.log(thisChan);
          }
        });
        nx.widgets["vol"+thisChan].sendsTo(function(data){
          console.log(data);
          channels[thisChan].engine.volume.value=data.value*70-60;
        })
        initval=0.75;
        nx.widgets["vol"+thisChan].set({
          value:initval
        });

        channels[thisChan].engine.volume.value=initval*70-60;
        // channels[thisChan].engine.volume=0.5*70-60;

        nx.widgets["cuep"+thisChan].setBuffer( channels[thisChan].engine.buffer );
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
      a();
    }
  }
};