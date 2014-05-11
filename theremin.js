(function() {

  var root = this;

  // Set AudioContext to vendor specific versions
  root.AudioContext = root.AudioContext || root.webkitAudioContext
                                        || root.mozAudioContext
                                        || root.oAudioContext
                                        || root.msAudioContext;

  if (!root.AudioContext) throw "The Web Audio API is not available in this environment";

  // Create Theremin global object
  Theremin = root.Theremin = {};

}).call(this);