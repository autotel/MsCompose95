var loop;

transportStart=function(){
  Tone.Transport.scheduleRepeat (function(time){
    for(n in seqs){
      seqs[n].step();
    }
  }, "32n");


  Tone.Transport.start();
  Tone.Transport.bpm.value = 45;

  nx.widgets["number1"].set({value:Tone.Transport.bpm.value});
  nx.widgets["number1"].sendsTo(function(data){
		console.log(data);
    Tone.Transport.bpm.value=data.value;
  });
};
Tone.Buffer.on('load',function(){
    transportStart();
});