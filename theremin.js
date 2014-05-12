(function() {

  // Set AudioContext to vendor version
  this.AudioContext = this.AudioContext || this.webkitAudioContext
                                        || this.mozAudioContext
                                        || this.oAudioContext
                                        || this.msAudioContext;

  if (!this.AudioContext) throw "The Web Audio API is not available in this environment";

  // Create Theremin object
  var _ = this.Theremin = {};

  _.version = "0.1";

  _.registerContext = function(context){
    return _.context = context;
  };

  _.playSound = function(buffer) {

    if (!_.context) throw "Theremin does not have a context, give Theremin an audio context by passing one to Theremin.registerContext";

    var source = _.context.createBufferSource();
    source.buffer = buffer;
    source.connect(_.context.destination);
    source.start(0);
  };

}());