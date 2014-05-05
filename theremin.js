(function() {

  var root = this;
  root.Theremin = {};

  root.AudioContext = root.AudioContext || root.webkitAudioContext
                                        || root.mozAudioContext
                                        || root.oAudioContext
                                        || root.msAudioContext;

  if (!root.AudioContext) throw "The Web Audio API is not available in this environment";

}).call(this);