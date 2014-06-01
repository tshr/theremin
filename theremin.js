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
      this.accumulated_duration = 0;
    };

    var getAjaxBufferPromise = function(url) {

      if(typeof Promise === "undefined") throw "Theremin unable to load buffer because your environment does not support Promises";

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
      var source = this.source;

      this.play_start = context.currentTime;
      source = context.createBufferSource();
      source.buffer = this.buffer;
      source.loop = this.loop;
      source.connect(context.destination);
      source.start(0, this.accumulated_duration);
    };

    var resetPlayer = function() {
      var source = this.source;

      if (source) {
        source.stop();
        source = null;
      }
      this.accumulated_duration = 0;
    };

    Player.prototype.loadBuffer = function(url){

      var _this = this;

      getAjaxBufferPromise(url).then(function(response) {
        context.decodeAudioData(response, function(loaded_buffer){
          _this.buffer = loaded_buffer;
        });
      }, function(error) {
        console.error("Theremin Error: Error loading buffer, " + error);
      });
    };

    Player.prototype.play = function(){

      if (!this.buffer) throw "No buffer loaded for this player";

      var accumulated_duration = this.accumulated_duration;
      var buffer_duration = this.buffer.duration;
      var source = this.source;

      if (this.loop) {
        accumulated_duration = accumulated_duration % buffer_duration;
      } else {
        var duration = source ? context.currentTime - this.play_start : 0;
        if (accumulated_duration + duration > buffer_duration) resetPlayer.call(this);
      }

      if (!source) createSourceAndPlay.call(this);
    };

    Player.prototype.pause = function(){

      var source = this.source;

      if (source) {
        var duration = context.currentTime - this.play_start;
        this.accumulated_duration += duration;
        source.stop();
        source = null;
      }
    };

    Player.prototype.jumpTo = function(seconds, play) {

      var source = this.source;

      if (source) {
        source.stop();
        source = null;
      }
      this.accumulated_duration = seconds;
      if (play) this.play();
    };

    return Player;
  })();
}());
