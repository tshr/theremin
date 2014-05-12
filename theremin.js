(function() {

  var root = this;

  // Set AudioContext to vendor version
  root.AudioContext = root.AudioContext || root.webkitAudioContext
                                        || root.mozAudioContext
                                        || root.oAudioContext
                                        || root.msAudioContext;

  if (!root.AudioContext) throw "The Web Audio API is not available in this environment";

  // Create Theremin root object
  var _ = root.Theremin = {};

  _.registerContext = function(context){
    return _.context = context;
  };

  _.getContext = function(){
    return _.context;
  };

  _.playSound = function(buffer) {

    if (!_.context) throw "Theremin does not have a context, give Theremin an audio context by passing one to Theremin.registerContext";

    var source = _.context.createBufferSource();
    source.buffer = buffer;
    source.connect(_.context.destination);
    source.start(0);
  };

}());