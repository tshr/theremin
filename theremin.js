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
      this.buffer = null;
      this.source = null;
      this.play_start = null;
      this.accumulated_duration = 0;
    };

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

    Player.prototype.createSourceAndPlay = function() {
      this.play_start = context.currentTime;
      this.source = context.createBufferSource();
      this.source.buffer = this.buffer;
      this.source.loop = this.loop;
      this.source.connect(context.destination);
      this.source.start(0, this.accumulated_duration);
    };

    Player.prototype.resetPlayer = function() {
      if (this.source) {
        this.source.stop();
        this.source = null;
      }
      this.accumulated_duration = 0;
    };

    Player.prototype.loadBuffer = function(url){

      if(typeof Promise === "undefined") throw "Theremin unable to load buffer because your environment does not support Promises";
      var that = this;
      getAjaxBufferPromise(url).then(function(response) {
        context.decodeAudioData(response, function(loaded_buffer){
          that.buffer = loaded_buffer;
        });
      }, function(error) {
        console.error("Theremin Error: Error loading buffer, " + error);
      });
    };

    Player.prototype.play = function(){

      if (!this.buffer) throw "No buffer loaded for this player";

      if (this.loop) {
        this.accumulated_duration = this.accumulated_duration % this.buffer.duration;
      } else {
        var duration = this.source ? context.currentTime - this.play_start : 0;
        if (this.accumulated_duration + duration > this.buffer.duration) resetPlayer();
      }

      if (!this.source) this.createSourceAndPlay();
    };

    Player.prototype.pause = function(){
      if (this.source) {
        var duration = context.currentTime - this.play_start;
        this.accumulated_duration += duration;
        this.source.stop();
        this.source = null;
      }
    };

    Player.prototype.jumpTo = function(seconds, play) {
      if (this.source) {
        this.source.stop();
        this.source = null;
      }
      this.accumulated_duration = seconds;
      if (play) this.play();
    };

    return Player;
  })();
}());
