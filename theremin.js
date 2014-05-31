(function(){

  // Set AudioContext to vendor version
  this.AudioContext = this.AudioContext || this.webkitAudioContext
                                        || this.mozAudioContext
                                        || this.oAudioContext
                                        || this.msAudioContext;

  if (!this.AudioContext) throw "Theremin Error: The Web Audio API is not available in this environment";

  // Create Theremin object and private variables
  this.Theremin = {};
  var context, version = "0.0.1";

  // Theremin object methods
  Theremin.getVersion = function() {
    return version;
  };

  Theremin.setContext = function(audio_context){
    return context = audio_context;
  };

  Theremin.getContext = function(){
    return context;
  };

  // Theremin Player Constructor
  Theremin.Player = (function() {
    var Player = function(loop){
      this.loop = loop;
    };

    var buffer, source, play_start, accumulated_duration = 0;

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

    var createSourceAndPlay = function() {
      play_start = context.currentTime;
      source = context.createBufferSource();
      source.buffer = buffer;
      source.loop = this.loop;
      source.connect(context.destination);
      source.start(0, accumulated_duration);
    };

    var resetPlayer = function() {
      if (source) {
        source.stop();
        source = null;
      }
      accumulated_duration = 0;
    };

    Player.prototype.getBuffer = function(){
      return buffer;
    };

    Player.prototype.loadBuffer = function(url){

      if(typeof Promise === "undefined") throw "Theremin unable to load buffer because your environment does not support Promises";

      getAjaxBufferPromise(url).then(function(response) {
        context.decodeAudioData(response, function(loaded_buffer){
          buffer = loaded_buffer;
        });
      }, function(error) {
        console.error("Theremin Error: Error loading buffer, " + error);
      });
    };

    Player.prototype.play = function(){

      if (!buffer) throw "No buffer loaded for this player";

      if (this.loop) {
        accumulated_duration = accumulated_duration % buffer.duration;
      } else {
        var duration = source ? context.currentTime - play_start : 0;
        if (accumulated_duration + duration > buffer.duration) resetPlayer();
      }

      if (!source) createSourceAndPlay();
    };

    Player.prototype.pause = function(){
      if (source) {
        var duration = context.currentTime - play_start;
        accumulated_duration += duration;
        source.stop();
        source = null;
      }
    };

    Player.prototype.jumpTo = function(seconds, play) {
      if (source) {
        source.stop();
        source = null;
      }
      accumulated_duration = seconds;
      if (play) this.play();
    };

    return Player;
  })();
}());
