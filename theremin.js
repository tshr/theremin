(function(){

  // Set AudioContext to vendor version
  this.AudioContext = this.AudioContext || this.webkitAudioContext
                                        || this.mozAudioContext
                                        || this.oAudioContext
                                        || this.msAudioContext;

  if (!this.AudioContext) throw "Theremin Error: The Web Audio API is not available in this environment";

  // Create Theremin object and private variables
  this.Theremin = {};
  var Player = Theremin.Player;
  var version = "0.0.1";
  var context;

  Theremin.getVersion = function() {
    return version;
  };

  Theremin.setContext = function(audio_context){
    return context = audio_context;
  };

  Theremin.getContext = function(){
    return context;
  };

  Theremin.Player = function(){

    var buffer, source, play_start;
    var total_duration = 0;

    var getAjaxBufferPromise = function(url) {

      return new Promise(function(resolve, reject) {

        var request = new XMLHttpRequest();

        request.open('GET', url, true);
        request.responseType = 'arraybuffer';

        request.onload = function() {
          request.status === 200 ? resolve(request.response) : reject(Error(request.statusText));
        };

        request.onerror = function(){
          reject(Error("Theremin Error: AJAX request Network Error "));
        };

        request.send();
      });
    };

    this.getBuffer = function(){
      return buffer;
    };

    this.loadBuffer = function(url){

      if(typeof Promise === "undefined") throw "Theremin unable to load buffer because your browser does not support Promises";

      getAjaxBufferPromise(url).then(function(response) {
        context.decodeAudioData(response, function(loaded_buffer){
          buffer = loaded_buffer;
        });
      }, function(error) {
        console.error("Theremin Error: Error loading buffer, " + error);
      });
    };

    this.play = function(){

      if (!buffer) throw "No buffer loaded for this player";

      if (!source) {
        play_start = context.currentTime;

        if (total_duration > buffer.duration) total_duration = 0;
        var offset = total_duration;

        source = context.createBufferSource();
        source.buffer = buffer;
        source.loop = false;
        source.connect(context.destination);
        play_start = context.currentTime;
        source.start(0, offset);
      }
    };

    this.pause = function(){
      if (source) {
        var duration = context.currentTime - play_start;

        source.stop();
        source = null;
        total_duration += duration;
      }
    };
  };

}());
