(function(){

  // Set AudioContext to vendor version
  this.AudioContext = this.AudioContext || this.webkitAudioContext
                                        || this.mozAudioContext
                                        || this.oAudioContext
                                        || this.msAudioContext;

  if (!this.AudioContext) throw "The Web Audio API is not available in this environment";

  // Create Theremin object and private variables
  var _ = this.Theremin = {};
  var version = "0.0.1";
  var context;

  var checkContext = function() {
    if (!context) throw "Theremin does not have a context, give Theremin an audio context by passing one to Theremin.setContext";
  };

  _.getVersion = function() {
    return version;
  };

  _.setContext = function(audio_context){
    return context = audio_context;
  };

  _.getContext = function(){
    return context;
  };

  _.playBuffer = function(buffer, options) {

    checkContext();

    options = typeof options !== 'undefined' ? options : {};
    var offset = typeof options['offset'] !== 'undefined' ? options['offset'] : 0;
    var loop = typeof options['loop'] !== 'undefined' ? options['loop'] : false;
    var source = context.createBufferSource();

    source.buffer = buffer;
    source.loop = loop;
    source.connect(context.destination);
    source.start(0, offset);
    return source;
  };

}());
